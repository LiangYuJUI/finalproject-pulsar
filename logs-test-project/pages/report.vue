
<template>
    <div class="p-6 bg-slate-50 flex-grow shadow-lg">
        <ClientOnly>
            <div class="max-w-5xl mx-auto my-3">
                <div>
                    <div class="mb-2">
                        <!-- <label for="success" class="block mb-2 text-sm font-medium text-green-700 dark:text-green-500">
                            開始日期 / Start date.
                        </label>
                        <input type="text" id="success" class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" placeholder="Success input">
                        <p class="mt-2 text-sm text-green-600 dark:text-green-500">
                            <span class="font-medium">
                                Well done!
                            </span>
                            Some success message.
                        </p>
                        </div> -->

                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 select-none mb-4">
                            <div class="mx-auto">
                                <label for="startDate" class="block mb-2 text-sm font-medium text-gray-700 dark:text-red-500">
                                    開始日期 / Start date.
                                </label>
                                <div class="relative w-full max-w-xs">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <input @change="isValidDate($event)" :class=" {'border-red-500':!reportData.start.isValid} " id="startDate" type="text" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm text-center rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="2023-01-01">
                                </div>
                            </div>
                            <div class="mx-auto">
                                <label for="endDatd" class="block mb-2 text-sm font-medium text-gray-700 dark:text-red-500">
                                    結束日期 / End date.
                                </label>
                                <div class="relative w-full max-w-xs">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <input @change="isValidDate($event)" :class=" {'border-red-500':!reportData.end.isValid} " id="endDate" type="text" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm text-center rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="2023-01-02">
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 select-none">
                            <div class="flex items-center mb-4">
                                <input id="plateNumber" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="plateNumber" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">車號</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="cardNumber" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="cardNumber" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">卡號</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="cardName" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="cardName" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">卡片名稱</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="tripBeforeCharge" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="tripBeforeCharge" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">本次里程數（充電前）</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="tripAfterCharge" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="tripAfterCharge" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">前次里程數（充電後）</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="endChargeTime" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="endChargeTime" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">結束充電時間</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="chargeUsage" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="chargeUsage" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">充電度數</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="chargeEfficiency" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="chargeEfficiency" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">充電效率（度／分）</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="daytimeCharge" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="daytimeCharge" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">白天充電</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="warningRecord" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="warningRecord" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">充電異常註記</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="driver" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="driver" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">駕駛員</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="busCompany" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="busCompany" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">客運別</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="stationName" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="stationName" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">站點名稱</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="chargeGunName" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="chargeGunName" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">充電槍名稱</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="eqCatagory" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="eqCatagory" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">設備類型</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="usage" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="usage" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">度數</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input id="chargeTime" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="chargeTime" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">充電時間</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="mode" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="mode" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">模式</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="billing" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="billing" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">計費方式</label>
                            </div>
                            <div class="flex items-center mb-4">
                                <input disabled id="rate" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="rate" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">費率</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto mb-4 text-center text-gray-700 font-semibold select-none">
                    <div class="p-2 rounded-md border border-gray-700 border-lg cursor-pointer hover:opacity-80 hover:bg-green-100 duration-200 shadow-md shadow-gray-200" @click="getReport()">
                        確定
                    </div>
                </div>
                <div class="max-w-7xl mx-auto text-center text-gray-700 font-semibold select-none">
                    <table class="w-full table-auto text-sm">
                        <thead>
                            <th class="px-2 cursor-pointer">ID</th>
                            <th class="px-2 cursor-pointer" @click="sort('車牌號碼')">車牌號碼</th>
                            <th class="px-2 cursor-pointer" @click="sort('開始充電電量')">起始電量</th>
                            <th class="px-2 cursor-pointer" @click="sort('結束充電電量')">終止電量</th>
                            <th class="px-2 cursor-pointer" @click="sort('開始充電時間')">起始時間</th>
                            <th class="px-2 cursor-pointer" @click="sort('結束充電電量')">終止時間</th>
                            <th class="px-2 cursor-pointer" @click="sort('充電效率(度/分)')">充電效率</th>
                            <th class="px-2 cursor-pointer" @click="sort('充電耗時')">花費時間</th>
                        </thead>
                        <tbody class="text-sm">
                            <tr v-for="(eachCharge, idx) in data.recordset" :id="idx" class="hover:bg-red-200 cursor-pointer">
                                <td class="py-2 px-4">
                                    {{ idx+1 }}
                                </td>
                                <td class="py-2 px-4">
                                    {{ eachCharge[Object.keys(data.recordset[0])[0]] }}
                                </td>
                                <td class="py-2 px-4">
                                    {{ eachCharge[Object.keys(data.recordset[0])[1]] }}
                                </td>
                                <td class="py-2 px-4">
                                    {{ eachCharge[Object.keys(data.recordset[0])[2]] }}
                                </td>
                                <td class="py-2 px-4">
                                    {{ new Date(eachCharge[Object.keys(data.recordset[0])[3]]).toISOString().split('T')[0] + " " + new Date(eachCharge[Object.keys(data.recordset[0])[3]]).toISOString().split('T')[1].split(".")[0] }}
                                </td>
                                <td class="py-2 px-4">
                                    {{ new Date(eachCharge[Object.keys(data.recordset[0])[4]]).toISOString().split('T')[0] + " " + new Date(eachCharge[Object.keys(data.recordset[0])[4]]).toISOString().split('T')[1].split(".")[0] }}
                                </td>
                                <td class="py-2 px-4">
                                    {{ (eachCharge["充電效率(度/分)"]).toFixed(2) }} 度/分
                                </td>
                                <td class="py-2 px-4">
                                    {{ Math.round(eachCharge["充電耗時"]/60) }} 小時 {{ Math.round(eachCharge["充電耗時"]%60) }} 分鐘
                                </td>
                            </tr>
                        </tbody>
                    </table>  

                </div>
            </div>
        </ClientOnly>
    </div>
