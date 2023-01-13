<template>
  <div
    class="absolute w-full flex justify-center items-center text-white text-4xl z-20"
    style="height: 100vh; background: #000000a6"
  >
    {{ timeToStart }}
  </div>
</template>
<script setup>
import { timeToStart } from "../../store/colorify";
</script>
