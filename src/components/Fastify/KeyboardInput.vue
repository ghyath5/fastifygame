<script setup>
import { useVibrate } from "@vueuse/core";
import { ref } from "vue";
import { useFastify } from "../../composables/useFastify";
const { vibrate } = useVibrate({ pattern: [340] });
const {
  input,
  direction,
  activeWordIndex,
  activeWord,
  validateObject,
  startTime,
  interval,
  time,
  inputRef,
} = useFastify();
const emit = defineEmits(["update:input"]);
const inputType = ref("");
const isStillValid = (event) => {
  if (time.value >= 60 && !interval.value) {
    startTime();
  }
  const newVal = (event.target.value ?? "").trim();
  if (
    inputType.value == "insertCompositionText" &&
    event.inputType == "insertText"
  ) {
    inputType.value = "insertText";
    if (!input.value) {
      activeWordIndex.value =
        activeWordIndex.value > 0 ? activeWordIndex.value - 1 : 0;
    }
    vibrate();
    return (input.value = "");
  }
  inputType.value = event.inputType;

  input.value = newVal;
  if (
    newVal.length > activeWord.value.length &&
    !validateObject.value.canContinue
  ) {
    vibrate();
    return (input.value = "");
  }
};
</script>

<template>
  <input
    ref="inputRef"
    autofocus
    :style="{ direction }"
    class="h-10 border-b border-gray-400 text-3xl p-1 text-center outline-none w-2/3"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="none"
    spellcheck="false"
    :value="input"
    @input="isStillValid"
  />
</template>
