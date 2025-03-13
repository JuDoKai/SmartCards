<template>
    <div class="container">
        <div class="title">
            <h1>SmartCards</h1>
            <h2>Le savoir en cartes</h2>
        </div>
        <Auth></Auth>
    </div>
</template>


<script setup>
import Auth from '@/components/Auth.vue';
 
</script>

<style scoped>

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 2rem;
    font-family: Georgia serif;
    font-style: italic;
    font-weight: 100;
}
 
.title h1 {
    font-weight: 100;
    font-size: clamp(3rem, 7vw, 4rem);

}

.title h2 {
    font-weight: 100;
    font-size: clamp(1rem, 3.5vw, 1.5rem);
    position: absolute;
    top: calc(35px + 3vw);
}

.title p {
    font-family: Georgia serif;
    font-style: italic;
    font-weight: 100;
    font-size: 2rem;
}


</style>