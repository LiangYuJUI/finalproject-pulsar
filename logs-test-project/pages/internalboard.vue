<template>
    <div class="w-full bg-black h-screen my-auto items-center justify-center">
        <div class="w-full bg-black h-[150px]">

        </div>
        <div class="w-[1100px] bg-black mx-auto border-white border-b justify-center items-center">

            <div class="flex items-center justify-center h-[71px] mx-auto text-white text-center text-5xl font-bold">
                智 能 排 程 電 子 看 板
            </div>


            <div class="w-full h-[46px] flex mx-auto">

                <div id="pile-container" class="mx-auto flex items-center">
                    <div id="pile-label" class="w-[275px] text-white mx-auto text-center text-4xl font-bold">剩餘車位</div>
                    <div id="pile" class="w-[275px] text-white mx-auto text-center text-4xl font-bold">{{ usablePileNum }}
                    </div>
                </div>

                <div id="time-container" class="mx-auto flex items-center">
                    <div id="time-label" class="w-[275px] text-white mx-auto text-center text-4xl font-bold">現在時刻</div>
                    <div id="time" class="w-[275px] text-white mx-auto text-center text-4xl font-bold">
                        {{ Time.toLocaleString({
                            hour: '2-digit', minute: '2-digit'
                        }).slice(10, 30)
                        }}
                    </div>
                </div>

            </div>

            <div id="info"
                class="flex justify-center w-full h-[71px] text-white text-center text-4xl items-center font-bold">即將進站車輛資訊
            </div>

            <div id="block-information" class="w-full flex-row border-white border-t">

                <div id="block1-2" class="w-full flex mx-auto text-white border-white border-b">
                    <div id="block1" class="flex-row mx-auto border-white border-r">
                        <div id="label1"
                            class="h-[72px] flex justify-center mx-auto border-white border-dashed border-b items-center">
                            <div id="l-plate1" class="w-[275px] text-center text-white mx-auto text-4xl font-bold">車牌號碼
                            </div>
                            <div id="l-number1" class="w-[275px] text-center text-white mx-auto text-4xl font-bold">充電區
                            </div>
                        </div>
                        <div id="data1" class="h-[75px] flex mx-auto items-center">
                            <div id="d-plate1" class="w-[275px] text-center text-white mx-auto text-4xl font-bold">{{
                                reserveSpace[0]?.PlateNumber }}</div>
                            <div id="d-number1" v-if="reserveSpace[0]?.Zone == 'A'" class="w-[275px] text-center text-red-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[0]?.Zone }}
                            </div>
                            <div id="d-number1" v-else-if="reserveSpace[0]?.Zone == 'B'" class="w-[275px] text-center text-yellow-400 mx-auto text-4xl font-bold">
                                {{reserveSpace[0]?.Zone }}
                            </div>
                            <div id="d-number1" v-else-if="reserveSpace[0]?.Zone == 'C'" class="w-[275px] text-center text-green-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[0]?.Zone }}
                            </div>
                            <div id="d-number1" v-else class="w-[275px] text-center text-white mx-auto text-4xl font-bold">
                                {{reserveSpace[0]?.Zone }}
                            </div>
                        </div>
                    </div>

                    <div id="block2" class="flex-row mx-auto">
                        <div id="label2"
                            class="h-[72px] flex justify-center mx-auto border-white border-dashed border-b items-center">
                            <div id="l-plate2" class="w-[275px] text-center text-white mx-auto text-4xl font-bold">車牌號碼
                            </div>
                            <div id="l-number2" class="w-[275px] text-center text-white mx-auto text-4xl font-bold">充電區
                            </div>
                        </div>
                        <div id="data2" class="h-[75px] flex mx-auto items-center">
                            <div id="d-plate2" class="w-[275px] text-center  text-white mx-auto text-4xl font-bold">{{
                                reserveSpace[1]?.PlateNumber }}</div>
                            <div id="d-number2" v-if="reserveSpace[1]?.Zone == 'A'" class="w-[275px] text-center text-red-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[1]?.Zone }}
                            </div>
                            <div id="d-number2" v-else-if="reserveSpace[1]?.Zone == 'B'" class="w-[275px] text-center text-yellow-400 mx-auto text-4xl font-bold">
                                {{reserveSpace[1]?.Zone }}
                            </div>
                            <div id="d-number2" v-else-if="reserveSpace[1]?.Zone == 'C'" class="w-[275px] text-center text-green-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[1]?.Zone }}
                            </div>
                            <div id="d-number2" v-else class="w-[275px] text-center text-white mx-auto text-4xl font-bold">
                                {{reserveSpace[1]?.Zone }}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="block3-4" class="w-full flex mx-auto text-white border-white border-b ">
                    <div id="block3" class="flex-row mx-auto border-white border-r">
                        <div id="data3" class="h-[75px] flex mx-auto items-center">
                            <div id="d-plate3" class="w-[275px] text-center text-white mx-auto text-4xl font-bold">{{
                                reserveSpace[2]?.PlateNumber }}</div>
                            <div id="d-number3" v-if="reserveSpace[2]?.Zone == 'A'" class="w-[275px] text-center text-red-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[2]?.Zone }}
                            </div>
                            <div id="d-number3" v-else-if="reserveSpace[2]?.Zone == 'B'" class="w-[275px] text-center text-yellow-400 mx-auto text-4xl font-bold">
                                {{reserveSpace[2]?.Zone }}
                            </div>
                            <div id="d-number3" v-else-if="reserveSpace[2]?.Zone == 'C'" class="w-[275px] text-center text-green-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[2]?.Zone }}
                            </div>
                            <div id="d-number3" v-else class="w-[275px] text-center text-white mx-auto text-4xl font-bold">
                                {{reserveSpace[2]?.Zone }}
                            </div>
                        </div>
                    </div>

                    <div id="block4" class="flex-row mx-auto">
                        <div id="data4" class="h-[75px] flex mx-auto items-center">
                            <div id="d-plate4" class="w-[275px] text-center text-white mx-auto text-4xl font-bold ">
                                {{reserveSpace[3]?.PlateNumber }}
                            </div>
                            <div id="d-number4" v-if="reserveSpace[3]?.Zone == 'A'" class="w-[275px] text-center text-red-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[3]?.Zone }}
                            </div>
                            <div id="d-number4" v-else-if="reserveSpace[3]?.Zone == 'B'" class="w-[275px] text-center text-yellow-400 mx-auto text-4xl font-bold">
                                {{reserveSpace[3]?.Zone }}
                            </div>
                            <div id="d-number4" v-else-if="reserveSpace[3]?.Zone == 'C'" class="w-[275px] text-center text-green-600 mx-auto text-4xl font-bold">
                                {{reserveSpace[3]?.Zone }}
                            </div>
                            <div id="d-number4" v-else class="w-[275px] text-center text-white mx-auto text-4xl font-bold">
                                {{reserveSpace[3]?.Zone }}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="error" class="w-full h-[66px] flex mx-auto text-white justify-center items-center">
                    <div id="error0" class="w-1/5 text-center text-4xl ml-4 font-bold">停用：</div>
                    <div id="error1" class="w-1/5 text-center text-4xl font-bold">{{ errorpile[0] }}</div>
                    <div id="error2" class="w-1/5 text-center text-4xl font-bold">{{ errorpile[1] }}</div>
                    <div id="error3" class="w-1/5 text-center text-4xl font-bold">{{ errorpile[2] }}</div>
                    <div id="error4" class="w-1/5 text-center text-4xl font-bold">{{ errorpile[3] }}</div>
                </div>

            </div>

            <div id="logo" class="w-full h-[72px] bg-white flex text-center justify-center items-center">
                <div class="text-black text-5xl text-center font-bold">
                    指導單位: 交通部 運研所
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: false,
});

