<template>
  <OverlyTimer v-if="timeToStart" />
  <PopupComponent @again="initialize" :visible="popup" :score="score" />
  <div class="m-auto p-1 text-center">
    <span
      class="text-2xl rounded-full w-1/2 bg-slate-400 block m-auto text-white p-1"
    >
      Score: {{ score }}
    </span>
    <div
      class="text-center m-auto flex flex-col justify-around p-4"
      style="height: 70vh"
    >
      <p class="text-gray-400 text-4xl">
        {{ paragraph }} {{ isText ? "" : "اللون" }}
        {{ theColorToSelect }}
      </p>

      <div class="flex justify-evenly">
        <div
          :style="{ background: the.color, height: '80px', width: '80px' }"
          class="rounded-full flex justify-center items-center text-white hover:scale-110 transition-all"
          @click="validateAnswer({ text: the.name, color: the.correctName })"
          v-for="the in theColors"
        >
          {{ the.name }}
        </div>
      </div>
      <div class="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          class="h-4 transition-all bg-green-300 rounded-full"
          :style="{ width: `${timepercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import PopupComponent from "./../components/Popup.vue";
import { onMounted, computed } from "vue";
import OverlyTimer from "../components/Colorify/OverlyTimer.vue";
import {
  score,
  initialize,
  timeToStart,
  isText,
  theColorToSelect,
  theColors,
  validateAnswer,
  timer,
  time,
  popup,
  paragraph,
  token,
} from "../store/colorify";
const timepercentage = computed(() => (100 / time.value) * timer.value);
onMounted(() => {
  initialize();
});
const route = useRoute();
if (!route.query?.token) {
  window.location.href = "https://t.me/Ghyath_Darwish";
} else {
  token.value = route.query.token;
}
</script>
