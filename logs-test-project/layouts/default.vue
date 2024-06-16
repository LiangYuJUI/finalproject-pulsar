<template>
    <div class="py-0 flex flex-col h-screen">
        <div>
            <slot name="header" />
        </div>
        <div class="bg-gradient-to-r from-green-300 to-blue-600 flex grow flex-col py-3">
            <slot />
        </div>
        <div>
            <slot name="footer" />
        </div> 
    </div>
</template>