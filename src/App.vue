<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { Download, Printer } from "lucide-vue-next";
import PdfFrame from "@i2d/pdf-frame-vue";
import { Button } from "@/components/ui/button";

import AspectRatio from "@/components/ui/aspect-ratio/AspectRatio.vue";
import DarkToggle from "@/components/DarkToggle.vue";
import BandDiagram, { type Band } from "@/components/BandDiagram.vue";

import iaruR1Bandplan from "@/assets/iaru-r1-bandplan.json";
import BandEditor from "@/components/BandEditor.vue";

const title = ref("IARU R1 HF Bandplan");
const bandYOffset = ref([73]);

const bands = ref<Band[]>(iaruR1Bandplan as Band[]);

const pdfBlob = ref();

const updatePdfBlob = (blob: Blob) => {
  pdfBlob.value = blob;
};

const pdfIframeRef = useTemplateRef("pdf-iframe");

const printPdf = () => {
  pdfIframeRef.value?.contentWindow?.print();
};

const downloadPdf = () => {
  if (!pdfBlob.value) return;

  const link = document.createElement("a");
  link.href = pdfBlob.value;
  link.download = `${title.value}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const reset = () => {
  title.value = "IARU R1 HF Bandplan";
  bandYOffset.value = [73];
  bands.value = structuredClone(iaruR1Bandplan) as Band[];
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
        <h1 class="font-bold text-lg dark:text-zinc-50">Bandplan generator</h1>
        <div class="flex gap-2">
          <Button variant="outline" @click="printPdf"
            ><Printer class="w-4 h-4" />Print</Button
          >
          <Button variant="outline" @click="downloadPdf"
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
          @reset-click="reset"
        />
      </aside>
      <div class="w-full h-full p-4">
        <AspectRatio
          :ratio="1.414 / 1"
          class="bg-zinc-100 dark:bg-zinc-900 rounded-lg"
        >
          <iframe
            height="100%"
            width="100%"
            class="border-0"
            ref="pdf-iframe"
            :src="`${pdfBlob}#view=Fit&scrollbar=0&toolbar=0&statusbar=0&messages=0&navpanes=0`"
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
              GeistRegular: 'fonts/Geist-Regular.ttf',
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
              :x="673"
              :y="11"
              text="CW"
              :style="{ fill: '#000', font: '14px GeistBold' }"
            />

            <i-line
              :x1="700"
              :y1="20"
              :x2="724"
              :y2="20"
              :style="{ stroke: '#ADD249', lineWidth: 8 }"
            />

            <i-text
              :x="740"
              :y="11"
              text="PHONE"
              :style="{ fill: '#000', font: '14px GeistBold' }"
            />

            <i-line
              :x1="792"
              :y1="20"
              :x2="816"
              :y2="20"
              :style="{ stroke: '#EF2E36', lineWidth: 8 }"
            />

            <i-text
              :x="832"
              :y="11"
              text="DIGIMODE"
              :style="{ fill: '#000', font: '14px GeistBold' }"
            />

            <i-line
              :x1="905"
              :y1="20"
              :x2="929"
              :y2="20"
              :style="{ stroke: '#1AB4F0', lineWidth: 8 }"
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
              />
            </i-g>
          </i-page>
        </PdfFrame>
      </div>
    </main>
  </div>
</template>
