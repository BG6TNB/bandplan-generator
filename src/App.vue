<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import Input from "@/components/ui/input/Input.vue";
import { Button } from "@/components/ui/button";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import Slider from "@/components/ui/slider/Slider.vue";
import DarkToggle from "./components/DarkToggle.vue";
import { Plus, Download, Printer, Trash } from "lucide-vue-next";
import AspectRatio from "./components/ui/aspect-ratio/AspectRatio.vue";
import PdfFrame from "@i2d/pdf-frame-vue";
import BandDiagram from "./components/BandDiagram.vue";

const title = ref("IARU R1 HF Bandplan");
const bandYOffset = ref([73]);

const activeAccordion = ref();

const bands = ref([
  {
    title: "28MHz",
    subtitle: "10m",
    start: 28000,
    end: 29700,
    tickCount: [34],
  },
  {
    title: "24MHz",
    subtitle: "12m",
    start: 28000,
    end: 29700,
    tickCount: [34],
  },
]);

const addBand = () => {
  bands.value = [
    ...bands.value,
    { title: "", subtitle: "", start: 0, end: 0, tickCount: [34] },
  ];

  activeAccordion.value = String(bands.value.length - 1);
};

const removeBand = (indexToRemove: number) => {
  bands.value = bands.value.filter((_, index) => index !== indexToRemove);

  if (activeAccordion.value === String(indexToRemove)) {
    // If the removed band was the active one, reset the accordion
    activeAccordion.value = undefined;
  } else if (Number(activeAccordion.value) > indexToRemove) {
    // If the removed band was before the active one, adjust the active accordion index
    activeAccordion.value = String(Number(activeAccordion.value) - 1);
  }
};

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
</script>

<template>
  <div class="min-h-svh flex flex-col dark:bg-zinc-950">
    <header
      class="sticky top-0 z-50 bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur border-b border-zinc-200 dark:border-zinc-800"
    >
      <div
        class="container mx-auto px-4 py-2 flex items-center justify-between"
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
      class="container flex-1 mx-auto md:grid md:grid-cols-[280px_1fr] md:gap-6 lg:grid-cols-[300px_1fr] lg:gap-6"
    >
      <aside class="md:h-[calc(100vh-3.5rem-1px)] overflow-auto no-scrollbar">
        <div class="flex flex-col gap-4 p-4">
          <div class="grid w-full items-center gap-1.5">
            <Label for="input-title">Title</Label>
            <Input v-model="title" id="input-title" placeholder="Title" />
          </div>

          <div class="grid w-full items-center gap-3">
            <Label for="band-spacing">Band spacing</Label>
            <Slider
              id="band-spacing"
              v-model="bandYOffset"
              @value-commit="(value) => (bandYOffset = value)"
              :min="40"
              :max="200"
            />
          </div>

          <Accordion type="single" collapsible v-model="activeAccordion">
            <AccordionItem
              v-for="(band, index) in bands"
              :key="index"
              :value="String(index)"
            >
              <AccordionTrigger>
                <div class="grow text-left justify-between items-center flex">
                  {{ band.title }}
                </div>
                <Button
                  @click.stop="removeBand(index)"
                  size="icon"
                  variant="ghost"
                  class="mr-2 text-red-400 hover:text-red-400 dark:text-red-400 dark:hover:text-red-400"
                >
                  <Trash />
                </Button>
              </AccordionTrigger>
              <AccordionContent class="px-1 grid gap-4">
                <div class="grid w-full items-center gap-1.5">
                  <Label :for="`${index}-title`">Band title</Label>
                  <Input
                    v-model="band.title"
                    :id="`${index}-title`"
                    placeholder="Band title"
                  />
                </div>
                <div class="grid w-full items-center gap-1.5">
                  <Label :for="`${index}-subtitle`">Band subtitle</Label>
                  <Input
                    v-model="band.subtitle"
                    :id="`${index}-subtitle`"
                    placeholder="Band subtitle"
                  />
                </div>
                <div class="flex gap-2">
                  <NumberField
                    :id="`${index}-start`"
                    v-model="band.start"
                    locale="de-DE"
                    :min="0"
                  >
                    <Label :for="`${index}-start`">Band start</Label>
                    <NumberFieldContent class="flex items-center gap-1">
                      <NumberFieldInput />
                      <span class="text-zinc-500">kHz</span>
                    </NumberFieldContent>
                  </NumberField>
                  <NumberField
                    :id="`${index}-end`"
                    v-model="band.end"
                    locale="de-DE"
                    :min="0"
                  >
                    <Label :for="`${index}-end`">Band end</Label>
                    <NumberFieldContent class="flex items-center gap-1">
                      <NumberFieldInput />
                      <span class="text-zinc-500">kHz</span>
                    </NumberFieldContent>
                  </NumberField>
                </div>
                <div class="grid w-full items-center gap-3">
                  <Label :for="`${index}-scale`">Scale</Label>
                  <Slider
                    :id="`${index}-scale`"
                    v-model="band.tickCount"
                    :min="10"
                    :max="200"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button @click="addBand"> <Plus class="w-4 h-4" />Add band</Button>
        </div>
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
            :src="`${pdfBlob}#view=Fit`"
          />
        </AspectRatio>

        <PdfFrame
          id="band-plan"
          :info="{ title: 'Bandplan' }"
          :config="{
            margin: 48,
            margins: { top: 40, bottom: 40 },
            fontRegister: {
              // GeistBlack: 'fonts/Geist-Black.ttf',
              // GeistExtraBold: 'fonts/Geist-ExtraBold.ttf',
              GeistBold: 'fonts/Geist-Bold.ttf',
              // GeistSemiBold: 'fonts/Geist-SemiBold.ttf',
              // GeistMedium: 'fonts/Geist-Medium.ttf',
              GeistRegular: 'fonts/Geist-Regular.ttf',
              // GeistLight: 'fonts/Geist-Light.ttf',
              // GeistExtraLight: 'fonts/Geist-ExtraLight.ttf',
              // GeistThin: 'fonts/Geist-Thin.ttf',
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

            <i-g
              v-for="(band, index) in bands"
              :transform="{ translate: [20, 44 + index * bandYOffset[0]] }"
            >
              <BandDiagram
                :title="band.title"
                :subtitle="band.subtitle"
                :start="band.start"
                :end="band.end"
                :tick-count="band.tickCount[0]"
              />
            </i-g>
          </i-page>
        </PdfFrame>
      </div>
    </main>
  </div>
</template>
