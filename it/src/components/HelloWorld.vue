<script lang="ts">
import { createApp } from "vue";

export default {
  props: {
    msg: String,
  },
  created() {},
  data() {
    return {
      count: 0,
    };
  }
}

  

</script>


<template>
  <h1>it</h1>
  <v-btn @click="count++" color="red">clicked me {{ count }} times.</v-btn>
</template>
<style scoped>

</style>