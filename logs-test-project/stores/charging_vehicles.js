import { defineStore } from 'pinia'

export const useChargingVehicleStore = defineStore('charging_vehicles', {
    state: () => ({
        data: [],
    }),
    actions: {
        async getVehiclesData() {
            const result = await useFetch("/api/v2/station_status");
            if( result.data.value.data ){
                this.data = result.data.value.data.piles;
            }
            return result.data.value.data.piles;
        },
    },
    getters: {
        getData: (state) => state.data,
    }
})

