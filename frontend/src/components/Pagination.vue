<template>
    <div class="pagination">
      <button class="left" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
        &lt;
      </button>
  
      <ul class="page-buttons">
        <li v-for="page in totalPages" :key="page">
          <button @click="changePage(page)" :class="{ active: currentPage === page }">
            {{ page }}
          </button>
        </li>
      </ul>
  
      <button class="right" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
        &gt;
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    decks: Array,
    currentPage: Number,
  });
  
  const emit = defineEmits(["pageChanged"]);
  
  const decksPerPage = 10;
  const totalPages = computed(() => Math.ceil(props.decks.length / decksPerPage));
  
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      emit("pageChanged", newPage);
    }
  };
  </script>
  

<style scoped>

.pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
  
button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    width: 3rem;
    font-size: 20px;
    cursor: pointer;
    background-color: rgb(255, 244, 224);
    font-weight: 700;
    border: 4px solid black;
    border-radius: 8px;
  }
  
.page-buttons {
    display: flex;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
}
  
.page-buttons li {
    list-style: none;
}
  
.page-buttons li button {
    padding: 8px 12px;
    border: 2px solid black;
    background-color: rgba(255, 244, 224);
    opacity: 0.5;
    cursor: pointer;
    font-size: 16px;
}
  
.page-buttons li button.active {
    opacity: 1;
}
  
.pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 3px solid black;
    background-color: rgb(255, 244, 224);
    font-weight: 700;
    border-radius: 8px;
    padding: 10px;
    width: 80%;
    max-width: 500px;
}
  
.pages li {
    list-style: none;
    padding: 8px;
    text-align: center;
    width: 100%;
}
  </style>
  