<template>
    <div class="dashboard">
      <Navbar name="John Doe"/>
      <main>
        <div class="main-content" v-if="deck.length == 0">
         <span class="empty-list">La liste de deck est vide...</span>
        </div>
      </main>

     
    </div>
</template>
  
 

<script setup>
import Navbar from '@/components/Navbar.vue';
import Filter from '@/components/Filter.vue';
import { ref } from 'vue';

const deck = ref([]);


</script>

<style scoped>

.dashboard {
  margin: 0;
  padding: 0;
  height: 100vh;
}



.main-content {
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}


.empty-list {
  font-size: clamp(1rem, 5vw, 3rem);
  opacity: 0.5;
}


.new-deck:hover {
  background-color: #464646;
}



</style>