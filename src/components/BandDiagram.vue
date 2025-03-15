<script setup lang="ts">
import { computed } from "vue";

type CWSegment = {
  type: "CW";
  start: number;
  end: number;
};
type PhoneSegment = {
  type: "PHONE";
  start: number;
  end: number;
};
type DigimodeSegment = {
  type: "DIGIMODE";
  start: number;
  end: number;
};
type RangeSegment = {
  type: "Range";
  start: number;
  end: number;
  label: string;
};
type PointSegment = {
  type: "Point";
  frequency: number;
  label: string;
  labelWidth?: number;
  xOffset?: number;
  yOffset?: number;
};

export type Segment =
  | CWSegment
  | PhoneSegment
  | DigimodeSegment
  | RangeSegment
  | PointSegment;

export type Band = {
  title: string;
  subtitle: string;
  start: number;
  end: number;
  tickCount: number;
  segments?: Segment[];
};

export type Colors = {
  CW: string;
  PHONE: string;
  DIGIMODE: string;
};

type Props = Band & { colors: Colors };

const {
  title,
  subtitle,
  start,
  end,
  tickCount = 34,
  segments,
  colors,
} = defineProps<Props>();
const bandLineXStart = 100;
const bandLineXEnd = 1103;

// Utility: rounds a number x to a “nice” number using a 1–2–5–10 scheme.
function getNiceNumber(x: number) {
  const exp = Math.floor(Math.log10(x));
  const fraction = x / Math.pow(10, exp);
  const niceFractions = [1, 2, 5, 10];
  const niceFraction = niceFractions.find((n) => fraction < n * 1.5) || 10;
  return niceFraction * Math.pow(10, exp);
}

const bandRange = computed(() => end - start);

const smallTickSpacing = computed(() => {
  const rawSpacing = bandRange.value / tickCount;
  return getNiceNumber(rawSpacing);
});

const bigTickSpacing = computed(() => smallTickSpacing.value * 5);

const firstSmallTick = computed(
  () => Math.ceil(start / smallTickSpacing.value) * smallTickSpacing.value
);

const smallTicks = computed(() => {
  const first = firstSmallTick.value;
  const count = Math.floor((end - first) / smallTickSpacing.value) + 1;
  return Array.from(
    { length: count },
    (_, i) => first + i * smallTickSpacing.value
  );
});

const firstBigTick = computed(() => {
  const tickStart =
    Math.ceil(start / bigTickSpacing.value) * bigTickSpacing.value;
  return tickStart === start ? tickStart + bigTickSpacing.value : tickStart;
});

const bigTicks = computed(() => {
  const first = firstBigTick.value;
  const count = Math.floor((end - first) / bigTickSpacing.value) + 1;
  return Array.from(
    { length: count },
    (_, i) => first + i * bigTickSpacing.value
  );
});

const pixelPerKHz = computed(
  () => (bandLineXEnd - bandLineXStart) / bandRange.value
);

const visibleBigTicks = computed(() => {
  const minDistance = 30; // minimum pixels between labels
  return bigTicks.value.filter((tick) => {
    const xPosition = bandLineXStart + (tick - start) * pixelPerKHz.value;
    // Hide if too close to start or end
    return (
      xPosition - bandLineXStart > minDistance &&
      bandLineXEnd - xPosition > minDistance
    );
  });
});

function isCWSegment(segment: Segment): segment is CWSegment {
  return segment.type === "CW";
}

function isPhoneSegment(segment: Segment): segment is PhoneSegment {
  return segment.type === "PHONE";
}

function isDigimodeSegment(segment: Segment): segment is DigimodeSegment {
  return segment.type === "DIGIMODE";
}

function isRangeSegment(segment: Segment): segment is RangeSegment {
  return segment.type === "Range";
}

function isPointSegment(segment: Segment): segment is PointSegment {
  return segment.type === "Point";
}
</script>

