<template>
    <div class="bg-white py-24">
        <div class="flex flex-col items-center">
            <h1 class="text-6xl font-semibold text-blue-600">2023 NeoPower</h1>
            <p class="mt-4 text-9xl font-bold text-gray-900">GoChaBar</p>
        </div>
    </div>
    <div class="bg-white py-24">
        <TestComponent :test="h"/>
        <div class="flex flex-col items-center">
            <NuxtLink to="/">回首頁</NuxtLink>
        </div>
        <div class="flex flex-col items-center">
            <NuxtLink to="/dashboard">DASHBOARD</NuxtLink>
        </div>
        <div class="flex flex-col items-center">
            <NuxtLink to="/test">TEST</NuxtLink>
        </div>
        <div class="flex flex-col items-center">
            <NuxtLink to="/login">Login</NuxtLink>
        </div>
        <div class="flex flex-col items-center">
            <!-- <button
                class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                @click="tokenStore.login(`test@example.com`, `testpassword`)">Login</button> -->
            <button
                class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                @click="handleLogin">Login</button>
            <button
                class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >Logout</button>
        </div>

    </div>
</template>

<script setup>
const h = ref(3)

setTimeout(()=>{
    h.value = 8;
},2000)
setTimeout(()=>{
    h.value = 16;
},4000)

</script>
