<!-- VehicleInfo.vue -->
<template>
    <div v-if="props.license_plate" class="w-full h-full border-solid border px-3 py-2 font-mono" :class="[props.status_code==2 ? 'bg-purple-500/40':'bg-green-500/40']"  style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
        <div class="flex flex-row justify-between">
            <div class="text-4xl font-black">{{ `${props.license_plate}` }}<sub class="text-sm">{{` ${props.charger_name}`}}</sub></div>
            <div class="vertical-bottom">{{ props.soc }}</div>
        </div>
        <div class="relative p-1 text-left hover:opacity-80 transition">
            <div class="absolute h-2 p-0 top-0 right-0 z-30 border-r border-green-300 rounded-r" :style="{ width: 100-parseInt(props.soc) + '%' }" style="background-color:rgb(29, 30, 35);"></div>
            <div class="absolute w-full h-2 top-0 left-0 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded"></div>
            <!-- <div class="absolute h-4 top-0 right-0 bg-black pointer-events-none z-20" :style="{ width: 109-Number(props.soc)+'%' }"></div> -->
        </div>
        <div v-if="props.charge_current">
            {{ `${props.charge_current} - ${String(parseInt(charge_time/60/60)).padStart(2, "0")}:${String(parseInt(charge_time/60)%60).padStart(2, "0")}:${String(charge_time%60).padStart(2, "0")} ` }}
        </div>
    </div>
</template>
<script setup>
    import { defineProps } from 'vue';
    const props = defineProps(['license_plate', 'status_code', 'soc', 'charge_current', 'charger_name', 'charge_time']);
</script>