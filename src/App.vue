<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { Plus, Download, Printer, Trash } from "lucide-vue-next";
import PdfFrame from "@i2d/pdf-frame-vue";
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
import AspectRatio from "@/components/ui/aspect-ratio/AspectRatio.vue";
import DarkToggle from "@/components/DarkToggle.vue";
import BandDiagram, { type Segment } from "@/components/BandDiagram.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator/Separator.vue";

type Band = {
  title: string;
  subtitle: string;
  start: number;
  end: number;
  tickCount: number[];
  segments?: Segment[];
};

const title = ref("IARU R1 HF Bandplan");
const bandYOffset = ref([73]);

const activeAccordion = ref();

const bands = ref<Band[]>([
  {
    title: "28MHz",
    subtitle: "10m",
    start: 28000,
    end: 29700,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 28000,
        end: 29300,
      },
      {
        type: "CW",
        start: 29520,
        end: 29700,
      },
      {
        type: "PHONE",
        start: 28225,
        end: 29300,
      },
      {
        type: "PHONE",
        start: 29520,
        end: 29700,
      },
      {
        type: "DIGIMODE",
        start: 28070,
        end: 28150,
      },
      {
        type: "DIGIMODE",
        start: 28300,
        end: 28320,
      },
      {
        type: "DIGIMODE",
        start: 29200,
        end: 29300,
      },
      {
        type: "DIGIMODE",
        start: 29520,
        end: 29700,
      },
    ],
  },
  {
    title: "24MHz",
    subtitle: "12m",
    start: 24890,
    end: 24990,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 24890,
        end: 24929,
      },
      {
        type: "CW",
        start: 24931,
        end: 24990,
      },
      {
        type: "PHONE",
        start: 24931,
        end: 24990,
      },
      {
        type: "DIGIMODE",
        start: 24915,
        end: 24929,
      },
      {
        type: "DIGIMODE",
        start: 24931,
        end: 24990,
      },
    ],
  },
  {
    title: "21MHz",
    subtitle: "15m",
    start: 21000,
    end: 21450,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 21000,
        end: 21149,
      },
      {
        type: "CW",
        start: 21151,
        end: 21450,
      },
      {
        type: "PHONE",
        start: 21151,
        end: 21450,
      },
      {
        type: "DIGIMODE",
        start: 21070,
        end: 21120,
      },
      {
        type: "DIGIMODE",
        start: 21151,
        end: 21450,
      },
    ],
  },
  {
    title: "18MHz",
    subtitle: "17m",
    start: 18068,
    end: 18168,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 18068,
        end: 18109,
      },
      {
        type: "CW",
        start: 18111,
        end: 18168,
      },
      {
        type: "PHONE",
        start: 18111,
        end: 18168,
      },
      {
        type: "DIGIMODE",
        start: 18095,
        end: 18109,
      },
      {
        type: "DIGIMODE",
        start: 18111,
        end: 18168,
      },
    ],
  },
  {
    title: "14MHz",
    subtitle: "20m",
    start: 14000,
    end: 14350,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 14000,
        end: 14099,
      },
      {
        type: "CW",
        start: 14101,
        end: 14350,
      },
      {
        type: "PHONE",
        start: 14101,
        end: 14350,
      },
      {
        type: "DIGIMODE",
        start: 14070,
        end: 14099,
      },
      {
        type: "DIGIMODE",
        start: 14101,
        end: 14350,
      },
    ],
  },
  {
    title: "10MHz",
    subtitle: "30m",
    start: 10100,
    end: 10150,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 10100,
        end: 10150,
      },
      {
        type: "DIGIMODE",
        start: 10130,
        end: 10150,
      },
    ],
  },
  {
    title: "7MHz",
    subtitle: "40m",
    start: 7000,
    end: 7200,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 7000,
        end: 7200,
      },
      {
        type: "PHONE",
        start: 7050,
        end: 7200,
      },
      {
        type: "DIGIMODE",
        start: 7040,
        end: 7200,
      },
    ],
  },
  {
    title: "5MHz",
    subtitle: "60m",
    start: 5351.5,
    end: 5366.5,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 5351.5,
        end: 5366.5,
      },
      {
        type: "PHONE",
        start: 5354,
        end: 5366,
      },
      {
        type: "DIGIMODE",
        start: 5354,
        end: 5366,
      },
    ],
  },
  {
    title: "3.5MHz",
    subtitle: "80m",
    start: 3500,
    end: 3800,
    tickCount: [50],
    segments: [
      {
        type: "CW",
        start: 3500,
        end: 3800,
      },
      {
        type: "PHONE",
        start: 3600,
        end: 3800,
      },
      {
        type: "DIGIMODE",
        start: 3570,
        end: 3800,
      },
    ],
  },
  {
    title: "1.8MHz",
    subtitle: "160m",
    start: 1810,
    end: 2000,
    tickCount: [34],
    segments: [
      {
        type: "CW",
        start: 1810,
        end: 2000,
      },
      {
        type: "PHONE",
        start: 1840,
        end: 2000,
      },
      {
        type: "DIGIMODE",
        start: 1838,
        end: 2000,
      },
    ],
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

const addSegment = (bandIndex: number) => {
  bands.value[bandIndex].segments = [
    ...(bands.value[bandIndex].segments || []),
    { type: "CW", start: 0, end: 0 },
  ];
};

const removeSegment = (bandIndex: number, segmentIndexToRemove: number) => {
  bands.value[bandIndex].segments = bands.value[bandIndex].segments?.filter(
    (_, index) => index !== segmentIndexToRemove
  );
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
              v-for="(band, bandIndex) in bands"
              :key="bandIndex"
              :value="String(bandIndex)"
            >
              <AccordionTrigger>
                <div class="grow text-left justify-between items-center flex">
                  {{ band.title }}
                </div>
                <Button
                  @click.stop="removeBand(bandIndex)"
                  size="icon"
                  variant="ghost"
                  class="mr-2 text-red-400 hover:text-red-400 dark:text-red-400 dark:hover:text-red-400"
                >
                  <Trash />
                </Button>
              </AccordionTrigger>
              <AccordionContent class="px-1 grid gap-4">
                <div class="grid w-full items-center gap-1.5">
                  <Label :for="`${bandIndex}-title`">Band title</Label>
                  <Input
                    v-model="band.title"
                    :id="`${bandIndex}-title`"
                    placeholder="Band title"
                  />
                </div>
                <div class="grid w-full items-center gap-1.5">
                  <Label :for="`${bandIndex}-subtitle`">Band subtitle</Label>
                  <Input
                    v-model="band.subtitle"
                    :id="`${bandIndex}-subtitle`"
                    placeholder="Band subtitle"
                  />
                </div>
                <div class="flex gap-2">
                  <NumberField
                    :id="`${bandIndex}-start`"
                    v-model="band.start"
                    locale="de-DE"
                    :min="0"
                  >
                    <Label :for="`${bandIndex}-start`">Band start</Label>
                    <NumberFieldContent class="flex items-center gap-1">
                      <NumberFieldInput />
                      <span class="text-zinc-500">kHz</span>
                    </NumberFieldContent>
                  </NumberField>
                  <NumberField
                    :id="`${bandIndex}-end`"
                    v-model="band.end"
                    locale="de-DE"
                    :min="0"
                  >
                    <Label :for="`${bandIndex}-end`">Band end</Label>
                    <NumberFieldContent class="flex items-center gap-1">
                      <NumberFieldInput />
                      <span class="text-zinc-500">kHz</span>
                    </NumberFieldContent>
                  </NumberField>
                </div>
                <div class="grid w-full items-center gap-3">
                  <Label :for="`${bandIndex}-scale`">Scale</Label>
                  <Slider
                    :id="`${bandIndex}-scale`"
                    v-model="band.tickCount"
                    :min="10"
                    :max="200"
                  />
                </div>

                <Separator />
                <h3 class="font-medium">Segments</h3>

                <div
                  v-for="(segment, segmentIndex) in band.segments"
                  class="border border-zinc-200 dark:border-zinc-800 rounded-md p-2 grid gap-2"
                >
                  <div class="flex gap-2">
                    <Select v-model="segment.type">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="CW">CW</SelectItem>
                          <SelectItem value="PHONE">PHONE</SelectItem>
                          <SelectItem value="DIGIMODE">DIGIMODE</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      @click.stop="removeSegment(bandIndex, segmentIndex)"
                      size="icon"
                      variant="ghost"
                      class="shrink-0 text-red-400 hover:text-red-400 dark:text-red-400 dark:hover:text-red-400"
                    >
                      <Trash />
                    </Button>
                  </div>
                  <div class="flex gap-2">
                    <NumberField
                      :id="`${segmentIndex}-start`"
                      v-model="segment.start"
                      locale="de-DE"
                      :min="0"
                    >
                      <Label :for="`${segmentIndex}-start`">Start</Label>
                      <NumberFieldContent class="flex items-center gap-1">
                        <NumberFieldInput />
                        <span class="text-zinc-500">kHz</span>
                      </NumberFieldContent>
                    </NumberField>
                    <NumberField
                      :id="`${segmentIndex}-end`"
                      v-model="segment.end"
                      locale="de-DE"
                      :min="0"
                    >
                      <Label :for="`${segmentIndex}-end`">End</Label>
                      <NumberFieldContent class="flex items-center gap-1">
                        <NumberFieldInput />
                        <span class="text-zinc-500">kHz</span>
                      </NumberFieldContent>
                    </NumberField>
                  </div>
                </div>
                <Button @click="addSegment(bandIndex)"
                  ><Plus class="w-4 h-4" />Add segment</Button
                >
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button @click="addBand"><Plus class="w-4 h-4" />Add band</Button>
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
              :key="JSON.stringify(band)"
            >
              <BandDiagram
                :title="band.title"
                :subtitle="band.subtitle"
                :start="band.start"
                :end="band.end"
                :tick-count="band.tickCount[0]"
                :segments="band.segments"
              />
            </i-g>
          </i-page>
        </PdfFrame>
      </div>
    </main>
  </div>
</template>
