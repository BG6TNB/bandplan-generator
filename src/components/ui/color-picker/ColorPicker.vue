<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    type="color"
    :class="
      cn(
        'color-picker w-6 h-6 bg-transparent rounded-full appearance-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300',
        props.class
      )
    "
  />
</template>

<style scoped>
.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
  overflow: hidden;
  border-radius: 9999px;
}
.color-picker::-webkit-color-swatch {
  border: none;
}
.color-picker::-moz-color-swatch {
  border: none;
}
</style>
