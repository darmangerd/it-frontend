<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
  <v-btn
    @click="count++"
    color="primary"
    dark
    >You clicked me {{ count }} times.</v-btn
  >
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
