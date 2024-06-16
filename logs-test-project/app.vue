<template>
    <!-- use layouts/default.vue -->
    <NuxtLayout>
        <!-- put `TheHeader.vue component` to `header slot` in `layouts/default.vue` -->
        <template #header>
            <TheHeader />
        </template>
        
        <NuxtPage />
        <NuxtLoadingIndicator :height="6" :duration="10000" :throttle="20" />
        <!-- put `TheFooter.vue component` to `footer slot` in `layouts/default.vue` -->
        <template #footer>
            <TheFooter />
        </template>
    </NuxtLayout>
</template>

<style>
.page-enter-active, .page-leave-active {
    transition: all .6s;
}
.page-enter-from, .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>