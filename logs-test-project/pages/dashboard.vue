<template>
    <h1>dashboard!!</h1>
    <footer></footer>
</template>

<script setup>
definePageMeta({
    middleware: 'auth-token',
    layout: false
})
</script>