</template>
<script setup>
const reportData = reactive({
    "start": {"isValid":false, "date":""},
    "end":   {"isValid":false, "date":""}
})
const tableHeader = reactive([])
const isValidDate = (dt) => {
    console.log(dt.target.id)
    console.log(dt.target.value)

    if(dt.target.id == "startDate"){
        if(new Date(dt.target.value) != "Invalid Date"){
            reportData.start.isValid = true
            reportData.start.date = dt.target.value
        }
        else{
            reportData.start.isValid = false
        }
        console.log('start', reportData)
    }
    else if(dt.target.id == "endDate"){
        if(new Date(dt.target.value) != "Invalid Date"){
            reportData.end.isValid = true
            reportData.end.date = dt.target.value
            console.log('dt', dt.target.value)
        }
        else{
            reportData.end.isValid = false
            console.log('false')
        }
        console.log('end', reportData)
    }
    if(reportData.start.isValid && reportData.end.isValid){
        getReport()
    }
}

const { pending, data: data } = await useAsyncData('reportData', () => $fetch('/api/report', {method: "POST", query:{"startDate":reportData.start.date, "endDate":reportData.end.date}}),{
    default: () => {},
},
    {watch: [reportData.start.date, reportData.end.date]}
)
const getReport = async () => {
    refreshNuxtData('reportData')
}
const sort = (item) =>{
    console.log("data")
    console.log(data)
    for(let i=0;i<data._value.recordset.length-1;i++){
        for(let j=i+1;j<data._value.recordset.length;j++){
            if( Number(data._value.recordset[i][item]) > Number(data._value.recordset[j][item]) || new Date(data._value.recordset[i][item]) > new Date(data._value.recordset[j][item]) ){
                let temp = data._value.recordset[i]
                data._value.recordset[i] = data._value.recordset[j]
                data._value.recordset[j] = temp
            }
        }
    }
    console.log(data)
}
console.log(data)
</script>