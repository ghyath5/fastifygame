<script setup>
import { useVibrate } from "@vueuse/core";
import { ref } from "vue";
import { useFastify } from "../../composables/useFastify";
import { TIME_LIMIT } from "../../store/fastify";
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
const onInput = (event) => {
  const newVal = (event.target.value ?? "").trim();
  if (time.value >= TIME_LIMIT && !interval.value) {
    startTime();
  }
  if (
    newVal.length > activeWord.value.length &&
    !validateObject.value.canContinue
  ) {
    vibrate();
    // input.value = "";
    event.target.value = input.value.trim();
    return;
  }

  if (newVal.length > input.value.length + 1) {
    vibrate();
    return (event.target.value = input.value.trim());
  }
  if (
    newVal.length == input.value.length &&
    !validateObject.value.stillValid &&
    ["insertCompositionText", "insertText"].includes(event.inputType)
  ) {
    vibrate();
    return (event.target.value = input.value.trim());
  }
  input.value = newVal;
  event.target.value = input.value.trim();
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
    @input="onInput"
  />
</template>
