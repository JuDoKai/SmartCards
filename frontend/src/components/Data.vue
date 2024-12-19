<template>
    <div>
        <button @click="getUsers">Show Users</button>
        <ul v-if="users.length">
        <li v-for="(user, index) in users" :key="index">
            {{ user.title }} - {{ user.description }}
        </li>
        </ul>
        <p v-else>No decks found.</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const users = ref([]);

const getUsers = () => {
    fetch("http://localhost:5000/decks/67627ca2523ace83aecc4562")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            } return response.json(); })
        .then(data => { users.value = data; })
        .then(data => console.log(users))
        .catch(error => { console.error("Erreur lors de la récupération des données :", error); });
};
</script>
