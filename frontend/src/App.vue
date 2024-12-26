<template>
  <div id="app">
    <nav>
      <router-link to="/">Auth</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>  |
    </nav>
    <router-view />
  </div>

 
</template>

<script setup>

</script>

<style>


.main-container{
  display: flex;
  flex-direction: row;
}
  

</style>