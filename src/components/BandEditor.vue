<script setup lang="ts">
import { ref } from "vue";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/input/Input.vue";
import { Plus, Trash, RotateCcw, Link, Check } from "lucide-vue-next";
import type { Band, Colors } from "@/components/BandDiagram.vue";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator/Separator.vue";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Slider from "@/components/ui/slider/Slider.vue";
import { ColorPicker } from "@/components/ui/color-picker";

const title = defineModel<string>("title", { required: true });
const bandYOffset = defineModel<number[]>("bandYOffset", { required: true });
const bands = defineModel<Band[]>("bands", { required: true });
const colors = defineModel<Colors>("colors", { required: true });

const emit = defineEmits<{
  resetClick: [];
  copyClick: [];
}>();

const activeAccordion = ref();

const addBand = () => {
  bands.value = [
    ...bands.value,
    { title: "", subtitle: "", start: 0, end: 0, tickCount: 34 },
  ];

  activeAccordion.value = String(bands.value.length);
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
    {
      type: "CW",
      start: bands.value[bandIndex].start,
      end: bands.value[bandIndex].end,
    },
  ];
};

const removeSegment = (bandIndex: number, segmentIndexToRemove: number) => {
  bands.value[bandIndex].segments = bands.value[bandIndex].segments?.filter(
    (_, index) => index !== segmentIndexToRemove
  );
};

const confirmReset = () => {
  emit("resetClick");
  activeAccordion.value = undefined;
};

const isRecentlyCopied = ref(false);

const handleCopyClick = () => {
  emit("copyClick");
  isRecentlyCopied.value = true;
  setTimeout(() => {
    isRecentlyCopied.value = false;
  }, 2000);
};
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex gap-4">
      <Button
        variant="default"
        class="grow"
        :disabled="isRecentlyCopied"
        @click="handleCopyClick"
      >
        <Check v-if="isRecentlyCopied" class="w-4 h-4" />
        <Link v-else class="w-4 h-" />
        {{ isRecentlyCopied ? "Copied" : "Copy link" }}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive">
            <RotateCcw class="w-4 h-4" />Reset</Button
          >
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the bandplan to IARU R1 settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="confirmReset">Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    <div class="grid w-full items-center gap-1.5">
      <Label for="input-title">Title</Label>
      <Input v-model="title" id="input-title" placeholder="Title" />
    </div>

    <div class="flex gap-2 flex-wrap">
      <div
        class="flex items-center p-2 border gap-2 border-zinc-200 dark:border-zinc-800 rounded-md"
      >
        <Label class="text-xs font-normal">CW</Label
        ><ColorPicker v-model="colors.CW" />
      </div>
      <div
        class="flex items-center p-2 border gap-2 border-zinc-200 dark:border-zinc-800 rounded-md"
      >
        <Label class="text-xs font-normal">PHONE</Label
        ><ColorPicker v-model="colors.PHONE" />
      </div>
      <div
        class="flex items-center p-2 border gap-2 border-zinc-200 dark:border-zinc-800 rounded-md"
      >
        <Label class="text-xs font-normal">DIGIMODE</Label
        ><ColorPicker v-model="colors.DIGIMODE" />
      </div>
    </div>

    <div class="grid w-full items-center gap-3">
      <Label for="band-spacing">Band spacing</Label>
      <Slider id="band-spacing" v-model="bandYOffset" :min="40" :max="200" />
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
              :model-value="[band.tickCount]"
              @update:model-value="(value) => (band.tickCount = value![0])"
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
                    <SelectItem value="Range">Range</SelectItem>
                    <SelectItem value="Point">Point</SelectItem>
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
                v-if="
                  segment.type === 'CW' ||
                  segment.type === 'PHONE' ||
                  segment.type === 'DIGIMODE' ||
                  segment.type === 'Range'
                "
                :id="`${segmentIndex}-start`"
                v-model="segment.start"
                locale="de-DE"
                :min="band.start"
                :max="segment.end"
                :default-value="band.start"
              >
                <Label :for="`${segmentIndex}-start`">Start</Label>
                <NumberFieldContent class="flex items-center gap-1">
                  <NumberFieldInput />
                  <span class="text-zinc-500">kHz</span>
                </NumberFieldContent>
              </NumberField>
              <NumberField
                v-if="
                  segment.type === 'CW' ||
                  segment.type === 'PHONE' ||
                  segment.type === 'DIGIMODE' ||
                  segment.type === 'Range'
                "
                :id="`${segmentIndex}-end`"
                v-model="segment.end"
                locale="de-DE"
                :min="segment.start"
                :max="band.end"
                :default-value="band.end"
              >
                <Label :for="`${segmentIndex}-end`">End</Label>
                <NumberFieldContent class="flex items-center gap-1">
                  <NumberFieldInput />
                  <span class="text-zinc-500">kHz</span>
                </NumberFieldContent>
              </NumberField>
              <NumberField
                v-if="segment.type === 'Point'"
                :id="`${segmentIndex}-frequency`"
                v-model="segment.frequency"
                locale="de-DE"
                :min="band.start"
                :max="band.end"
                :default-value="band.start"
                class="grow"
              >
                <Label :for="`${segmentIndex}-frequency`">Frequency</Label>
                <NumberFieldContent class="flex items-center gap-1">
                  <NumberFieldInput />
                  <span class="text-zinc-500">kHz</span>
                </NumberFieldContent>
              </NumberField>
            </div>
            <div
              v-if="segment.type === 'Range' || segment.type === 'Point'"
              class="grid w-full items-center gap-1.5"
            >
              <Label :for="`${segmentIndex}-label`">Label</Label>
              <Input
                v-model="segment.label"
                :id="`${segmentIndex}-subtitle`"
                placeholder="Label"
              />
            </div>
            <NumberField
              v-if="segment.type === 'Point'"
              :id="`${segmentIndex}-labelWidth`"
              v-model="segment.labelWidth"
              :min="0"
              :default-value="40"
            >
              <Label :for="`${segmentIndex}-labelWidth`">Label width</Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <div class="flex gap-2" v-if="segment.type === 'Point'">
              <NumberField
                :id="`${segmentIndex}-xOffset`"
                v-model="segment.xOffset"
                :default-value="0"
                :step="0.1"
              >
                <Label :for="`${segmentIndex}-xOffset`">X Offset</Label>
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <NumberField
                :id="`${segmentIndex}-yOffset`"
                v-model="segment.yOffset"
                :default-value="0"
                :step="0.1"
              >
                <Label :for="`${segmentIndex}-yOffset`">Y Offset</Label>
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
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
</template>
