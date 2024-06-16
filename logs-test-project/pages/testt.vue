<template>

    <DataCard :test="data">
        Helloaaabbb
    </DataCard>
    <!-- <DataRow /> -->
</template>
<script setup>

const { pending, data } = await useAsyncData('parkingspace', () => $fetch('/api/es/parkingspace'), {
    default: () => { }
})

// const { pending, data } = await useAsyncData('parkingspace', () => $fetch('/api/randomNumber_charger_id'), {
//     default: () => { }
// })
// useIntervalFn(() => {
//     console.log(`refreshing the data again ${new Date().toISOString()}`)
//     refresh() // will call the 'todos' endpoint, just above
// }, 3000) // call it back every 3s

watch(data, (newData) => {
    console.log(newData);
})
const updateParkingSpace = () => {
    refreshNuxtData('parkingspace')
    setTimeout(updateParkingSpace, 5000)
}
updateParkingSpace()
</script>