<script setup>
const props = defineProps({
  score: Number,
  visible: Boolean,
});

defineEmits(["again"]);
</script>

<template>
  <Transition>
    <div
      v-if="visible"
      class="absolute w-full flex justify-center items-center z-10"
      style="height: 100vh; background: #000000a6"
    >
      <div class="bg-white w-1/2 rounded-2xl p-5 pb-2 m-auto text-center">
        <div class="flex flex-row justify-evenly items-center mb-4">
          <img width="100" src="@/assets/boy.svg" />
          <span class="text-4xl text-black">{{ score }}</span>
        </div>
        <button
          @click="$emit('again')"
          type="button"
          class="self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            aria-hidden="true"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
      </div>
    </div>
  </Transition>
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
