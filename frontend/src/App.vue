<template>
  <div id="app">
    <router-view />
  </div>

 
</template>

<script setup>
import { useAuth } from './composables/useAuth';

const { loadSession } = useAuth();

loadSession();

</script>

<style scoped>
  

</style>