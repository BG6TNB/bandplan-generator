<script setup lang="ts">
import { ref } from "vue";
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
import { Plus, Download, Printer } from "lucide-vue-next";

const title = ref("IARU R1 HF Bandplan");

const tickCount = ref([34]);

const activeAccordion = ref();

const bands = ref([
  {
    title: "28MHz",
    subtitle: "10m",
    start: 28000,
    end: 29700,
  },
  {
    title: "24MHz",
    subtitle: "12m",
    start: 28000,
    end: 29700,
  },
]);

const addBand = () => {
  bands.value = [...bands.value, { title: "", subtitle: "", start: 0, end: 0 }];

  activeAccordion.value = String(bands.value.length - 1);
};
</script>

<template>
  <div class="min-h-svh flex flex-col dark:bg-zinc-950">
    <header class="border-b border-zinc-200 dark:border-zinc-800">
      <div
        class="container mx-auto px-4 h-14 flex items-center justify-between"
      >
        <h1 class="font-bold text-lg dark:text-zinc-50">Bandplan generator</h1>
        <div class="flex gap-2">
          <Button variant="outline"><Printer class="w-4 h-4" />Print</Button>
          <Button variant="outline">
            <Download class="w-4 h-4" /> Download</Button
          >
          <DarkToggle />
        </div>
      </div>
    </header>
    <main
      class="container flex-1 mx-auto md:grid md:grid-cols-[260px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6"
    >
      <aside class="h-[calc(100vh-3.5rem-1px)] overflow-auto no-scrollbar">
        <div class="flex flex-col gap-4 p-4">
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="input-title">Title</Label>
            <Input
              v-model="title"
              id="input-title"
              placeholder="Title"
              class="max-w-sm"
            />
          </div>

          <Accordion type="single" collapsible v-model="activeAccordion">
            <AccordionItem
              v-for="(band, index) in bands"
              :key="index"
              :value="String(index)"
            >
              <AccordionTrigger>{{ band.title }}</AccordionTrigger>
              <AccordionContent class="px-1 grid gap-4">
                <div class="grid w-full max-w-sm items-center gap-1.5">
                  <Label :for="`${index}-title`">Band title</Label>
                  <Input
                    v-model="band.title"
                    :id="`${index}-title`"
                    placeholder="Band title"
                    class="max-w-sm"
                  />
                </div>
                <div class="grid w-full max-w-sm items-center gap-1.5">
                  <Label :for="`${index}-subtitle`">Band subtitle</Label>
                  <Input
                    v-model="band.subtitle"
                    :id="`${index}-subtitle`"
                    placeholder="Band subtitle"
                    class="max-w-sm"
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
                <div class="grid w-full max-w-sm items-center gap-3">
                  <Label :for="`${index}-scale`">Scale</Label>
                  <Slider
                    :id="`${index}-scale`"
                    v-model="tickCount"
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
        <div
          class="w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-lg"
        ></div>
      </div>
    </main>
  </div>
</template>
