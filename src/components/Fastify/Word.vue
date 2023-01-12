<script setup>
import { vIntersectionObserver } from "@vueuse/components";
import { isIOS } from "@vueuse/shared";
import { ref, watch, computed } from "vue";
import { useFastify } from "../../composables/useFastify";
import {
  isIOS as ios,
  isIPhone13 as i13,
  isIOS13 as io13,
} from "mobile-device-detect";
const props = defineProps({
  word: String,
  active: Boolean,
  green: Boolean,
});
const emit = defineEmits(["scrolldown"]);
const { input, validateObject } = useFastify();

const isVisible = ref(false);
function onIntersectionObserver([{ isIntersecting }]) {
  isVisible.value = isIntersecting;
}
watch(
  () => [props.active, isVisible.value],
  () => {
    if (props.active && !isVisible.value) {
      emit("scrolldown");
    }
  }
);

const wordLetters = computed(() => {
  return props.word.split("");
});
const inputLetters = computed(() => {
  return input.value.split("");
});

const wordCheckerClasses = (letter, idx) => {
  const activeWord = props.active;
  const activeLetter =
    (activeWord && inputLetters.value.length == idx) ||
    (activeWord &&
      !inputLetters.value.length &&
      idx == inputLetters.value.length);
  return {
    "bg-gray-300": activeLetter && validateObject.value.stillValid,
    "text-green-300": activeWord && inputLetters.value[idx] == letter,
    "text-red-300":
      activeWord &&
      inputLetters.value[idx] != letter &&
      inputLetters.value.length - 1 >= idx,
  };
};
</script>
<template>
  <p
    v-intersection-observer="[onIntersectionObserver, { threshold: 1 }]"
    class="p-2"
    :class="{ 'text-green-500': props.green }"
  >
    <span
      v-if="!isIOS && !i13 && !io13 && !ios"
      :class="wordCheckerClasses(wordLetter, idx)"
      v-for="(wordLetter, idx) in wordLetters"
      :key="props.word + wordLetter"
    >
      {{ wordLetter }}
    </span>
    <span v-else>{{ props.word }}</span>
  </p>
</template>
<style scoped>
@import url(https://fonts.googleapis.com/earlyaccess/droidarabickufi.css);
p,
span {
  direction: rtl !important;
  font-family: "Droid Arabic Kufi", STSong-Light;
}
</style>
