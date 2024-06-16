<template>
    <div class="bg-slate-50 pt-6 pb-6">
        <div class="flex flex-col items-center mb-6">
            <h1 class="text-4xl lg:text-5xl 2xl:text-6xl font-semibold font-shantell text-gray-700 select-none">
                設定
            </h1>
            <h3 class="text-lg lg:text-xl 2xl:text-2xl font-shantell text-gray-700/50 select-none">
                Setting
            </h3>
        </div>
        <div class="mb-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto text-center border rounded-lg" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';">
            <div class="border-t-0.5 bg-green-200 rounded-t-lg md:col-span-2 xl:col-span-3 hover:opacity-80">
                <label class="font-npc">場域參數</label>
            </div>
            <div class="p-2 m-1 flex flex-col text-left">
                <label class="text-gray-700" for="station_name">場域名稱</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(station_name)" v-model="config.station_name" id="station_name" type="input" >
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="station_id">場域編號</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(station_name)" v-model="config.station_id" id="station_id" type="input" >
            </div>
            <div></div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="location_latitude">緯度</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(location_latitude)" v-model="config.location[0]" id="location_latitude" type="input">
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="location_longitude">經度</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(location_longitude)" v-model="config.location[1]" id="location_longitude" type="input">
            </div>
            <div>
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="summer_date_start">夏季平日尖峰起始日期</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(summer_date_start)" v-model="config.summer_date_start" id="summer_date_start" type="input">
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="summer_date_end">夏季平日尖峰結束日期</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(summer_date_end)" v-model="config.summer_date_end" id="summer_date_end" type="input">
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="kw_limit">場域功率上限</label>
                <span class="relative table mx-6">
                    <input class="w-full text-center border border-gray-300 rounded-l-md text-gray-900 text-sm p-1" @click="console.log(station_name)" v-model="config.kw_limit" id="kw_limit" type="input" >
                    <span class="relative table-cell text-center border border-gray-300 border-l-0 rounded-r-md select-none">kW</span>
                </span>
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="summer_time_start">非夏季平日尖峰起始時間</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(summer_time_start)" v-model="config.summer_time_start" id="summer_time_start" type="input">
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="summer_time_end">非夏季平日尖峰結束時間</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(summer_time_end)" v-model="config.summer_time_end" id="summer_time_end" type="input">
            </div>
            <div></div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="peak_time_start">平日尖峰起始時間</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(peak_time_start)" v-model="config.peak_time_start" id="peak_time_start" type="input">
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="peak_time_end">平日尖峰結束時間</label>
                <input class="text-center mx-6 p-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block" @click="console.log(peak_time_end)" v-model="config.peak_time_end" id="peak_time_end" type="input">
            </div>
            <div class="p-2 my-1 flex flex-col text-left">
                <label class="text-gray-700" for="peak_time_kw_limit">尖峰時間用電上限</label>
                <span class="relative table mx-6">
                    <input class="w-full text-center border border-gray-300 rounded-l-md text-gray-900 text-sm p-1" @click="console.log(peak_time_kw_limit)" v-model="config.peak_time_kw_limit" id="peak_time_kw_limit" type="input" >
                    <span class="relative table-cell text-center border border-gray-300 border-l-0 rounded-r-md select-none">kW</span>
                </span>
            </div>
            <div class="flex md:col-span-2 xl:col-span-3 max-w-7xl mx-auto ">
                <div class="flex flex-row my-6">
                    <div @click="uploadConfig" class="m-auto mx-6 px-8 py-3 cursor-pointer bg-blue-400 text-blue-800 border rounded-md text-center shadow-md hover:opacity-80">
                        儲存
                    </div>
                    <div @click="resetConfig" class="m-auto mx-6 px-8 py-3 cursor-pointer bg-red-400 text-red-800 rounded-md text-center shadow-md hover:opacity-80">
                        回復預設值
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto text-center border rounded-lg" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';">
            <div class="border-t-0.5 bg-yellow-200 rounded-t-lg md:col-span-2 xl:col-span-3 hover:opacity-80">
                <label class="font-npc">用電量排程</label>
            </div>
            <div class="md:col-span-2 xl:col-span-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-auto my-2 " role="alert">
                <p class="font-bold">請注意！</p>
                <p class="text-left">- 本功能之充電樁用電量偵測方法為收集充電樁回傳之資訊後，統整並控制充電樁電流，並不能完全反映場域之用電量，實際用電量可能會超過所排程之上限。</p>
                <p class="text-left">- 僅須設定例外時段，沒有設定的時段系統會依照「場域參數」欄位中設定的時間與功率執行，優先權為：例外＞例行＞場域參數</p>
            </div>
            <div class="p-2 m-1 flex flex-col text-left col-span-3 text-center">
                <div class="text-left font-bold border-t-4">
                    新增規則
                </div>
                <div class="table w-full border-b-4">
                    <div class="table-header-group">
                        <div class="table-row">
                            <div class="table-cell">規則</div>
                            <div class="table-cell">開始時間</div>
                            <div class="table-cell">結束時間</div>
                            <div class="table-cell" v-if="selected=='regular'">星期</div>
                            <div class="table-cell">充電樁用電上限</div>
                            <div class="table-cell">創建者</div>
                            <div class="table-cell">操作</div>
                        </div>
                    </div>
                    <div class="table-row-group">
                        <div class="table-row text-center font-mono">
                            <div class="table-cell align-middle">
                                <select v-model="selected" name="rule" class="text-center outline-none rounded-sm border border-yellow-200">
                                    <option value="regular">例行</option>
                                    <option value="exception">例外</option>
                                </select>
                            </div>
                            <div class="table-cell align-middle">
                                <input type="input" v-if="selected=='regular'" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" v-model="inputStartTimeRegular" placeholder="hh:mm" class="text-center outline-none rounded-sm border border-yellow-200" required>
                                <input type="input" v-if="selected=='exception'" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" v-model="inputStartDateTimeException" placeholder="YYYY-MM-DD hh:mm" class="text-center outline-none rounded-sm border border-yellow-200" required>
                            </div>
                            <div class="table-cell align-middle">
                                <input type="input" v-if="selected=='regular'" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" v-model="inputEndTimeRegular" placeholder="hh:mm" class="text-center outline-none rounded-sm border border-yellow-200" required>
                                <input type="input" v-if="selected=='exception'" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" v-model="inputEndDateTimeException" placeholder="YYYY-MM-DD hh:mm" class="text-center outline-none rounded-sm border border-yellow-200" required>
                            </div>
                            <div v-if="selected=='regular'" class="table-cell align-middle">
                                <div  class="flex flex-row justify-between mx-auto">
                                    <div v-for="number in 7" class="flex flex-col hover:bg-yellow-100 px-1">
                                        <label :for="'week'+(number-1)%7" class="cursor-pointer select-none">{{weekday[(number-1)%7]}}</label>
                                        <input type="checkbox" v-model="week" :id="'week'+(number-1)%7" :value="(number-1)%7" class="text-center outline-none rounded-sm border border-yellow-200 cursor-pointer">
                                    </div>
                                </div>
                                <div>{{ week.sort() }}</div>
                            </div>
                            <div class="table-cell align-middle">
                                <input type="input" v-model="inputCapacityLimit" placeholder="600" class="text-center outline-none rounded-sm border border-yellow-200">
                            </div>
                            <div class="table-cell align-middle">
                                {{ tokenStore.user.name }}
                            </div>
                            <div class="table-cell align-middle">
                                <button @click="addCapacityLimitRecord" class="bg-green-300/60 px-1 py-0.5 mx-0.5 rounded-sm text-sm hover:opacity-80">新增</button>
                            </div>
                        </div>
                        <div class="my-2"></div>
                        
                    </div>
                </div>
                <div class="table w-full border-b-4">
                    <div class="text-left font-bold">例外規則清單</div>
                    <div class="table-row text-center font-mono">
                        <div class="table-cell border-b-2">開始日期時間</div>
                        <div class="table-cell border-b-2">結束日期時間</div>
                        <div class="table-cell border-b-2">充電樁電量限制(kw)</div>
                        <div class="table-cell border-b-2">規則創建時間</div>
                        <div class="table-cell border-b-2">創建者</div>
                        <div class="table-cell border-b-2">操作</div>
                    </div>
                    <div class="mt-2 w-full"></div>
                    <div v-for="eachRow in scheduleExceptionHistory?.data" class="table-row text-center font-mono hover:bg-yellow-100 transition ease-linear">
                        <div class="table-cell">{{ `${eachRow.startDateTime.substring(0, 10)} ${eachRow.startDateTime.substring(11, 16)}` }}</div>
                        <div class="table-cell">{{ `${eachRow.endDateTime.substring(0, 10)} ${eachRow.endDateTime.substring(11, 16)}` }}</div>
                        <div class="table-cell">{{ eachRow.capacityLimit }}</div>
                        <div class="table-cell">{{ `${eachRow.createDateTime.substring(0, 10)} ${eachRow.createDateTime.substring(11, 16) }` }}</div>
                        <div class="table-cell">{{ eachRow.createdBy }}</div>
                        <div class="table-cell">
                            <button @click="deleteCapacityLimitRecord('exception', eachRow.id)" class="bg-red-300/60 px-1 py-0.5 mx-0.5 rounded-sm text-sm hover:opacity-80">刪除</button>
                        </div>
                    </div>
                </div>
                <div class="table w-full border-b-4">
                    <div class="text-left font-bold">例行規則清單</div>
                    <div class="table-row text-center font-mono">
                        <div class="table-cell border-b-2">開始時間</div>
                        <div class="table-cell border-b-2">結束時間</div>
                        <div class="table-cell border-b-2">星期</div>
                        <div class="table-cell border-b-2">充電樁電量限制(kw)</div>
                        <div class="table-cell border-b-2">規則創建時間</div>
                        <div class="table-cell border-b-2">創建者</div>
                        <div class="table-cell border-b-2">操作</div>
                    </div>
                    <div class="mt-2 w-full"></div>
                    <div v-for="eachRow in scheduleRegularHistory?.data" class="table-row text-center font-mono hover:bg-yellow-100 transition ease-linear">
                        <div class="table-cell">{{ `${eachRow.startTime.substring(11, 16)}` }}</div>
                        <div class="table-cell">{{ `${eachRow.endTime.substring(11, 16)}` }}</div>
                        <div class="table-cell align-middle">
                            <label class="px-1" v-for="number in 7">
                                <span>{{ eachRow.weekDay.split(',').indexOf(String(number-1)) > -1 ? weekday[number-1] : "　" }}</span>
                            </label>
                        </div>
                        <div class="table-cell">{{ eachRow.capacityLimit }}</div>
                        <div class="table-cell">{{ `${eachRow.createDateTime.substring(0, 10)} ${eachRow.createDateTime.substring(11, 16) }` }}</div>
                        <div class="table-cell">{{ eachRow.createdBy }}</div>
                        <div class="table-cell">
                            <button @click="deleteCapacityLimitRecord('regular', eachRow.id)" class="bg-red-300/60 px-1 py-0.5 mx-0.5 rounded-sm text-sm hover:opacity-80">刪除</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        
        <ResultDialog v-show="isResult" :msg="isResultMsg" :status="isResultStatus" />
        <PendingDialog v-show="isPending" :msg="isPendingMsg" />
    </div>
