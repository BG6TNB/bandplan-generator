<script setup>
import { ref, computed } from "vue";

const title = ref("IARU R1 HF Bandplan");

const band10m = ref({
  title: "28MHz",
  subtitle: "10m",
  start: 28000,
  end: 29700,
});

const bandLineStart = 120;
const bandLineEnd = 1143;

// Utility: rounds a number x to a “nice” number using a 1–2–5–10 scheme.
function getNiceNumber(x) {
  const exp = Math.floor(Math.log10(x));
  const fraction = x / Math.pow(10, exp);
  const niceFractions = [1, 2, 5, 10];
  const niceFraction = niceFractions.find((n) => fraction < n * 1.5);
  return niceFraction * Math.pow(10, exp);
}

// Frequency range of the band.
const bandRange = computed(() => band10m.value.end - band10m.value.start);

const tickCount = ref(34);

const smallTickSpacing = computed(() => {
  const rawSpacing = bandRange.value / tickCount.value;
  return getNiceNumber(rawSpacing);
});

const bigTickSpacing = computed(() => smallTickSpacing.value * 5);

// Compute first small tick aligned on the grid.
const firstSmallTick = computed(
  () =>
    Math.ceil(band10m.value.start / smallTickSpacing.value) *
    smallTickSpacing.value
);

// Generate all small tick frequencies.
const smallTicks = computed(() => {
  const first = firstSmallTick.value;
  const count =
    Math.floor((band10m.value.end - first) / smallTickSpacing.value) + 1;
  return Array.from(
    { length: count },
    (_, i) => first + i * smallTickSpacing.value
  );
});

const firstBigTick = computed(() => {
  const start =
    Math.ceil(band10m.value.start / bigTickSpacing.value) *
    bigTickSpacing.value;
  return start === band10m.value.start ? start + bigTickSpacing.value : start;
});

const bigTicks = computed(() => {
  const first = firstBigTick.value;
  const count =
    Math.floor((band10m.value.end - first) / bigTickSpacing.value) + 1;
  return Array.from(
    { length: count },
    (_, i) => first + i * bigTickSpacing.value
  );
});

const pixelPerKHz = computed(
  () => (bandLineEnd - bandLineStart) / bandRange.value
);
</script>

<template>
  <main>
    <input v-model="title" />
    <p>10m band</p>
    <input v-model="band10m.title" />
    <input v-model="band10m.subtitle" />
    <input v-model="band10m.start" type="number" />
    <input v-model="band10m.end" type="number" />
    <input id="scale" type="range" v-model="tickCount" min="10" max="200" />
    <div class="pdf-preview">
      <pdfFrame
        id="band-plan"
        class="pdf-frame"
        :info="{ title: 'Bandplan' }"
        :config="{
          margin: 48,
          margins: { top: 40, bottom: 40 },
          fontRegister: {
            GeistBlack: 'fonts/Geist-Black.ttf',
            GeistExtraBold: 'fonts/Geist-ExtraBold.ttf',
            GeistBold: 'fonts/Geist-Bold.ttf',
            GeistBold: 'fonts/Geist-SemiBold.ttf',
            GeistMedium: 'fonts/Geist-Medium.ttf',
            GeistRegular: 'fonts/Geist-Regular.ttf',
            GeistLight: 'fonts/Geist-Light.ttf',
            GeistExtraLight: 'fonts/Geist-ExtraLight.ttf',
            GeistThin: 'fonts/Geist-Thin.ttf',
          },
        }"
        type="pdf"
        :width="1191"
        :height="842"
      >
        <i-page>
          <i-text
            :width="1143"
            :text="title"
            :style="{ fill: '#000', font: '32px GeistBold' }"
          />

          <i-text
            :width="96"
            :x="20"
            :y="60"
            :text="band10m.title"
            :style="{ fill: '#000', font: '20px GeistBold', align: 'right' }"
          />
          <i-text
            :width="96"
            :x="20"
            :y="80"
            :text="band10m.subtitle"
            :style="{ fill: '#000', font: '16px GeistBold', align: 'right' }"
          />

          <!-- Band line -->
          <i-line
            :x1="bandLineStart"
            :y1="80"
            :x2="bandLineEnd"
            :y2="80"
            :style="{ lineWidth: 4 }"
          />

          <!-- Band start -->
          <i-line
            :x1="bandLineStart"
            :y1="64"
            :x2="bandLineStart"
            :y2="112"
            :style="{ lineWidth: 4 }"
          />

          <!-- Band start text -->
          <i-text
            :x="bandLineStart - 40"
            :y="44"
            :width="80"
            :text="band10m.start.toLocaleString('de-DE')"
            :style="{ fill: '#000', font: '16px GeistBold', align: 'center' }"
          />

          <!-- Band big tick labels -->
          <i-text
            v-for="tick in bigTicks"
            :key="tick"
            :text="tick.toLocaleString('de-DE')"
            :x="bandLineStart - 40 + (tick - band10m.start) * pixelPerKHz"
            :y="44"
            :width="80"
            :style="{ fill: '#000', font: '16px GeistBold', align: 'center' }"
          />

          <!-- Band end text -->
          <i-text
            :x="bandLineEnd - 40"
            :y="44"
            :width="80"
            :text="band10m.end.toLocaleString('de-DE')"
            :style="{ fill: '#000', font: '16px GeistBold', align: 'center' }"
          />

          <!-- Band end -->
          <i-line
            :x1="bandLineEnd"
            :y1="64"
            :x2="bandLineEnd"
            :y2="112"
            :style="{ lineWidth: 4 }"
          />

          <!-- Small ticks -->
          <i-line
            v-for="tick in smallTicks"
            :key="tick"
            :x1="bandLineStart + (tick - band10m.start) * pixelPerKHz"
            :y1="72"
            :x2="bandLineStart + (tick - band10m.start) * pixelPerKHz"
            :y2="80"
            :style="{ lineWidth: 4 }"
          />

          <!-- Big ticks -->
          <i-line
            v-for="tick in bigTicks"
            :key="tick + '_line'"
            :x1="bandLineStart + (tick - band10m.start) * pixelPerKHz"
            :y1="64"
            :x2="bandLineStart + (tick - band10m.start) * pixelPerKHz"
            :y2="80"
            :style="{ lineWidth: 4 }"
          />

          <!-- CW Green -->
          <i-line
            :x1="124"
            :y1="88"
            :x2="1139"
            :y2="88"
            :style="{ stroke: '#ADD249', lineWidth: 8 }"
          />

          <!-- PH Red -->
          <i-line
            :x1="124"
            :y1="98"
            :x2="1139"
            :y2="98"
            :style="{ stroke: '#EF2E36', lineWidth: 8 }"
          />

          <!-- DIGI Blue -->
          <i-line
            :x1="124"
            :y1="108"
            :x2="1139"
            :y2="108"
            :style="{ stroke: '#1AB4F0', lineWidth: 8 }"
          />
        </i-page>
      </pdfFrame>
    </div>
  </main>
</template>

<style scoped>
main {
  margin: 0 auto;
  max-width: 1024px;
  padding: 0 40px;
}
.pdf-frame {
  border: none;
}
.pdf-preview {
  width: 100%;
  height: 725px;
}
</style>
