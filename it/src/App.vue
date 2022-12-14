
<script setup lang="ts">

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>

  <p hidden>
    <router-link to="/">Home</router-link>
    <br>
    <router-link to="/about">About</router-link>
  </p>
  <router-view></router-view>

</template>

<style scoped>
</style>

