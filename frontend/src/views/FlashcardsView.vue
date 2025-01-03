<template>
    <Navbar/>
    <div>
      <h1>Flashcards pour le deck : {{ deck.title }}</h1>
      
    </div>
  </template>
  
  <script setup>
  import Navbar from '@/components/Navbar.vue';
  import { onMounted, ref } from 'vue';
  
  const props = defineProps(['id']); // ID du deck passé via la route
  const deck = ref('');
  
onMounted(async () => {
try {
    const data = await getDeckById(props.id);
    deck.value = data;
} catch (error) {
    console.error('Erreur lors du chargement du deck:', error);
}
});
</script>
  