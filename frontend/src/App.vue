<template>
  <div id="app">
    <nav>
      <router-link to="/">Login</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>  |
      <router-link to="/data">Data</router-link>

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