<script setup>
import { vIntersectionObserver } from "@vueuse/components";
import { ref, watch, computed } from "vue";
import { useFastify } from "../../composables/useFastify";
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
const addConnection = (idx, letter) => {
  const prevLetter = props.word[idx - 1];
  return !["ا", "ل", "ء", "ة"].includes(letter) &&
    !["و", "ر", "ؤ", "ذ", "د", "ز", "ا", "ل"].includes(prevLetter) &&
    idx > 0 &&
    idx < props.word.length - 1
    ? true
    : false;
};
// &zwj;
</script>
<template>
  <p
    v-intersection-observer="[onIntersectionObserver, { threshold: 1 }]"
    class="p-2"
    :class="{ 'text-green-500': props.green }"
  >
    <span
      :class="wordCheckerClasses(wordLetter, idx)"
      v-for="(wordLetter, idx) in wordLetters"
      :key="props.word + wordLetter"
    >
      {{ addConnection(idx, wordLetter) ? "&#x200d;" : "" }}{{ wordLetter }}
    </span>
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
