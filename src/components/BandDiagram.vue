<script setup lang="ts">
import { computed } from "vue";

const {
  title,
  subtitle,
  start,
  end,
  tickCount = 34,
} = defineProps<{
  title: string;
  subtitle?: string;
  start: number;
  end: number;
  tickCount: number;
}>();
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
    :y="0"
    :width="80"
    :text="start.toLocaleString('de-DE')"
    :style="{
      fill: '#000',
      font: '14px GeistBold',
      align: 'center',
    }"
  />

  <!-- Band end text -->
  <i-text
    :x="bandLineXEnd - 40"
    :y="0"
    :width="80"
    :text="end.toLocaleString('de-DE')"
    :style="{ fill: '#000', font: '14px GeistBold', align: 'center' }"
  />

  <!-- Band end -->
  <i-line
    :x1="bandLineXEnd"
    :y1="16"
    :x2="bandLineXEnd"
    :y2="56"
    :style="{ lineWidth: 2 }"
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
    v-for="tick in bigTicks"
    :key="`${tick}_big_tick_label`"
    :text="tick.toLocaleString('de-DE')"
    :x="bandLineXStart - 40 + (tick - start) * pixelPerKHz"
    :y="0"
    :width="80"
    :style="{ fill: '#000', font: '14px GeistBold', align: 'center' }"
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

  <!-- CW Green -->
  <i-line
    :x1="bandLineXStart + 3"
    :y1="32"
    :x2="bandLineXEnd - 3"
    :y2="32"
    :style="{ stroke: '#ADD249', lineWidth: 8 }"
  />

  <!-- PH Red -->
  <i-line
    :x1="bandLineXStart + 3"
    :y1="42"
    :x2="bandLineXEnd - 3"
    :y2="42"
    :style="{ stroke: '#EF2E36', lineWidth: 8 }"
  />

  <!-- DIGI Blue -->
  <i-line
    :x1="bandLineXStart + 3"
    :y1="52"
    :x2="bandLineXEnd - 3"
    :y2="52"
    :style="{ stroke: '#1AB4F0', lineWidth: 8 }"
  />
</template>