import { ref, onMounted } from 'vue';

// 交通部參訪 ms有問題先帶假資料測試
const fakeData = [
    { "PlateNumber": "EAA-087", "Zone": "C" },
    { "PlateNumber": "EAA-031", "Zone": "A" },
    { "PlateNumber": "EAL-1198", "Zone": "A" },
    { "PlateNumber": "EAA-215", "Zone": "B" },
    { "PlateNumber": "EAA-185", "Zone": "C" },
    { "PlateNumber": "EAA-188", "Zone": "A" },
    { "PlateNumber": "EAA-030", "Zone": "B" },
    { "PlateNumber": "EAL-1193", "Zone": "候補1" },
    { "PlateNumber": "EAA-033", "Zone": "候補2" }
];

const config = [];
let errorpile = [];

$fetch("/api/v2/config")
    .then(response => {
        const configData = response.data.charger_list;
        configData.forEach(element => {
            config[element.charger_id] = element.charger_name;
        });
    })
    .catch(error => {
        console.error('Error fetching config:', error);
    });



// 當前時間
const Time = ref("");
const updateTime = () => {
    Time.value = new Date();
    setTimeout(updateTime, 1000);
}
updateTime();

// 故障車位list
let errorList = [];

// 剩餘充電樁
const usablePileNum = ref(0);
const { pending: evs_p, data: evs } = await useAsyncData('ev_status', () => $fetch('/api/v2/ev_status'), {
    default: () => { }
});
watch(evs, (new_evs) => {
    errorList = []
    usablePileNum.value = 0;
    for (let i = 0; i < new_evs?.data.length; i++) {
        if (new_evs.data[i].status_code == 0) {
            usablePileNum.value++;
        } else if (new_evs.data[i].status_code == 6) {
            errorList.push(config[new_evs.data[i].charger_id]);
        }
    }
    if (usablePileNum.value == 0) {
        usablePileNum.value = "滿樁";
    }
});

let errorPileRound = 0;
const showErrorPile = () => {
    if (errorPileRound >= ((errorList.length - 1) / 4)) {
        errorPileRound = 0;
    } else {
        errorPileRound++;
    }

    for (let i = 0; i < 4; i++) {
        errorpile[i] = errorList[(errorPileRound * 4) + i];
    }

    setTimeout(showErrorPile, 8000);
}
showErrorPile();

// 車位區域預約
const { pending: res_p, data: res } = await useAsyncData('reserve_space', () => $fetch('/api/reserve'), {
    default: () => { }
});

let reserveList = [];
let reserveSpace = []

watch(res, (new_res) => {
    reserveList = []
    new_res.forEach(element => {
        reserveList.push(element);
    });
});

let reserveSpaceRound = 0;
const showReserveSpace = () => {
    if (reserveList.length == 0) {
        if (reserveSpaceRound >= ((fakeData.length - 1) / 4)) {
            reserveSpaceRound = 0;
        } else {
            reserveSpaceRound++;
        }

        for (let i = 0; i < 4; i++) {
            reserveSpace[i] = fakeData[(reserveSpaceRound * 4) + i];
        }
    } else {
        if (reserveSpaceRound >= ((reserveList.length - 1) / 4)) {
            reserveSpaceRound = 0;
        } else {
            reserveSpaceRound++;
        }

        for (let i = 0; i < 4; i++) {
            reserveSpace[i] = reserveList[(reserveSpaceRound * 4) + i];
            console.log(reserveSpace[i]);
        }
    }

    setTimeout(showReserveSpace, 8000);
}
showReserveSpace();

const update_data = () => {
    refreshNuxtData('ev_status');
    refreshNuxtData('reserve_space');
    setTimeout(update_data, 30000);
};
update_data();

</script>