<template>
    <div class="container">
        <div class="title">
            <h1>SmartCards</h1>
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
    line-height: 0;
    font-family: Georgia serif;
}
 
.title h1 {
    font-family: Georgia serif;
    font-style: italic;
    font-weight: 100;
    font-size: clamp(3rem, 7vw, 5rem);

}

.title p {
    font-family: Georgia serif;
    font-style: italic;
    font-weight: 100;
    font-size: 2rem;
}

.login {
    width: 50%;
}


</style>