</template>
<script setup>
import { useTokenStore } from '../../../stores/token';

definePageMeta({
    middleware: defineNuxtRouteMiddleware( async (to, from) => {
        const tokenStore = useTokenStore()
        const result = await tokenStore.authRole("manager");
        // console.log(result)
        if (process.client) {
            if (result.error.value){
                if(to.path !== `/login`){
                    alert("Permission denied");
                    return navigateTo('/');
                }
            }
        }
    })
})

const tokenStore = useTokenStore();
const isResult = ref(false);
const isResultMsg = ref("OK");
const isResultStatus = ref("")
const isPending = ref(false);
const isPendingMsg = ref("Processing...");


const showResultDialog = (msg="OK", status="") => {
    isResultMsg.value = msg;
    isResultStatus.value = status;
    isPending.value = false;
    isResult.value = true;
    setTimeout( function(){isResult.value=false}, 1500 );
}


const config = reactive( (await $fetch("/api/v2/config")).data );

const uploadConfig = async () => {
    try {
        isPending.value = true;
        const upload_result = await $fetch("/api/v2/config", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "station_name": config.station_name,
                "station_id": config.station_id,
                "kw_limit": parseInt(config.kw_limit),
                "summer_date_start": config.summer_date_start,
                "summer_date_end": config.summer_date_end,
                "summer_time_start": config.summer_time_start,
                "summer_time_end": config.summer_time_end,
                "peak_time_start": config.peak_time_start,
                "peak_time_end": config.peak_time_end,
                "peak_time_kw_limit": config.peak_time_kw_limit,
                "location": [Number(config.location[0]), Number(config.location[1])]
            })
        })
        if (upload_result.success) {
            showResultDialog("成功儲存");
        }
        else {
            showResultDialog("資料儲存失敗", "error");
        }
    }
    catch (error) {
        showResultDialog("錯誤", "error");
    }
    finally{
        
    }
}
const resetConfig = async () => {
    try {
        const upload_result = await $fetch("/api/v2/config?defaultConfig", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (upload_result.success) {
            config.station_id = upload_result.data.station_id;
            Object.keys(upload_result.data).map( (d) => {
                config[d] = upload_result.data[d]
            })
            showResultDialog("成功回復預設值，請點儲存");
        }
        else {
            showResultDialog("取得預設值失敗", "error");
        }
    }
    catch (error) {
        showResultDialog("錯誤", "error");
    }
    finally{

    }
}
const weekday = ["日", "一", "二", "三", "四", "五", "六"];
const inputStartTimeRegular = ref('');
const inputEndTimeRegular = ref('');
const inputStartDateTimeException = ref('');
const inputEndDateTimeException = ref('');
const inputCapacityLimit = ref('');
const week = ref([]);
const selected = ref('regular');

const { pending: scheduleExceptionHistory_p, data: scheduleExceptionHistory } = await useAsyncData('scheduleExceptionHistory', () => $fetch("/api/v2/ms/schedule/exception"))
watch(scheduleExceptionHistory, (newScheduleHistory) => {
    console.log(newScheduleHistory)
});
const { pending: scheduleRegularHistory_p, data: scheduleRegularHistory } = await useAsyncData('scheduleRegularHistory', () => $fetch("/api/v2/ms/schedule/regular"))
watch(scheduleRegularHistory, (newScheduleHistory) => {
    console.log(newScheduleHistory)
});

const addCapacityLimitRecord = async () => {
    // get now date&time
    const nowDateTime = (new Date()).toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).replaceAll("/", "-");
    
    // e.g. 2023-11-14 00:00 ~ 2023-11-14 20:00, set capacity limit to 600 kw.
    if(selected.value == "exception") {
        // 2023-11-14 00:00:00
        const startDateTime = `${inputStartDateTimeException.value}:00`;
        // 2023-11-14 00:20:00
        const endDateTime = `${inputEndDateTimeException.value}:00`
        // console.log(startDateTime, endDateTime);
        try {
            const upload_result = await $fetch("/api/v2/ms/schedule/exception", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    startDateTime:  startDateTime,
                    endDateTime:    endDateTime,
                    capacityLimit:  inputCapacityLimit.value,
                    createDateTime: nowDateTime,
                    createdBy:      tokenStore.user.name
                }
            })
            refreshNuxtData("scheduleExceptionHistory");
        }
        catch ( error ) {
            alert(error);
        }
    }
    else if(selected.value == "regular") {
        const startTime = `${inputStartTimeRegular.value}:00`;
        const endTime = `${inputEndTimeRegular.value}:00`;
        const weekDay = week.value.join();
        try {
            const upload_result = await $fetch("/api/v2/ms/schedule/regular", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    startTime:  startTime,
                    endTime:    endTime,
                    weekDay:    weekDay,
                    capacityLimit:  inputCapacityLimit.value,
                    createDateTime: nowDateTime,
                    createdBy:      tokenStore.user.name
                }
            })
            refreshNuxtData("scheduleRegularHistory");
        }
        catch ( error ) {
            alert(error);
        }
    }
}
const deleteCapacityLimitRecord = async (scheduleType, delete_id) => {
    const result = await $fetch(`/api/v2/ms/schedule/${scheduleType}/${delete_id}`, {
        method: "DELETE",
    })
    alert(JSON.stringify(result));
    refreshNuxtData("scheduleExceptionHistory");
    refreshNuxtData("scheduleRegularHistory");
}
</script>