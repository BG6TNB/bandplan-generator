<script setup lang="ts">
import { onMounted, ref, useTemplateRef, markRaw } from "vue";
import { Download, Printer } from "lucide-vue-next";
import PdfFrame from "@i2d/pdf-frame-vue";
import { Button } from "@/components/ui/button";

import { usePostHog } from "@/composables/usePostHog";
import AspectRatio from "@/components/ui/aspect-ratio/AspectRatio.vue";
import DarkToggle from "@/components/DarkToggle.vue";
import BandDiagram, { type Band } from "@/components/BandDiagram.vue";

import iaruR1Bandplan from "@/assets/iaru-r1-bandplan.json";
import BandEditor from "@/components/BandEditor.vue";
import FeedbackToast from "@/components/FeedbackToast.vue";
import { Toaster } from "@/components/ui/sonner";
import {
  useClipboard,
  useResizeObserver,
  useStorage,
  type MaybeComputedElementRef,
  type MaybeElement,
} from "@vueuse/core";
import { compress, decompress } from "compress-json";
import { toast } from "vue-sonner";
import { usePDF, VuePDF } from "@tato30/vue-pdf";

usePostHog();

const title = useStorage("title", "IARU R1 HF Bandplan");
const bandYOffset = useStorage("bandYOffset", [73]);
const bands = useStorage<Band[]>("bands", iaruR1Bandplan as Band[]);
const colors = useStorage("colors", {
  CW: "#ADD249",
  PHONE: "#EF2E36",
  DIGIMODE: "#1AB4F0",
});

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get("state");
  if (!data) return;

  const decoded = decompress(JSON.parse(atob(data)));
  if (decoded) {
    title.value = decoded.title;
    bandYOffset.value = decoded.bandYOffset;
    bands.value = decoded.bands;
  }
});

onMounted(() => {
  toast(markRaw(FeedbackToast), {
    duration: Infinity,
    closeButton: true,
  });
});

const pdfBlob = ref();

const { pdf, print, download } = usePDF(pdfBlob);
const pdfViewerRef = useTemplateRef("pdf-viewer");

useResizeObserver(
  pdfViewerRef as unknown as MaybeComputedElementRef<MaybeElement>,
  () => {
    pdfViewerRef.value?.reload();
  }
);

const updatePdfBlob = (blob: Blob) => {
  pdfBlob.value = blob;
};

const reset = () => {
  title.value = "IARU R1 HF Bandplan";
  bandYOffset.value = [73];
  bands.value = structuredClone(iaruR1Bandplan) as Band[];
  colors.value = {
    CW: "#ADD249",
    PHONE: "#EF2E36",
    DIGIMODE: "#1AB4F0",
  };

  toast.success("Reset to default");
};

const { copy } = useClipboard();

const copyLink = () => {
  const url = new URL(window.location.href);
  const data = btoa(
    JSON.stringify(
      compress({
        title: title.value,
        bandYOffset: bandYOffset.value,
        bands: bands.value,
      })
    )
  );

  url.search = new URLSearchParams({ state: data }).toString();

  copy(url.toString());

  toast.success("Link copied");
};
</script>

<template>
  <div class="min-h-svh flex flex-col dark:bg-zinc-950">
    <header
      class="sticky top-0 z-50 bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur border-b border-zinc-200 dark:border-zinc-800"
    >
      <div
        class="container mx-auto min-h-14 px-4 py-2 flex items-center justify-between flex-wrap gap-2"
      >
        <div class="flex grow items-center justify-between">
          <h1 class="font-bold text-lg dark:text-zinc-50">
            Bandplan generator
          </h1>
          <Button as="a" variant="link" href="https://ham.guide"
            >ham.guide</Button
          >
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="print(150, title)"
            ><Printer class="w-4 h-4" />Print</Button
          >
          <Button variant="outline" @click="download(title)"
            ><Download class="w-4 h-4" />PDF</Button
          >
          <DarkToggle />
        </div>
      </div>
    </header>
    <main
      class="container flex-1 mx-auto md:grid md:grid-cols-[300px_1fr] md:gap-4 lg:grid-cols-[320px_1fr]"
    >
      <aside class="md:h-[calc(100vh-3.5rem-1px)] overflow-auto no-scrollbar">
        <BandEditor
          v-model:title="title"
          v-model:band-y-offset="bandYOffset"
          v-model:bands="bands"
          v-model:colors="colors"
          @reset-click="reset"
          @copy-click="copyLink"
        />
      </aside>
      <div class="w-full h-full p-4 pb-6 relative">
        <p class="text-sm text-zinc-500 absolute bottom-1 right-4">
          Inspired by Tom S54G
        </p>
        <AspectRatio
          :ratio="1.414 / 1"
          class="bg-zinc-100 dark:bg-zinc-900 rounded-lg md:rounded-xl shadow-lg"
        >
          <VuePDF
            :pdf="pdf"
            fit-parent
            ref="pdf-viewer"
            class="rounded-lg md:rounded-xl overflow-hidden"
          />
        </AspectRatio>

        <PdfFrame
          id="band-plan"
          :info="{ title: 'Bandplan' }"
          :config="{
            margin: 48,
            margins: { top: 40, bottom: 40 },
            fontRegister: {
              GeistBold: 'fonts/Geist-Bold.ttf',
              GeistMedium: 'fonts/Geist-Medium.ttf',
            },
          }"
          class="hidden"
          type="pdf-blob"
          :width="1191"
          :height="842"
          :needOnUpdated="true"
          @on-updated="updatePdfBlob"
        >
          <i-page>
            <i-text
              :width="1143"
              :text="title"
              :style="{ fill: '#000', font: '32px GeistBold' }"
            />

            <i-text
              :x="869"
              :y="19"
              text="CW"
              :style="{ fill: '#000', font: '14px GeistBold' }"
            />

            <i-line
              :x1="896"
              :y1="28"
              :x2="920"
              :y2="28"
              :style="{ stroke: colors.CW, lineWidth: 8 }"
            />

            <i-text
              :x="936"
              :y="19"
              text="PHONE"
              :style="{ fill: '#000', font: '14px GeistBold' }"
            />

            <i-line
              :x1="988"
              :y1="28"
              :x2="1012"
              :y2="28"
              :style="{ stroke: colors.PHONE, lineWidth: 8 }"
            />

            <i-text
              :x="1028"
              :y="19"
              text="DIGIMODE"
              :style="{ fill: '#000', font: '14px GeistBold' }"
            />

            <i-line
              :x1="1101"
              :y1="28"
              :x2="1125"
              :y2="28"
              :style="{ stroke: colors.DIGIMODE, lineWidth: 8 }"
            />

            <i-text
              :x="976"
              :y="0"
              text="© Domantas Vasiliauskas LY1JA"
              :style="{ fill: '#000', font: '10px GeistMedium' }"
            />

            <i-g
              v-for="(band, index) in bands"
              :transform="{ translate: [20, 44 + index * bandYOffset[0]] }"
              :key="JSON.stringify(band)"
            >
              <BandDiagram
                :title="band.title"
                :subtitle="band.subtitle"
                :start="band.start"
                :end="band.end"
                :tick-count="band.tickCount"
                :segments="band.segments"
                :colors="colors"
              />
            </i-g>
          </i-page>
        </PdfFrame>
      </div>
    </main>
  </div>
  <Toaster />
</template>
