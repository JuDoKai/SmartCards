<template>
    <label type="checkbox">
        {{ label }} 
    </label>
</template>

<script setup>
const props = defineProps({
    label: String
})
console.log(props)
</script>