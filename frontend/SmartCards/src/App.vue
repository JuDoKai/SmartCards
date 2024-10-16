<template>
  <div id="main-container">
    <div class="main-bg">

    </div>
  </div>

  <Sign_Up/>
</template>

<script setup>
import { ref } from 'vue';
import Sign_Up from './Sign_Up.vue';

const todos = ref([])
const newTodo = ref('')

const addTodo = () => {
  todos.value.push({
    title: newTodo.value,
    completed: false,
    date: Date.now()
  })
  newTodo.value = ''
}
</script>

<style>



.main-container{
  display: flex;
  flex-direction: row;
}

.main-bg{
  height: 50%;
  width: 50%;
  background-image: url(/src/images/logo.png);
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 40px;
}
  

</style>