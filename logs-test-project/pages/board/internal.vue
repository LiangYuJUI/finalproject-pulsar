<template>
    <div class="flex flex-col w-screen h-screen" style="background-color:rgb(20, 21, 25);">
        <div class="flex flex-row justify-between w-full text-center text-white p-2">
            <!-- <sub class="text-xs"><sup class="text-red-500">* </sup>功率僅供參考，實際功耗應依台電為準</sub> -->
            <div></div>
            <h1 class="text-3xl">中興巴士集團 - 北士科站</h1>
            <!-- <img src="/_ipx/w_168/images/gochabar_logo.png" width="168" class="opacity-80"> -->
            <div></div>
        </div>
        <div class="flex flex-row w-full h-full p-2">
            <div class="flex flex-col w-4/5 h-full text-gray-50" style="background-color:rgb(20, 21, 25);">
                <div class="w-full h-2/5 mt-1 mx-1 p-2" style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                    <!-- <div class="rounded-md bg-gray-950" style="height:264px; padding:8px;">a</div> -->
                    <iframe class="" style="background-color:rgb(20, 21, 25);" src="https://neopower.com.tw:5601/s/anonymous/app/dashboards?auth_provider_hint=anonymous1#/view/90e34220-03a3-11ef-88d7-8de6e54fce48?embed=true&_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A15000)%2Ctime%3A(from%3Anow-1d%2Cto%3Anow))&hide-filter-bar=true" height="100%" width="100%"></iframe>
                </div>
                <div class="flex flex-row w-full h-3/5 m-1" style="background-color:rgb(29, 30, 35); box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                    <div class="flex flex-col justify-around w-1/12 h-full">
                        <div></div>
                        <img class="transition duration-150 p-4" src="/images/icon/building.png" >
                        <div></div>
                        <img class="transition duration-150 p-4" src="/images/icon/toilet.png" >
                        <div></div>
                    </div>
                    <div class="flex flex-col w-11/12 h-full">
                        <div class="flex flex-col justify-start h-full font-mono rotate-0">
                            <div class="flex flex-row justify-start h-1/3 p-1">
                                <div v-for="pile in piles_data.slice(0,25)" class="flex flex-col grow justify-center m-0.5 rotate-0" :class="[pile.bg_color_class_name]" style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                                    <div class="w-full h-full rounded-sm text-md select-none">
                                        <div class="border-2">
                                            <label class="absolute text-xs">{{ pile.charger_name }}</label>
                                        </div>
                                        <div class="absolute text-center font-black text-xl py-4" style="writing-mode: vertical-lr;">{{ pile.license_plate }}</div>
                                        <div class="absolute right-0 -bottom-1">{{ pile.soc }}</div>
                                        <div class="absolute right-0 bottom-3">{{ pile.current }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-row justify-start h-1/3 p-1">
                                <div v-for="(pile, idx) in piles_data.slice(25,50)" class="flex flex-col grow justify-center m-0.5 rotate-0" :class="[{invisible: ( idx>16 )}, pile.bg_color_class_name]" style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                                    <div class="w-full h-full rounded-sm text-md select-none">
                                        <div class="border-2">
                                            <label class="absolute text-xs">{{ pile.charger_name }}</label>
                                        </div>
                                        <div class="absolute text-center font-black text-xl py-4" style="writing-mode: vertical-lr;">{{ pile.license_plate }}</div>
                                        <div class="absolute right-0 -bottom-1">{{ pile.soc }}</div>
                                        <div class="absolute right-0 bottom-3">{{ pile.current }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-row justify-start h-1/3 p-1">
                                <div v-for="(pile, idx) in piles_data.slice(42,52)" class="flex flex-col grow justify-center m-0.5 rotate-0" :class="[{invisible: ( idx>16 )}, pile.bg_color_class_name]" style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                                    <div class="w-full h-full rounded-sm text-md select-none">
                                        <div class="border-2">
                                            <label class="absolute text-xs">{{ pile.charger_name }}</label>
                                        </div>
                                        <div class="absolute text-center font-black text-xl py-4" style="writing-mode: vertical-lr; text-center;">{{ pile.license_plate }}</div>
                                        <div class="absolute right-0 -bottom-1">{{ pile.soc }}</div>
                                        <div class="absolute right-0 bottom-3">{{ pile.current }}</div>
                                    </div>
                                </div>
                                <div v-for="(pile, idx) in piles_data.slice(0,13)" class="invisible grow m-0.5">
                                    <div class="w-full h-full rounded-sm">
                                        <div class="border-2">
                                            <label class="absolute text-xs">{{ pile.charger_name }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div v-for="(pile, idx) in piles_data.slice(52,53)" class="flex flex-col grow justify-center m-0.5 origin-center rotate-45 -translate-x-36 -translate-y-24" :class="[pile.bg_color_class_name]" style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                                    <div class="w-full h-full rounded-sm text-md select-none">
                                        <div class="border-2">
                                            <label class="absolute text-xs">{{ pile.charger_name }}</label>
                                        </div>
                                        <div class="absolute text-center font-black text-xl py-4" style="writing-mode: vertical-lr;">{{ pile.license_plate }}</div>
                                        <div class="absolute right-0 -bottom-1">{{ pile.soc }}</div>
                                        <div class="absolute right-0 bottom-3">{{ pile.current }}</div>
                                    </div>
                                </div>
                                <div v-for="(pile, idx) in piles_data.slice(53,54)" class="flex flex-col grow justify-center m-0.5 origin-center rotate-45 -translate-x-24 -translate-y-24" :class="[pile.bg_color_class_name]" style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                                    <div class="w-full h-full rounded-sm text-md select-none">
                                        <div class="border-2">
                                            <label class="absolute text-xs">{{ pile.charger_name }}</label>
                                        </div>
                                        <div class="absolute text-center font-black text-xl py-4" style="writing-mode: vertical-lr;">{{ pile.license_plate }}</div>
                                        <div class="absolute right-0 -bottom-1">{{ pile.soc }}</div>
                                        <div class="absolute right-0 bottom-3">{{ pile.current }}</div>
                                    </div>
                                </div>
                                <div class="absolute bottom-0 right-0 m-2">
                                    <div class="flex flex-row text-sm">
                                        <div class="flex flex-row justify-center text-center">
                                            <span class="mx-1 h-6 w-6 p-1 border bg-gray-500/80 rounded-sm shadow-sm shadow-white"></span>
                                            <label class="my-auto">待命</label>
                                        </div>
                                        <div class="flex flex-row jusitify-center">
                                            <span class="mx-1 h-6 w-6 p-1 border bg-blue-500/80 rounded-sm shadow-sm shadow-white"></span>
                                            <label class="my-auto">準備</label>
                                        </div>
                                        <div class="flex flex-row jusitify-center">
                                            <span class="mx-1 h-6 w-6 p-1 border bg-purple-500/80 rounded-sm shadow-sm shadow-white"></span>
                                            <label class="my-auto">充電</label>
                                        </div>
                                        <div class="flex flex-row jusitify-center">
                                            <span class="mx-1 h-6 w-6 p-1 border bg-green-500/80 rounded-sm shadow-sm shadow-white"></span>
                                            <label class="my-auto">完成</label>
                                        </div>
                                        <div class="flex flex-row jusitify-center">
                                            <span class="mx-1 h-6 w-6 p-1 border bg-red-500/80 rounded-sm shadow-sm shadow-white"></span>
                                            <label class="my-auto">禁用</label>
                                        </div>
                                        <div class="flex flex-row jusitify-center">
                                            <span class="mx-1 h-6 w-6 p-1 border bg-yellow-500/80 rounded-sm shadow-sm shadow-white"></span>
                                            <label class="my-auto">異常</label>
                                        </div>
                                        <div class="flex flex-row jusitify-center">
                                            <span class="mx-1 h-6 w-6 p-1 border bg-black-500/80 rounded-sm shadow-sm shadow-white"></span>
                                            <label class="my-auto">斷線</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-1/5 h-full text-white overflow-y-hidden p-1" style="background-color:rgb(29, 30, 35);">
                <div class="h-full text-xl" style="box-shadow: 0 0 2px #fff, 0 0 5px #fff;">
                    <!-- <div class="text-3xl text-center border-b-8 border-gray-700/50">
                        車輛充電動態
                    </div> -->
                    <div class="flex flex-col w-full h-full">
                        <div class="w-full h-1/5 jusitify-start">
                            <VehicleInfo class="" v-for="vehicle in show_data" :key="vehicle.charger_id" :soc="vehicle.soc" :license_plate="vehicle.license_plate" :current="vehicle.current" :status_code="vehicle.status_code" :charger_name="vehicle.charger_name" :charge_time="vehicle.charge_time"/>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <ClientOnly>
            <div class="w-full bottom-0 left-0 bg-gradient-to-r from-blue-300/30 via-green-300/20 to-red-300/30 font-npc text-center">
                <label class="text-4xl text-gray-300">
                    {{ footerTimeString.toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})  }}
                </label>
            </div>
        </ClientOnly>
    </div>
    
</template>
<style>
.dashboardViewport {
    justify-content: end;
}
</style>
<script setup>
    definePageMeta({
        layout: false,
    });
    import VehicleInfo from '@/components/board/VehicleInfo.vue';
    import { useChargingVehicleStore } from '../../stores/charging_vehicles.js'
    const charging_vehicle = useChargingVehicleStore();
    const piles_data = ref([]);
    const show_data = ref([]);
    onMounted( async () => {
        piles_data.value = (await $fetch("/api/v2/config")).data.charger_list;
        for(let i=0;i<piles_data.value.length;i++){
            piles_data.value[i].status_code = -1;
            piles_data.value[i].current = 0;
            piles_data.value[i].voltage = 0;
            piles_data.value[i].soc = 0;
            piles_data.value[i].charge_time = 0;
            piles_data.value[i].license_plate = "?";
        }
    });
    const getTXID = async (charger_id, license_plate) => {
        return await $fetch("/api/v2/ms/getTransactionID", {
            method: "POST",
            body: { charger_id: charger_id, license_plate: license_plate }
        });
    };
    
    const update_vehicles_data = async (updated_data) => {
        updated_data.map( async (each_data) => {
            for(let i=0;i<piles_data.value.length;i++){
                if(piles_data.value[i].charger_id == each_data.charger_id){
                    piles_data.value[i].license_plate = each_data.license_plate;
                    piles_data.value[i].status_code = each_data.status_code;
                    piles_data.value[i].soc = each_data.soc != "" ?  each_data.soc+"%" : "";
                    piles_data.value[i].charge_time = each_data.charge_time;
                    piles_data.value[i].current = each_data.current == 0 ? "" : each_data.current;
                    piles_data.value[i].voltage = each_data.voltage == 0 ? "" : each_data.voltage;
                    switch(each_data.status_code){
                        case 0:
                            piles_data.value[i].bg_color_class_name = "bg-gray-500/80";
                            break;
                        case 1:
                            piles_data.value[i].bg_color_class_name = "bg-blue-500/80";
                            break;
                        case 2:
                            piles_data.value[i].bg_color_class_name = "bg-purple-500/80";
                            break;
                        case 3:
                            piles_data.value[i].bg_color_class_name = "bg-green-500/80";
                            break;
                        case 5:
                            piles_data.value[i].bg_color_class_name = "bg-red-500/80";
                            break;
                        case 6:
                            piles_data.value[i].bg_color_class_name = "bg-yellow-500/80";
                            break;
                        case 7:
                            piles_data.value[i].bg_color_class_name = "bg-black/80";
                            break;
                        default:
                            piles_data.value[i].bg_color_class_name = "bg-white/80";
                            break;
                    }
                    break;
                }
            }
        });
        let temp = piles_data.value.filter( (d) => {
            return (d.status_code == 2 || d.status_code == 3);
        })
        let record = [];
        show_data.value = [];
        while(temp.length && show_data.value.length < 5 && temp.length != show_data.value.length){
            let random_number = Math.floor(Math.random()*temp.length)+0;
            if(!record.includes(random_number)){
                record.push(random_number);
                show_data.value.push(temp[random_number]);
            }
        }
        // sort
        for(let i=0;i<show_data.value.length-1;i++){
            for( let j=i+1;j<show_data.value.length;j++){
                if(show_data.value[i].status_code > show_data.value[j].status_code){
                    let temp = show_data.value[i];
                    show_data.value[i] = show_data.value[j];
                    show_data.value[j] = temp;
                }
            }
        }
        for(let i=0;i<show_data.value.length-1;i++){
            for( let j=i+1;j<show_data.value.length;j++){
                if(parseInt(show_data.value[i].soc > parseInt(show_data.value[j].soc))){
                    let temp = show_data.value[i];
                    show_data.value[i] = show_data.value[j];
                    show_data.value[j] = temp;
                }
            }
        }
        
    }

    const footerTimeString = ref("")
    const updateTime = () => {
        footerTimeString.value = new Date();
        piles_data.value.map( (d)=>{
            d.charge_time++;
        });
        setTimeout( updateTime, 1000 );
    }
    updateTime();

    const update_data = async () => {
        // check&update pile&vehicle data every 5 sec.
        // refreshNuxtData('evs_status');
        let result = await charging_vehicle.getVehiclesData();
        update_vehicles_data(charging_vehicle.data);
        setTimeout(update_data, 5000);
    }
    update_data()

</script>