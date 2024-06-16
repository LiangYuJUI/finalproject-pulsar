<template>
    <div class="bg-gray-800 my-12 py-6 flex flex-col justify-center sm:py-12">
        <div class="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
                class="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>
            <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-24">
                <div class="max-w-md mx-auto">
                    <div>
                        <h1 class="text-4xl font-semibold">Login</h1>
                        <p>NeoPower Smart Charging System</p>
                    </div>
                    <div class="divide-y divide-gray-200">
                        <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <div class="relative">
                                <input autocomplete="off" id="email" name="email" type="text" v-model="email"
                                    class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                    placeholder="Email address" />
                                <label for="email"
                                    class="absolute left-0 -top-3.5 text-gray-600 text-lg peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email
                                    Address</label>
                            </div>
                            <div class="relative">
                                <input autocomplete="off" id="password" name="password" type="password" v-model="password"
                                    class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                    placeholder="Password" />
                                <label for="password"
                                    class="absolute left-0 -top-3.5 text-gray-600 text-lg peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                            </div>
                            <div class="relative">
                                <button class="bg-blue-500 text-white rounded-md px-4 py-2" type="submit" @click="handleLogin">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useTokenStore } from '../stores/token'
const tokenStore = useTokenStore()
const email = ref("")
const password = ref("")
const handleLogin = async () => {
    console.log(email.value, password.value);
    try {
        // use @/stores/token.js to login
        await tokenStore.login(email.value, password.value);
        return navigateTo('/')
    }
    catch (error) {
        console.error(error);
        alert("Login failed");
        email.value = "";
        password.value = "";
    }
}
</script>