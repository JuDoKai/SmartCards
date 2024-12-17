<template>
    <nav class="nav-container">
        <a href="/dashboard">SmartCards</a>
        <div class="log">
            <p> {{ user.name }}</p>
            <p>Se Déconnecter</p>
        </div>
    </nav>
</template>

<script setup>

const user = defineProps({
    name: String
})

</script>


<style scoped>

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem 0 2rem;
    border-bottom: 2px solid black;
}

.nav-container a {
    font-family: Georgia serif;
    font-style: italic;
    font-size: clamp(2.5rem, 5vw, 3rem);
    color: black;
    text-decoration: none;
}

.nav-container .log {
    font-size: clamp(1rem, 3vw, 1.5rem);
    line-height: 0.5rem;
}


</style>

