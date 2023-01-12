import { ref, reactive } from "vue";

export const TIME_LIMIT = 50;
export const score = ref(0)
export const time = ref(TIME_LIMIT);
export const activeWordIndex = ref(0);
export const input = ref('');
export const words = reactive([]);