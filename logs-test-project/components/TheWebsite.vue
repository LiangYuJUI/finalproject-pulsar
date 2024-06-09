<template>
    <div class="lg:p-2 lg:px-4 mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink :to="item['og:url']" v-for=" (item, idx) in data.message" :key="idx" class="m-1">
            <div class="flex flex-row justify-around h-48 hover:opacity-80 ease-linear duration-100 shadow-md rounded-md">
                <div class="w-48 m-auto border-r-2">
                    <img class="flex justify-center	mx-auto shadow-md rounded-sm" :src="item.iconhref || item['og:image']" width="160">
                </div>
                <div class="w-52 m-auto">
                    <div class="flex px-2 text-gray-700 font-bold lg:text-lg">
                        {{ item["og:title"] }}
                    </div>
                    <div class="hidden sm:flex my-1 text-gray-400 lg:text-sm ">
                        <span class="inline-block px-2 overflow-hidden text-ellipsis truncate whitespace-normal max-h-20 text-xs">
                            {{ item["og:description"] }}
                        </span>
                    </div>
                </div>
            </div>
        </NuxtLink>
    </div>
    
</template>
<script setup>
    const { data } = await useAsyncData('data', () => $fetch('/api/website/list'))
    console.log( data )
    console.log( typeof data )
</script>