<script setup>
import { useScroll } from "@vueuse/core";
import { ref, watch, onMounted } from "vue";
import { useFastify } from "../composables/useFastify";
import FastifyWord from "../components/Fastify/Word.vue";
import FastifyKeyboardInput from "../components/Fastify/KeyboardInput.vue";
const el = ref(null);
const { y } = useScroll(el, {
  behavior: "smooth",
});
const { words, activeWordIndex, direction, hhmmTime, score, time } =
  useFastify();

const scrollDown = () => {
  y.value = y.value + (getBoxHeight() - 44);
};

const getBoxHeight = () => {
  return window.screen.height / 4.4;
};
watch(activeWordIndex, () => {
  if (activeWordIndex.value == 0) {
    y.value = 0;
  }
});
onMounted(() => {
  document.title = "Fastify";
});
</script>
<template>
  <div
    class="p-1 m-auto text-center flex justify-between flex-col items-center"
  >
    <div>
      <span
        class="text-2xl rounded-full w-1/2 bg-slate-400 block m-auto text-white p-1"
      >
        Score: {{ score }}
      </span>
      <div
        :style="{ height: getBoxHeight() + 'px', direction }"
        ref="el"
        class="bg-slate-50 mb-3 w-full mt-4 md:w-11/12 m-auto p-5 flex flex-wrap overflow-y-auto"
      >
        <FastifyWord
          :key="word + i"
          v-for="(word, i) in words"
          :word="word"
          :active="i == activeWordIndex"
          :green="i < activeWordIndex"
          @scrolldown="scrollDown"
        />
      </div>
      <div
        class="text-2xl text-gray-400 mb-3"
        :class="{
          'text-orange-400': time <= 30 && time >= 10,
          'text-red-400': time < 10,
        }"
      >
        {{ hhmmTime }}
      </div>
    </div>
    <FastifyKeyboardInput />
  </div>
</template>
