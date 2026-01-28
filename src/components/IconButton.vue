<template>
  <ion-button
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :disabled="disabled"
    type="button"
    @click="emit('click', $event)"
  >
    <slot></slot>
  </ion-button>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";

withDefaults(
  defineProps<{
    ariaLabel: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  (event: "click", value: MouseEvent): void;
}>();
</script>
