<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md">
            <div class="flex flex-col items-center">
                <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-gray-700">Cookie</h2>
            </div>
            <div class="mt-2 flex w-full max-w-md flex-col items-center">
                <button type="button"
                    class="mt-2 w-fit rounded-sm bg-emerald-500 py-2 px-4 text-sm text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                    @click="setNameCookie">
                    設置 name
                </button>
                <div class="mt-2 flex">
                    <label class="text-lg font-semibold text-emerald-500">name:</label>
                    <span class="ml-2 flex text-lg text-slate-700">{{ name }}</span>
                </div>
            </div>
            <div class="mt-2 flex w-full max-w-md flex-col items-center">
                <button type="button"
                    class="mt-2 w-fit rounded-sm bg-emerald-500 py-2 px-4 text-sm text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                    @click="setCounterCookie">
                    設置 counter
                </button>
                <div class="mt-2 flex">
                    <label class="text-lg font-semibold text-emerald-500">counter:</label>
                    <span class="ml-2 flex text-lg text-slate-700">{{ counter }}</span>
                </div>
            </div>
            <div class="mt-2 flex w-full max-w-md flex-col items-center">
                <button type="button"
                    class="mt-2 w-fit rounded-sm bg-emerald-500 py-2 px-4 text-sm text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                    @click="setJWT">
                    設置 jwt
                </button>
                <div class="mt-2 flex p-20 max-w-7xl">
                    <label class="text-lg font-semibold text-emerald-500">jwt:</label>
                    <span class="ml-2 flex text-lg text-slate-700">{{ jwt }}</span>
                </div>
            </div>
            <div class="mt-2 flex w-full max-w-md flex-col items-center">
                <button type="button"
                    class="mt-2 w-fit rounded-sm bg-emerald-500 py-2 px-4 text-sm text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                    @click="login">
                    Login
                </button>

            </div>
            <div class="mt-2 flex w-full max-w-md flex-col items-center">
                <button type="button"
                    class="mt-2 w-fit rounded-sm bg-emerald-500 py-2 px-4 text-sm text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                    @click="logout">
                    Logout
                </button>
            </div>
            <div class="mt-2 flex w-full max-w-md flex-col items-center">
                <button type="button"
                    class="mt-2 w-fit rounded-sm bg-emerald-500 py-2 px-4 text-sm text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                    @click="protect">
                    TEST
                </button>
                <div class="mt-2 flex">
                    <label class="text-lg font-semibold text-emerald-500">TEST</label>
                    <span class="ml-2 flex text-lg text-slate-700"></span>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { useTokenStore } from '../stores/token'
const tokenStore = useTokenStore()

// const name = useCookie('name')
// const counter = useCookie('counter', { maxAge: 60 })
// const jwt = useCookie('jwt', { maxAge: 60 * 60 * 24 * 30, httpOnly: true });

// const setJWT = () => {
//     console.log(tokenStore.getToken)
//     jwt.value = tokenStore.getToken
// }
// const setNameCookie = () => {
//     name.value = 'Ryan'
// }
// const setCounterCookie = () => {
//     counter.value = Math.round(Math.random() * 1000)
// }
// const login = async () => {
//     let result = await tokenStore.login("ty80517@gmail.com", "abc")
//     console.log(result)
//     console.log(tokenStore.getIsLogin)
// }
// const logout = async () => {
//     let result = await tokenStore.logout()
//     console.log(result)
// }

// const protect = async () => {
//     let result = await tokenStore.authentication()
//     console.log(result)
// }
</script>