<template>
  <i-text
    :width="96"
    :x="0"
    :y="12"
    :text="title"
    :style="{
      fill: '#000',
      font: '18px GeistBold',
      align: 'right',
    }"
  />
  <i-text
    v-if="subtitle"
    :width="96"
    :x="0"
    :y="32"
    :text="subtitle"
    :style="{
      fill: '#000',
      font: '14px GeistBold',
      align: 'right',
    }"
  />

  <!-- Band line -->
  <i-line
    :x1="bandLineXStart"
    :y1="25"
    :x2="bandLineXEnd"
    :y2="25"
    :style="{ lineWidth: 2 }"
  />

  <!-- Band start -->
  <i-line
    :x1="bandLineXStart"
    :y1="16"
    :x2="bandLineXStart"
    :y2="56"
    :style="{ lineWidth: 2 }"
  />

  <!-- Band start text -->
  <i-text
    :x="bandLineXStart - 40"
    :y="2"
    :width="80"
    :text="start.toLocaleString('de-DE')"
    :style="{
      fill: '#000',
      font: '12px GeistBold',
      align: 'center',
    }"
  />

  <!-- Band end -->
  <i-line
    :x1="bandLineXEnd"
    :y1="16"
    :x2="bandLineXEnd"
    :y2="56"
    :style="{ lineWidth: 2 }"
  />

  <!-- Band end text -->
  <i-text
    :x="bandLineXEnd - 40"
    :y="2"
    :width="80"
    :text="end.toLocaleString('de-DE')"
    :style="{ fill: '#000', font: '12px GeistBold', align: 'center' }"
  />

  <!-- Small ticks -->
  <i-line
    v-for="tick in smallTicks"
    :key="`${tick}_small_tick`"
    :x1="bandLineXStart + (tick - start) * pixelPerKHz"
    :y1="20"
    :x2="bandLineXStart + (tick - start) * pixelPerKHz"
    :y2="25"
    :style="{ lineWidth: 2 }"
  />

  <!-- Band big tick labels -->
  <i-text
    v-for="tick in visibleBigTicks"
    :key="`${tick}_big_tick_label`"
    :text="tick.toLocaleString('de-DE')"
    :x="bandLineXStart - 40 + (tick - start) * pixelPerKHz"
    :y="2"
    :width="80"
    :style="{
      fill: '#000',
      font: '12px GeistBold',
      align: 'center',
    }"
  />

  <!-- Big ticks -->
  <i-line
    v-for="tick in bigTicks"
    :key="`${tick}_big_tick`"
    :x1="bandLineXStart + (tick - start) * pixelPerKHz"
    :y1="16"
    :x2="bandLineXStart + (tick - start) * pixelPerKHz"
    :y2="25"
    :style="{ lineWidth: 2 }"
  />

  <!-- CW -->
  <i-line
    v-for="segment in segments?.filter(isCWSegment)"
    :x1="
      Math.max(
        bandLineXStart + 3,
        bandLineXStart + (segment.start - start) * pixelPerKHz
      )
    "
    :y1="32"
    :x2="
      Math.min(
        bandLineXEnd - 3,
        bandLineXStart + (segment.end - start) * pixelPerKHz
      )
    "
    :y2="32"
    :style="{
      stroke: colors.CW,
      lineWidth: 8,
    }"
  />

  <!-- PHONE -->
  <i-line
    v-for="segment in segments?.filter(isPhoneSegment)"
    :x1="
      Math.max(
        bandLineXStart + 3,
        bandLineXStart + (segment.start - start) * pixelPerKHz
      )
    "
    :y1="42"
    :x2="
      Math.min(
        bandLineXEnd - 3,
        bandLineXStart + (segment.end - start) * pixelPerKHz
      )
    "
    :y2="42"
    :style="{ stroke: colors.PHONE, lineWidth: 8 }"
  />

  <!-- DIGIMODE Blue -->
  <i-line
    v-for="segment in segments?.filter(isDigimodeSegment)"
    :x1="
      Math.max(
        bandLineXStart + 3,
        bandLineXStart + (segment.start - start) * pixelPerKHz
      )
    "
    :y1="52"
    :x2="
      Math.min(
        bandLineXEnd - 3,
        bandLineXStart + (segment.end - start) * pixelPerKHz
      )
    "
    :y2="52"
    :style="{ stroke: colors.DIGIMODE, lineWidth: 8 }"
  />

  <i-g v-for="segment in segments?.filter(isRangeSegment)">
    <!-- Segment line -->
    <i-line
      :x1="
        Math.max(
          bandLineXStart,
          bandLineXStart + (segment.start - start) * pixelPerKHz
        )
      "
      :y1="60"
      :x2="
        Math.min(
          bandLineXEnd,
          bandLineXStart + (segment.end - start) * pixelPerKHz
        )
      "
      :y2="60"
      :style="{ stroke: '#000', lineWidth: 2 }"
    />

    <!-- Segment start -->
    <i-line
      :x1="
        Math.max(
          bandLineXStart,
          bandLineXStart + (segment.start - start) * pixelPerKHz
        )
      "
      :y1="57"
      :x2="
        Math.max(
          bandLineXStart,
          bandLineXStart + (segment.start - start) * pixelPerKHz
        )
      "
      :y2="61"
      :style="{ stroke: '#000', lineWidth: 2 }"
    />

    <!-- Segment end -->
    <i-line
      :x1="
        Math.min(
          bandLineXEnd,
          bandLineXStart + (segment.end - start) * pixelPerKHz
        )
      "
      :y1="57"
      :x2="
        Math.min(
          bandLineXEnd,
          bandLineXStart + (segment.end - start) * pixelPerKHz
        )
      "
      :y2="61"
      :style="{ stroke: '#000', lineWidth: 2 }"
    />

    <i-text
      :text="segment.label"
      :x="
        Math.max(
          bandLineXStart,
          bandLineXStart + (segment.start - start) * pixelPerKHz
        )
      "
      :y="60"
      :style="{
        fill: '#000',
        font: '10px GeistMedium',
      }"
    />
  </i-g>

  <i-g>
    <i-line
      v-for="segment in segments?.filter(isPointSegment)"
      :x1="bandLineXStart + (segment.frequency - start) * pixelPerKHz"
      :y1="20"
      :x2="bandLineXStart + (segment.frequency - start) * pixelPerKHz"
      :y2="25"
      :style="{ stroke: '#000', lineWidth: 1 }"
    />

    <i-text
      v-for="segment in segments?.filter(isPointSegment)"
      :key="`${segment.frequency}_point_label`"
      :text="segment.label"
      :x="
        bandLineXStart +
        (segment.frequency - start) * pixelPerKHz -
        (segment.labelWidth || 40) / 2 +
        (segment.xOffset || 0)
      "
      :y="11 + (segment.yOffset || 0)"
      :width="segment.labelWidth || 40"
      :style="{
        fill: '#000',
        font: '7px GeistMedium',
        align: 'center',
      }"
    />
  </i-g>
</template>
