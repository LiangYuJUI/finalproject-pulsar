<template>
    <div class="bg-slate-50 grow shadow-lg" @keydown="parkingSpaceKeyup" tabindex="0">
        <!-- <ClientOnly> -->
        <div class="w-full max-w-7xl aspect-[3/1] mx-auto my-2 rounded shadow-lg">
            <svg class="svg-container font-mono">
                <g>
                    <image class="transition duration-150"
                        href="/images/icon/building.png" x="0%" y="15%" height="20%" width="9%" />
                    <image class="transition duration-150"
                        href="/images/icon/toilet.png" x="0%" y="45%" height="20%" width="9%" />
                </g>
                <rect 
                    v-for="(parking, idx) in parkingSpaces"
                    :key="idx"
                    :x="parking.rect.x + '%'"
                    :y="parking.rect.y + '%'"
                    rx="0.3%"
                    ry="0.3%"
                    :width="parking.rect.width + '%'"
                    :height="parking.rect.height + '%'"
                    :transform="`rotate(${parking.rect.rotate})`"
                    :id="idx"
                    :class="['parking cursor-pointer hover:opacity-50 transition duration-150 drop-shadow-sm', parking.data.chargingpilestatus]"
                    @click="parkingSpaceClick"
                >
                </rect>
                <rect v-for="(parking, idx) in parkingSpaces"
                    v-show="parking.data.chargingpilestatus == 'charging'"
                    :key="idx"
                    :x="parking.rect.x + '%'"
                    :y="parking.rect.y + '%'"
                    rx="0.3%"
                    ry="0.3%"
                    :width="parking.rect.width + '%'" :height="parking.rect.height * (1 - parking.data.soc / 100) + '%'"
                    :transform="`rotate(${parking.rect.rotate})`"
                    :id="idx"
                    class="parking cursor-pointer pointer-events-none hover:opacity-20 transition duration-150 chargingbg"
                >
                </rect>
                <text v-for="(parking, idx) in parkingSpaces" 
                    :key="idx"
                    :x="parking.rect.x + '%'" 
                    :y="parking.rect.y + '%'" 
                    :transform="`rotate(${parking.rect.rotate})`" 
                    font-size="75%"
                    class="select-none cursor-pointer font-black"
                >
                    {{ parking.data.charger_name }}
                </text>
                <text v-for="(parking, idx) in parkingSpaces" 
                    :key="idx" 
                    :x="parking.rect.x + 1.65 + '%'"
                    :y="parking.rect.y + 1.5 + '%'" 
                    :transform="`rotate(${parking.rect.rotate})`"
                    font-size="100%"
                    class="select-none cursor-pointer pointer-events-none font-black"
                    style="writing-mode: vertical-lr;"
                >
                    {{ parking.data.license_plate }}
                </text>
                <text v-for="(parking, idx) in parkingSpaces"
                    :key="idx"
                    :x="parking.rect.x + 1 + '%'"
                    :y="parking.rect.y + 21.5 + '%'"
                    :transform="`rotate(${parking.rect.rotate})`"
                    font-size="80%"
                    class="select-none cursor-pointer pointer-events-none font-black"
                    :style="{fill:`hsl(${180-(Number(parking.data.current).toFixed(0))}, 100%, 25%)`}"
                >
                    {{ `${Number(parking.data.current).toFixed(0) > 0 ? Number(parking.data.current).toFixed(0).padStart(3, "&nbsp;")+"A" : "" }` }}
                </text>
                <text v-for="(parking, idx) in parkingSpaces" 
                    :key="idx" 
                    :x="parking.rect.x + 1.2 + '%'"
                    :y="parking.rect.y + 24.5 + '%'"
                    :transform="`rotate(${parking.rect.rotate})`"
                    font-size="100%"
                    class="select-none cursor-pointer font-bold pointer-events-none font-black"
                    :style="{fill:`hsl(${1.3*(Number(parking.data.soc))}, 100%, 25%)`}"
                >
                    {{ `${parking.data.soc ? parking.data.soc+"%" : "" }` }}
                </text>                    
                <g class="font-black">
                    <rect x="92.5%" y="55%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking transition charging"></rect>
                    <rect x="92.5%" y="55%" rx="0.2%" ry="0.2%" width="1%" height="2%"
                        class="parking transition chargingbg"></rect>
                    <text x="94%" y="58.5%" font-size="90%" class="select-none">充電</text>
                    <rect x="92.5%" y="61%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking transition finishing"></rect>
                    <text x="94%" y="64.5%" font-size="90%" class="select-none">完成</text>
                    <rect x="92.5%" y="67%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking transition preparing"></rect>
                    <text x="94%" y="70.5%" font-size="90%" class="select-none">準備</text>
                    <rect x="92.5%" y="73%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking transition error"></rect>
                    <text x="94%" y="76.5%" font-size="90%" class="select-none">故障</text>
                    <rect x="92.5%" y="79%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking transition disabled"></rect>
                    <text x="94%" y="82.5%" font-size="90%" class="select-none">禁用</text>
                    <rect x="92.5%" y="85%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking transition available"></rect>
                    <text x="94%" y="88.5%" font-size="90%" class="select-none">待命</text>
                    <rect x="92.5%" y="91%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking transition offline"></rect>
                    <text x="94%" y="94.5%" font-size="90%" class="select-none">斷線</text>
                </g>
            </svg>
            <div class="flex flex-col">
                <div class="flex flex-row font-mono text-xl px-6">
                    <div class="w-1/6">
                        <div>
                            <div @click="stopAll" class="px-6 py-1 my-2 rounded border bg-red-200/50 text-red-600 text-center border-red-300 hover:opacity-80 cursor-pointer shadow-md transition">全樁停充</div>
                            <div @click="setAllPileCurrent(60)" class="px-6 py-1 my-2 rounded border bg-yellow-200/50 text-yellow-600 text-center border-yellow-300 hover:opacity-80 cursor-pointer shadow-md transition">全樁60A</div>
                            <div @click="setAllPileCurrent(20)" class="px-6 py-1 my-2 rounded border bg-blue-200/50 text-blue-600 text-center border-blue-300 hover:opacity-80 cursor-pointer shadow-md transition">全樁20A</div>
                            
                        </div>
                    </div>
                    <DayNightSwitch class="p-6 w-1/6" :isAuto="isAuto" @toggle-auto="toggleAuto" @click.stop="() => { }" />
                    <div class="p-6 w-full mx-auto">
                        <label for="kwRange" class="mb-2 inline-block text-neutral-700 font-black">Real-Time Power {{ new Intl.NumberFormat('en-US').format( ( kwRangeValue ) ) }} / {{ new Intl.NumberFormat('en-US').format(1620) }} kW </label>
                        <label class="text-xs text-black/50">　　<sup class="text-red-500">*</sup>本功率資訊來自場域電箱電錶量測</label>
                        <div class="relative text-left hover:opacity-80 transition">
                            <div ref="kwContainer" @mousemove="kwMouse" @mouseenter="kwMouseShow=true" @mouseout="kwMouseShow=false" @mouseleave="kwMouseShow=false" class="h-[36px] bg-gradient-to-r from-green-300 via-yellow-300 to-red-500 absolute top-0 left-0 rounded shadow-md" :style="{ width: leftBarWidth }"></div>
                            <div v-show="kwMouseShow" class="h-[0px] absolute top-0 right-0.5 z-10 whitespace-nowrap pointer-events-none" :style="{width:(100-kwMouseXPercentage)+'%'}">
                                <div class="table-cell align-bottom h-[36px] pl-1 border-l-2 border-black/80 text-xs text-black font-black select-none">
                                    {{ `${ (parseInt(kwMouseXPercentage*10)/10).toFixed(1) }% (${ new Intl.NumberFormat('en-US').format( parseInt(kwMouseXPercentage*16.2) )})kW` }}
                                </div>
                            </div>
                            <div class="h-[36px] bg-white/80 absolute top-0 right-0 transition-all pointer-events-none" :style="{ width: rightBarWidth }"></div>
                            <div class="h-[0px] bg-white/80 absolute top-0 right-0 transition-all pointer-events-none" :style="{ width: rightBarWidth }"><div class="table-cell align-bottom h-[54px] bottom-0 px-1 border-l border-black/80 text-xs font-black select-none">{{ `${(kwRangeValue*100/1620).toFixed(1)}% (${new Intl.NumberFormat('en-US').format( ( kwRangeValue ))} kW)` }}</div></div>
                            <div class="h-[0px] absolute top-0 right-0 w-1/5 pointer-events-none"><div class="table-cell align-bottom h-[36px] px-1 border-l-2 border-red-900 text-xs text-red-900 opacity-50 select-none">80%</div></div>
                            <div class="h-[0px] absolute top-0 right-0 w-2/5 pointer-events-none"><div class="table-cell align-bottom h-[36px] px-1 border-l-2 border-orange-900 text-xs text-orange-900 opacity-50 select-none">60%</div></div>
                            <div class="h-[0px] absolute top-0 right-0 w-3/5 pointer-events-none"><div class="table-cell align-bottom h-[36px] px-1 border-l-2 border-yellow-900 text-xs text-yellow-900 opacity-50 select-none">40%</div></div>
                            <div class="h-[0px] absolute top-0 right-0 w-4/5 pointer-events-none"><div class="table-cell align-bottom h-[36px] px-1 border-l-2 border-green-900 text-xs text-green-900 opacity-50 select-none">20%</div></div>
                            <div @hover.stop="() => { }" v-for="idx in 99" :key="idx" class="h-[0px] absolute top-0 right-0 pointer-events-none" :style="{ width:idx+'%' }">
                                <div class="border-l border-gray-700/80 opacity-50" :class="{hidden:(idx%20==0)}" :style="{ height: idx%10 ? 12+'px' : 24+'px' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="max-w-7xl mx-auto select-none my-6 rounded shadow-lg">
            <div class="w-full mx-auto">
                <div class="text-center py-6 rounded border-t border-b">
                    <label class="text-3xl font-black">充電樁表格資訊</label>
                </div>
                <div class="table w-full text-center font-mono">
                    <div class="table-header-group font-black">
                        <div class="table-row">
                            <div class="table-cell">名稱</div>
                            <div class="table-cell">狀態</div>
                            <div class="table-cell">車牌號碼</div>
                            <div class="table-cell">SOC</div>
                            <div class="table-cell">電壓</div>
                            <div class="table-cell">電流</div>
                            <div class="table-cell">功率</div>
                            <div class="table-cell">累計度數</div>
                            <div class="table-cell">充電時長</div>
                        </div>
                    </div>
                    <div class="table-row-group w-full mx-auto text-center">
                        <div v-for="(parking, idx) in parkingSpaces" :id="idx" :key="idx" :class="parking.data.chargingpilestatus" class="table-row cursor-pointer hover:brightness-110" @click="parkingSpaceClick" >
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4 py-0.5 select-none">{{ parking.data.charger_name }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ parking.data.chargingpilestatusc }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ parking.data.license_plate == undefined ? "" : parking.data.license_plate.padEnd(8, "&nbsp;") }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ `${parking.data.soc == undefined ? "" : String(parking.data.soc).padStart(3, "&nbsp;")+" %"}` }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ `${parking.data.status_code == 2 ? parking.data.voltage+" V" : "" }` }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ `${parking.data.status_code == 2 ? parking.data.current+" A" : "" } ` }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ `${parking.data.status_code == 2 ? new Intl.NumberFormat('en-US').format( String(Number(parking.data.voltage)*Number(parking.data.current)/1000 ))+" kW" : ""}`  }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ `${ ( parking.data.status_code == 2 || parking.data.status_code == 1 ) ? parking.data.charge_kwh+" 度" : ""}`  }}</div>
                            <div v-if="parking.data.status_code != 0" class="table-cell px-4">{{ `${ ( parking.data.status_code == 2 || parking.data.status_code == 1 ) ? String(parseInt(parking.data.charge_time/60/60)).padStart(2, "0") + ":" + String(parseInt(parking.data.charge_time/60)%60).padStart(2,"0") +":" + String(parseInt(parking.data.charge_time%60)).padStart(2, "0") : ""} `}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed w-full inset-0 bg-black/40 z-10 backdrop-blur-sm" v-show="tempParkingSpace.show" @click="closeInfoWindow" >
            <div class="bg-gray-100/90 rounded z-10 w-5/6 lg:w-3/5 xl:w-1/2 mx-auto mt-20 flex flex-row shadow-lg shadow-gray-700/50" @click.stop="() => { }">
                <!-- left button -->
                <div class="table p-4 text-white font-bold text-lg ease-in duration-150 rounded-l select-none cursor-pointer box-border bg-slate-950/30 hover:bg-slate-950/80" @click="nextParkingSpace(-1)"><div class="table-cell align-middle text-center">&#10094;</div></div>
                <!-- basic page -->
                <div class="w-full">
                    <div class="border-b border-black/20 dark:border-gray-700">
                        <ul class="flex flex-nowrap -mb-px text-sm font-medium text-center text-gray-500">
                            <li class="mr-2">
                                <a href="#" id="basic" @click="labelClick" :class="{ 'border-blue-600 text-blue-600 rounded-t-lg': labelFocus.basic }" class="inline-flex p-4 border-b-2 border-transparent hover:opacity-80">
                                    <svg aria-hidden="true" :class="{ 'text-blue-600': labelFocus.basic }" class="w-5 h-5 mr-2" style="pointer-events:none;" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                                    </svg>
                                    <p id="basic" class="hidden md:block">基本資訊</p>
                                </a>
                            </li>
                            <li class="mr-2">
                                <a href="#" id="pileHistory" @click="labelClick" :class="{ 'border-blue-600 text-blue-600 rounded-t-lg': labelFocus.pileHistory }" class="inline-flex p-4 border-b-2 border-transparent group hover:opacity-80" aria-current="page">
                                    <svg aria-hidden="true" :class="{ 'text-blue-600': labelFocus.pileHistory }" class="w-5 h-5 mr-2" style="pointer-events:none;" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    <div id="pileHistory" class="hidden md:block">充電樁歷史資訊</div>
                                </a>
                            </li>
                            <li class="mr-2">
                                <a href="#" id="vehicleHistory" @click="labelClick" :class="{ 'border-blue-600 text-blue-600 rounded-t-lg': labelFocus.vehicleHistory }" class="inline-flex p-4 border-b-2 border-transparent group hover:opacity-80">
                                    <svg aria-hidden="true" :class="{ 'text-blue-600': labelFocus.vehicleHistory }" class="w-5 h-5 mr-2" style="pointer-events:none;" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                                    </svg>
                                    <div id="vehicleHistory" class="hidden md:block">車輛歷史資訊</div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="main-block">
                        <div v-show="labelFocus.basic" class="flex flex-col h-full w-full text-center mx-auto font-mono text-xs md:text-md lg:text-lg">
                            <div class="grid grid-cols-2 border-b-2">
                                <div id="battery-chart"></div>
                                <div class="table">
                                    <div class="text-left table-cell align-middle">
                                        <div>ID</div>
                                        <div>編號</div>
                                        <div>狀態</div>
                                        <div>電壓</div>
                                        <div>電流</div>
                                        <div>電流設定</div>
                                        <div>功率</div>
                                        <div>充電時長</div>
                                        <div>累計度數</div>
                                        <div>車牌</div>
                                        <div>SOC</div>
                                    </div>
                                    <div class="text-left table-cell align-middle">
                                        <div class="hover:opacity-80">{{ tempParkingSpace.data.charger_id }}</div>
                                        <div class="hover:opacity-80">{{ tempParkingSpace.data.charger_name }}</div>
                                        <div class="hover:opacity-80">
                                            <span class="text-sm p-0.5 ant-tag" :class="tempParkingSpace.data.chargingpilestatus">
                                                {{ statusCodeToString(tempParkingSpace.data.status_code) }}
                                            </span>
                                        </div>
                                        <div class="hover:opacity-80">{{ `${ Number(tempParkingSpace.data.voltage)} V` }}</div>
                                        <div class="hover:opacity-80">{{ `${ Number(tempParkingSpace.data.current)} A` }}</div>
                                        <div class="hover:opacity-80">{{ `${ Number(tempParkingSpace.data?.current_target).toFixed(1)} A` }}</div>
                                        <div class="hover:opacity-80">{{ new Intl.NumberFormat('en-US').format( Number(tempParkingSpace.data.voltage)*Number(tempParkingSpace.data.current)/1000 ) }} kWh</div>
                                        <div class="hover:opacity-80">{{ `${ ( tempParkingSpace.data.status_code == 2 || tempParkingSpace.data.status_code == 1 ) ? String(parseInt(tempParkingSpace.data.charge_time/60/60)).padStart(2, "0") + ":" + String(parseInt(tempParkingSpace.data.charge_time/60)%60).padStart(2,"0") +":" + String(parseInt(tempParkingSpace.data.charge_time%60)).padStart(2, "0") : "?"} `}}</div>
                                        <div class="hover:opacity-80">{{ `${ Number(tempParkingSpace.data.charge_kwh)} 度`}}</div>
                                        <div class="hover:opacity-80">{{ tempParkingSpace.data.license_plate == undefined ? "?" : tempParkingSpace.data.license_plate }}</div>
                                        <div class="hover:opacity-80">{{ tempParkingSpace.data.soc == undefined ? "?" : tempParkingSpace.data.soc }} %</div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <div class="text-left my-6">
                                    <label class="text-md m-6">手動介入充電：</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 text-center">
                                        <div @click="setCurrent( tempParkingSpace.data.charger_id, tempParkingSpace.data.status_code, 60)" class="mx-6 p-2 text-2xl bg-green-200 border border-green-500 cursor-pointer rounded-md hover:opacity-80 shadow-md hover:shadow-green-500/30">60A</div>
                                        <div @click="setCurrent( tempParkingSpace.data.charger_id, tempParkingSpace.data.status_code, 90)" class="mx-6 p-2 text-2xl bg-yellow-200 border border-yellow-500 cursor-pointer rounded-md hover:opacity-80 shadow-md hover:shadow-yellow-500/30">90A</div>
                                        <div @click="setCurrent( tempParkingSpace.data.charger_id, tempParkingSpace.data.status_code, 120)" class="mx-6 p-2 text-2xl bg-orange-200 border border-orange-500 cursor-pointer rounded-md hover:opacity-80 shadow-md hover:shadow-orange-500/30">120A</div>
                                        <div @click="setCurrent( tempParkingSpace.data.charger_id, tempParkingSpace.data.status_code, 180)" class="mx-6 p-2 text-2xl bg-red-200 border border-red-500 cursor-pointer rounded-md hover:opacity-80 shadow-md hover:shadow-red-500/30">180A</div>                                         
                                    </div>
                                </div>
                                <div class="flex-none">
                                    <div class="flex flex-row px-6 mb-6">
                                        <div @click="setPileStopCharge( tempParkingSpace.data.charger_id, tempParkingSpace.data.status_code )" class="w-full p-2 border bg-red-300/60 border-red-500 text-red-700 text-2xl rounded-md cursor-pointer shadow-md hover:shadow-red-500/30 hover:opacity-80 transition">
                                            停止充電
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pile-block">
                        <div v-show="labelFocus.pileHistory" class="flex flex-col h-full w-full text-center mx-auto font-mono text-xs md:text-md lg:text-lg">
                            {{ tempParkingSpace.data.charger_id }}
                            <div class="table w-full border-b-4">
                                <div class="table-header-group">
                                    <div class="table-row">
                                        <div class="table-cell">車牌號碼</div>
                                        <div class="table-cell">起始時間</div>
                                        <div class="table-cell">結束時間</div>
                                        <div class="table-cell">起始SOC</div>
                                        <div class="table-cell">結束SOC</div>
                                        <div class="table-cell">充電效率</div>
                                    </div>
                                </div>
                                <div class="table-row-group">
                                    <div v-for="eachData in pileHistory.data" class="table-row text-center font-mono">
                                        <div class="table-cell align-middle">{{ eachData.license_plate }}</div>
                                        <div class="table-cell align-middle">{{ dateFormatter(eachData.startTime) }}</div>
                                        <div class="table-cell align-middle">{{ dateFormatter(eachData.endTime) }}</div>
                                        <div class="table-cell align-middle">{{ eachData.min_SOC }}</div>
                                        <div class="table-cell align-middle">{{ eachData.max_SOC }}</div>
                                        <div class="table-cell align-middle">{{ Number((eachData.max_SOC - eachData.min_SOC)*60/(eachData.charge_time)).toFixed(2) }} %/m</div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="vehicle-block">
                        <div v-show="labelFocus.vehicleHistory" class="flex flex-col h-full w-full text-center mx-auto font-mono text-xs md:text-md lg:text-lg">
                            {{ tempParkingSpace.data.license_plate }}
                            <div class="table w-full border-b-4 overflow-auto">
                                <div class="table-header-group">
                                    <div class="table-row">
                                        <div class="table-cell">樁編號</div>
                                        <div class="table-cell">起始時間</div>
                                        <div class="table-cell">結束時間</div>
                                        <div class="table-cell">起始SOC</div>
                                        <div class="table-cell">結束SOC</div>
                                        <div class="table-cell">充電效率</div>
                                    </div>
                                </div>
                                <div class="table-row-group">
                                    <div v-for="eachData in vehicleHistory.data" class="table-row text-center font-mono">
                                        <div class="table-cell align-middle">{{ eachData.charger_id }}</div>
                                        <div class="table-cell align-middle">{{ dateFormatter(eachData.startTime) }}</div>
                                        <div class="table-cell align-middle">{{ dateFormatter(eachData.endTime) }}</div>
                                        <div class="table-cell align-middle">{{ eachData.min_SOC }}</div>
                                        <div class="table-cell align-middle">{{ eachData.max_SOC }}</div>
                                        <div class="table-cell align-middle">{{ Number((eachData.max_SOC - eachData.min_SOC)*60/(eachData.charge_time)).toFixed(2) }} %/m</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- right button -->
                <div class="table p-4 text-white font-bold text-lg ease-in duration-150 rounded-r select-none cursor-pointer box-border bg-slate-950/30 hover:bg-slate-950/80" @click="nextParkingSpace(1)"><div class="table-cell align-middle text-center">&#10095;</div></div>
            </div>
            <div class="w-full mx-auto my-6">
                <div class="mx-auto flex flex-row">
                    <nuxt-img src="/images/NeoPowerENLogo.png" class="ml-auto mr-6 opacity-80" width="168"/>
                    <nuxt-img src="/images/gochabar_logo.png" class="mr-auto ml-6 opacity-80" width="168"/>
                </div>
                <div class="w-60 sm:w-3/5 md:w-2/5 mx-auto flex flex-row mt-3 mx-6 p-2 border rounded-lg shadow-lg select-none cursor-pointer hover:brightness-150 transition duration-1000">
                    <p class="mx-auto text-white">左鍵點擊空白處關閉視窗</p>
                </div>
            </div>
        </div>
        <!-- </ClientOnly> -->
        <div :class="transitionClass">
            <ResultDialog @click="isResult=false" v-show="isResult" :msg="isResultMsg" :status="isResultStatus"/>
            <PendingDialog v-show="isPending" :msg="isPendingMsg" />
        </div>
    </div>
</template>
<script setup>
import DayNightSwitch from '@/components/button/DayNightSwitch'

import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
useSeoMeta( { title: '新動智能巴士智慧監控系統' } )

const headers = useRequestHeaders(['cookie']);
try{
    const isAuth = await $fetch("/api/user/auth", { headers: headers,  method: "POST", body: {role: "viewer"} })
}
catch( error ){
    if( error.statusCode == 401 || error.statusCode == 403 ){
        await navigateTo({ path: '/login' });
    }
}

// -- Dialog -- 
const isResult = ref(false);
const isResultMsg = ref("OK");
const isResultStatus = ref("");
const isPending = ref(false);
const isPendingMsg = ref("Processing...");
const transitionClass = ref("opacity-100");

const showPendingDialog = (msg="Process") => {
    isPendingMsg.value = msg;
    isPending.value = true;
}
const showResultDialog = (msg="OK", status="") => {
    isResultMsg.value = msg;
    isResultStatus.value = status;
    isPending.value = false;
    isResult.value = true;
    isPendingMsg.value = "Processing...";
    setTimeout( function(){transitionClass.value="opacity-90"}, 1820);
    setTimeout( function(){transitionClass.value="opacity-80"}, 1840);
    setTimeout( function(){transitionClass.value="opacity-70"}, 1860);
    setTimeout( function(){transitionClass.value="opacity-60"}, 1880);
    setTimeout( function(){transitionClass.value="opacity-50"}, 1900);
    setTimeout( function(){transitionClass.value="opacity-40"}, 1920);
    setTimeout( function(){transitionClass.value="opacity-30"}, 1940);
    setTimeout( function(){transitionClass.value="opacity-20"}, 1960);
    setTimeout( function(){transitionClass.value="opacity-10"}, 1980);
    setTimeout( function(){transitionClass.value="opacity-100"; isResult.value=false;}, 2000 );

}
// -- Config -- 
const config = $fetch('/api/v2/config');

const kwMouseShow = ref(false);
const kwContainer = ref(null);
const kwMouseX = ref(0);
const kwMouseXPercentage = ref(0);
const kwMouse = (event) => {
    kwMouseX.value = event.clientX - kwContainer.value.getBoundingClientRect().left;
    if(kwContainer.value) {
        const kwContainerWidth = kwContainer.value.clientWidth;
        kwMouseXPercentage.value = ((parseInt(kwMouseX.value+1) / kwContainerWidth)*100).toFixed(2);
        // console.log(event.clientX, kwContainer.value.clientWidth)
        // console.log(kwMouseX.value, kwContainerWidth)
    }
}
const isAuto = ref(await $fetch('/api/v2/charging/smartCharging?status=true', {"method":"POST"}));

const toggleAuto = async () => {
    showPendingDialog("調整各樁功率上限...");
    // console.log("--  toggleAuto", isAuto.value)
    const result = await $fetch('/api/v2/charging/smartCharging', {"method":"POST", "body":{"on":!isAuto.value}});
    showPendingDialog("開啟自動充電...");
    isAuto.value = await $fetch('/api/v2/charging/smartCharging?status=true', {"method":"POST"})
    showResultDialog("OK");
    // alert(`自動模式${isAuto.value ? "啟動" : "關閉"}`)
};
const { pending: auto_status_p, data: auto_status } = await useAsyncData('auto_status', () => $fetch('/api/v2/charging/smartCharging?status=true', {"method":"POST"}))
watch(auto_status, (new_auto_status) => {
    // return format:
    // {
    //      "success" : true/false,
    //      "message" : true/false
    // }
    isAuto.value = new_auto_status.message;
})

const parkingSpaceConfig = { "width": 3.3, "height": 25, "firstRowY": 5, "secondRowY": 35, "thirdRowY": 70, "othersRowY": -80 }
let tempParkingSpace = reactive({ show: false, data: { charger_name: "0-0", charger_id: "", chargingpilestatus: "", current: 0, currentpower: 0, license_plate: "", soc: 0, chargingpilename: "" }})
// const orderParkingSpaceMapping = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 51, 19, 52, 20, 53, 21, 54, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 22, 45, 23, 46, 24, 47, 25, 48, 26, 49];
let parkingSpaces = reactive([
    { rect: { x: 10, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "6-1", charger_id: "CBAAA1LPH2180011_01", chargingpilestatus: '' } } ,
    { rect: { x: 13.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "7-1", charger_id: "CBAAA1LPH2180013_01", chargingpilestatus: '' } } ,
    { rect: { x: 17, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "8-1", charger_id: "CBAAA1LPH2180015_01", chargingpilestatus: '' } } ,
    { rect: { x: 20.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "9-1", charger_id: "CBAAA1LPH2180017_01", chargingpilestatus: '' } } ,
    { rect: { x: 24, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "10-1", charger_id: "CBAAA1LPH2180019_01", chargingpilestatus: '' } } ,
    { rect: { x: 27.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "11-1", charger_id: "CBAAA1LPH2180021_01", chargingpilestatus: '' } } ,
    { rect: { x: 31, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "12-1", charger_id: "CBAAA1LPH2180023_01", chargingpilestatus: '' } } ,
    { rect: { x: 34.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "13-1", charger_id: "CBAAA1LPH2180025_01", chargingpilestatus: '' } } ,
    { rect: { x: 38, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "14-1", charger_id: "CBAAA1LPH2180027_01", chargingpilestatus: '' } } ,
    { rect: { x: 41.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "15-1", charger_id: "CBAAA1LPH2180029_01", chargingpilestatus: '' } } ,
    { rect: { x: 45, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "16-1", charger_id: "CBAAA1LPH2180031_01", chargingpilestatus: '' } } ,
    { rect: { x: 48.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "17-1", charger_id: "CBAAA1LPH2180033_01", chargingpilestatus: '' } } ,
    { rect: { x: 52, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "18-1", charger_id: "CBAAA1LPH2180035_01", chargingpilestatus: '' } } ,
    { rect: { x: 55.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "19-1", charger_id: "CBAAA1LPH2180037_01", chargingpilestatus: '' } } ,
    { rect: { x: 59, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "20-1", charger_id: "CBAAA1LPH2180039_01", chargingpilestatus: '' } } ,
    { rect: { x: 62.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "21-1", charger_id: "CBAAA1LPH2180041_01", chargingpilestatus: '' } } ,
    { rect: { x: 66, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "22-1", charger_id: "CBAAA1LPH2180043_01", chargingpilestatus: '' } } ,
    { rect: { x: 69.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "23-1", charger_id: "CBAAA1LPH2180045_01", chargingpilestatus: '' } } ,
    { rect: { x: 73, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "23-2", charger_id: "CBAAA1LPH2180046_01", chargingpilestatus: '' } } ,
    { rect: { x: 76.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "24-1", charger_id: "CBAAA1LPH2180047_01", chargingpilestatus: '' } } ,
    { rect: { x: 80, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "24-2", charger_id: "CBAAA1LPH2180048_01", chargingpilestatus: '' } } ,
    { rect: { x: 83.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "25-1", charger_id: "CBAAA1LPH2180049_01", chargingpilestatus: '' } } ,
    { rect: { x: 87, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "25-2", charger_id: "CBAAA1LPH2180050_01", chargingpilestatus: '' } } ,
    { rect: { x: 90.5, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "26-1", charger_id: "CBAAA1LPH2180051_01", chargingpilestatus: '' } } ,
    { rect: { x: 94, y: parkingSpaceConfig.firstRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "26-2", charger_id: "CBAAA1LPH2180052_01", chargingpilestatus: '' } } ,
    { rect: { x: 10, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "6-2", charger_id: "CBAAA1LPH2180012_01", chargingpilestatus: '' } } ,
    { rect: { x: 13.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "7-2", charger_id: "CBAAA1LPH2180014_01", chargingpilestatus: '' } } ,
    { rect: { x: 17, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "8-2", charger_id: "CBAAA1LPH2180016_01", chargingpilestatus: '' } } ,
    { rect: { x: 20.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "9-2", charger_id: "CBAAA1LPH2180018_01", chargingpilestatus: '' } } ,
    { rect: { x: 24, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "10-2", charger_id: "CBAAA1LPH2180020_01", chargingpilestatus: '' } } ,
    { rect: { x: 27.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "11-2", charger_id: "CBAAA1LPH2180022_01", chargingpilestatus: '' } } ,
    { rect: { x: 31, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "12-2", charger_id: "CBAAA1LPH2180024_01", chargingpilestatus: '' } } ,
    { rect: { x: 34.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "13-2", charger_id: "CBAAA1LPH2180026_01", chargingpilestatus: '' } } ,
    { rect: { x: 38, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "14-2", charger_id: "CBAAA1LPH2180028_01", chargingpilestatus: '' } } ,
    { rect: { x: 41.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "15-2", charger_id: "CBAAA1LPH2180030_01", chargingpilestatus: '' } } ,
    { rect: { x: 45, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "16-2", charger_id: "CBAAA1LPH2180032_01", chargingpilestatus: '' } } ,
    { rect: { x: 48.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "17-2", charger_id: "CBAAA1LPH2180034_01", chargingpilestatus: '' } } ,
    { rect: { x: 52, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "18-2", charger_id: "CBAAA1LPH2180036_01", chargingpilestatus: '' } } ,
    { rect: { x: 55.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "19-2", charger_id: "CBAAA1LPH2180038_01", chargingpilestatus: '' } } ,
    { rect: { x: 59, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "20-2", charger_id: "CBAAA1LPH2180040_01", chargingpilestatus: '' } } ,
    { rect: { x: 62.5, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "21-2", charger_id: "CBAAA1LPH2180042_01", chargingpilestatus: '' } } ,
    { rect: { x: 66, y: parkingSpaceConfig.secondRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "22-2", charger_id: "CBAAA1LPH2180044_01", chargingpilestatus: '' } } ,
    { rect: { x: 10, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "1-2", charger_id: "CBAAA1LPH21B0002_01", chargingpilestatus: '' } } ,
    { rect: { x: 13.5, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "1-1", charger_id: "CBAAA1LPH21B0001_01", chargingpilestatus: '' } } ,
    { rect: { x: 17, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "2-2", charger_id: "CBAAA1LPH21B0004_01", chargingpilestatus: '' } } ,
    { rect: { x: 20.5, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "2-1", charger_id: "CBAAA1LPH21B0003_01", chargingpilestatus: '' } } ,
    { rect: { x: 24, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "3-2", charger_id: "CBAAA1LPH21B0006_01", chargingpilestatus: '' } } ,
    { rect: { x: 27.5, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "3-1", charger_id: "CBAAA1LPH21B0005_01", chargingpilestatus: '' } } ,
    { rect: { x: 31, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "4-2", charger_id: "CBAAA1LPH21B0007_01", chargingpilestatus: '' } } ,
    { rect: { x: 34.5, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "4-1", charger_id: "CBAAA1LPH21B0008_01", chargingpilestatus: '' } } ,
    { rect: { x: 38, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "5-2", charger_id: "CBAAA1LPH21B0010_01", chargingpilestatus: '' } } ,
    { rect: { x: 41.5, y: parkingSpaceConfig.thirdRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 0 }, data:{ charger_name: "5-1", charger_id: "CBAAA1LPH21B0009_01", chargingpilestatus: '' } } ,
    { rect: { x: 75, y: parkingSpaceConfig.othersRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 30 }, data:{ charger_name: "27-1", charger_id: "CBAAA1LPH2180053_01", chargingpilestatus: '' } } ,
    { rect: { x: 78.5, y: parkingSpaceConfig.othersRowY, width: parkingSpaceConfig.width, height: parkingSpaceConfig.height, rotate: 30 }, data:{ charger_name: "27-2", charger_id: "CBAAA1LPH2180054_01", chargingpilestatus: '' } } ,
]);
const kwRangeValue = ref(0);
const leftBarWidth = computed(() => {
//   return `${(currentRangeValue.value / 180) * 100}%`;
  return `100%`
});
const rightBarWidth = computed(() => {
  return `${100 - (kwRangeValue.value / 1620) * 100}%`;
});
const labelFocus = reactive({ "basic": true, "pileHistory": false, "vehicleHistory": false, "setting": false });

const parkingSpaceClick = async (event) => {
    // console.log(event.currentTarget.id);
    tempParkingSpace.data = parkingSpaces[event.currentTarget.id].data;
    tempParkingSpace.show = true;
    batteryLevel.value = NaN;
    plateNumberText.value = "";
    if(tempParkingSpace.data.chargingpilestatus == "charging" || tempParkingSpace.data.chargingpilestatus == "finishing"){
        batteryLevel.value = tempParkingSpace.data.soc == undefined ? NaN : tempParkingSpace.data.soc;
        plateNumberText.value = tempParkingSpace.data.license_plate == undefined ? `???-????` : tempParkingSpace.data.license_plate;
    }
    updateBatteryChart();
    // await pileHistoryClick( { "query":{"charger_id":tempParkingSpace.data.charger_id}, "page":0 } );
    // await vehicleHistoryClick( { "query":{"plateNumber":tempParkingSpace.data.licensePlate}, "page":0 } );
}
const parkingSpaceKeyup = (event) => {
    console.log(event);
    if(event.keyCode == 27){
        // press esc to close info window
        tempParkingSpace.show = false;
    }
}
const setCurrent = async (charger_id, status_code, current) => {
    isPending.value = true;
    if(status_code == 2){
        // pile is charging
        let url = '/api/v2/charging/set/current';
        if(isAuto.value){
            url = '/api/v2/charging/smartCharging';
        }
        try{
            const result = await $fetch(url, {
                method:"POST",
                body:{ charger_id: charger_id, current: current }
            });
            if(result.success){
                showResultDialog(`${charger_id} ${current}A. OK!`)
            }
            else{
                showResultDialog(`${charger_id} ${current}A. Fail`, "error")
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    else if(status_code == 1){
        // send start charging command
        const result = await start_charge(charger_id);
        if(result.success){
            if(result.message.rescode == "0000"){
                // set current after 45 sec.
                setTimeout(function() {
                    setCurrent(charger_id, 2, current);
                }, 45000);
            }
            else{
                showResultDialog(`錯誤，無法啟動充電\n錯誤代碼 ${result.message.rescode}\n錯誤說明 ${result.message.resmsg}`, "error");
            }
        }
        else{
            showResultDialog(`錯誤，無法啟動充電\n錯誤說明 ${result.message}`, "error");
        }
    }
    else{
        showResultDialog("狀態非「準備」及「充電」，無法啟動充電或設定電流", "error");
    }
}
const stopAll = async () => {
    showPendingDialog("傳送停止命令中...")
    const chargingData = parkingSpaces.filter( (d) => d.data.status_code == 2)
    if (!chargingData.length) {
        showResultDialog("沒有充電中的車輛", "error");
        return ;
    }
    return Promise.all( chargingData.map(
        async (eachPile) => {
            return $fetch("/api/v2/charging/stop", {method: "POST", body:{ charger_id: eachPile.data.charger_id } } )
        }
    ))
    .then( requestResults => {
        showResultDialog("200 OK");
        return { success: true, message: requestResults};
    })
    .catch( error => {
        showResultDialog(error, "error");
        return { success: false, message: err };
    })
}
const setAllPileCurrent = async (current) => {
    isPending.value = true;
    const chargingData = parkingSpaces.filter( (d) => d.data.status_code == 2);
    if (!chargingData.length) {
        showResultDialog("沒有充電中的車輛", "error");
        return ;
    }
    if (chargingData.length * Number(current) > Number(config.kw_limit*1.5) ){
        // 60kW ~= 90A, 1620kW ~= 2430A -> 1620*1.5 = A_limit
        current = Number(config.kw_limit) * 1.5 / chargingData.length;
    }
    return Promise.all( chargingData.map(
        (eachPile) => {
            return $fetch("/api/v2/charging/set/current", {method: "POST", body: { charger_id: eachPile.data.charger_id, current: current } } );
        }
    )).then( requestResults => {
        showResultDialog("200 OK");
        return { success: true, message: requestResults };
    }).catch( err => {
        showResultDialog(err, "error");
        return { success: false, message: err };
    })
}
const labelClick = (event) => {
    Object.keys(labelFocus).map(el => { labelFocus[el] = false })
    labelFocus[event.target.id] = true;
    // console.log(event.target.id)
    switch(event.target.id){
        case "basic":
            updateBatteryChart();
            break;
        case "pileHistory":
            pileHistoryClick( { "query":{"charger_id":tempParkingSpace.data.charger_id}, "page":0 } );
            break;
        case "vehicleHistory":
            vehicleHistoryClick( { "query":{"plateNumber":tempParkingSpace.data.license_plate}, "page":0 } );
    }
}
const nextParkingSpace = (number) => {
    for(let i=0;i<parkingSpaces.length;i++){
        if(tempParkingSpace.data.charger_id == parkingSpaces[i].data.charger_id){
            parkingSpaceClick({"currentTarget":{"id": (parkingSpaces.length+i+number)%parkingSpaces.length}})
            break;
        }
    }
}
const pileHistory = reactive({data:[]})
const pileHistoryClick = async (query) => {
    // try{
    //     const data = await $fetch(`/api/v2/ms/pile/${query.query.charger_id}`);
    //     if(data.success){
    //         pileHistory.data = data.data.data;
    //     }
    // }
    // catch(error){
    //     console.error(error);
    // }
}

const vehicleHistory = reactive({data:[]})
const vehicleHistoryClick = async (query) => {
    // try{
    //     const data = await $fetch(`/api/v2/ms/vehicle/${query.query.plateNumber}`);
    //     if(data.success){
    //         vehicleHistory.data = data.data.data;
    //     }
    // }
    // catch(error){
    //     console.warn(error);
    // }
}

const closeInfoWindow = () => {
    tempParkingSpace.show = false;
    // set "basic" page to true, to show "basic" page
    Object.keys(labelFocus).map(el => el == "basic");
}

const { pending: power_p, data: power } = await useAsyncData('power', () => $fetch('/api/v2/station_status'), {
    default: () => {  }
})
watch(power, (new_power) => {
    kwRangeValue.value = new_power.data.power;
})

const { pending: evs_p, data: evs } = await useAsyncData('station_status', () => $fetch('/api/v2/station_status'), {
    default: () => { }
})

watch(evs, (new_evs) => {
    let real_time_power = 0;
    for (let i = 0; i < new_evs?.data.piles.length; i++) {
        switch (new_evs.data.piles[i].status_code) {
            case 0:
                new_evs.data.piles[i].chargingpilestatusc = '待命';
                new_evs.data.piles[i].chargingpilestatus = 'available';
                break;
            case 1:
                new_evs.data.piles[i].chargingpilestatusc = '準備';
                new_evs.data.piles[i].chargingpilestatus = 'preparing';
                break;
            case 2:
                new_evs.data.piles[i].chargingpilestatusc = '充電';
                new_evs.data.piles[i].chargingpilestatus = 'charging';
                break;
            case 3:
                new_evs.data.piles[i].chargingpilestatusc = '完成';
                new_evs.data.piles[i].chargingpilestatus = 'finishing';
                break;
            case 5:
                new_evs.data.piles[i].chargingpilestatusc = '禁用';
                new_evs.data.piles[i].chargingpilestatus = 'disabled';
                break;
            case 6:
                new_evs.data.piles[i].chargingpilestatusc = '故障';
                new_evs.data.piles[i].chargingpilestatus = 'error';
                break;
            case 7:
                new_evs.data.piles[i].chargingpilestatusc = '斷線';
                new_evs.data.piles[i].chargingpilestatus = 'offline';
                break;
            default:
                new_evs.data.piles[i].chargingpilestatusc = '未知';
                new_evs.data.piles[i].chargingpilestatus = 'unknown';
                break;
        }

        const {soc, license_plate, charge_kwh, charge_time, current_target, ...others} = new_evs.data.piles[i];
        Object.assign(parkingSpaces[i].data, others);
        // console.log(parkingSpaces[i].data);
        // real_time_power += parseInt(new_evs.data.piles[i].current) * parseInt(new_evs.data.piles[i].voltage[0]);

        if( new_evs.data.piles[i].status_code == 1 || new_evs.data.piles[i].status_code == 2 ){
            parkingSpaces[i].data.soc = soc;
            parkingSpaces[i].data.license_plate = license_plate;
            parkingSpaces[i].data.charge_kwh = charge_kwh;
            parkingSpaces[i].data.charge_time = charge_time;
            parkingSpaces[i].data.current_target = current_target;
        }
        else if ( new_evs.data.piles[i].status_code == 3){
            parkingSpaces[i].data.soc = soc;
            parkingSpaces[i].data.license_plate = license_plate;
        }
        else {
            parkingSpaces[i].data.soc = undefined;
            parkingSpaces[i].data.license_plate = undefined;
            parkingSpaces[i].data.charge_kwh = undefined;
            parkingSpaces[i].data.charge_time = undefined;
            parkingSpaces[i].data.current_target = undefined;
        }
        if(tempParkingSpace.data.charger_id == parkingSpaces[i].data.charger_id){
            if( batteryLevel.value != tempParkingSpace.data.soc || plateNumberText.value != tempParkingSpace.data.license_plate ){
                tempParkingSpace.data = parkingSpaces[i].data;            
                batteryLevel.value = tempParkingSpace.data.soc == undefined ? NaN : tempParkingSpace.data.soc;
                plateNumberText.value = tempParkingSpace.data.license_plate == undefined ? "" : tempParkingSpace.data.license_plate;
                updateBatteryChart();
            }
            tempParkingSpace.data = parkingSpaces[i].data;  
        }
    }
    // kwRangeValue.value = (real_time_power/1000).toFixed(0);
});




const update_data = () => {
    // check&update auto_mode on/off and pile&vehicle data every 5 sec.
    refreshNuxtData("power");
    refreshNuxtData("auto_status");
    refreshNuxtData("station_status");
    setTimeout(update_data, 5000);
}
update_data();

const start_charge = async (charger_id) => {
    return new Promise( async (resolve) => {
        const result = await $fetch('/api/v2/charging/start', {
            method: "POST",
            body: { charger_id: charger_id }
        });
        resolve(result);
    })
}
const stop_charge = async (charger_id) => {
    return new Promise( async (resolve) => {
        const result = await $fetch('/api/v2/charging/stop', {
            method:"POST", 
            body: { charger_id:charger_id }
        });
        resolve(result);
    })
}
const setPileStopCharge = async ( charger_id, status_code ) => {
    isPending.value = true;
    if(status_code == 2){
        const result = await stop_charge(charger_id);
        if( result.success ){
            showResultDialog(`已傳送停止指令`);
            // alert(`已傳送停止指令\n充電樁回應代碼：${result.message.retCode}\n充電樁回應訊息：${result.message.retMsg}\n充電樁回應資料：${result.message.retData}`);
            return ;
        }
        showResultDialog(`停止充電指令傳送失敗`, "error");
        // alert(`停止充電指令傳送失敗\n充電樁回應代碼：${result.message.retCode}\n充電樁回應訊息：${result.message.retMsg}\n充電樁回應資料：${result.message.retData}`);
        return ;
    }
    showResultDialog("該樁非充電中，無法停止充電", "error");
    return ;
}
const batteryLevel = ref(NaN);
const plateNumberText = ref("");
const updateBatteryChart = () => {
    const svg = d3.select('#battery-chart');
    const arc = d3.arc().innerRadius(70).outerRadius(80).cornerRadius(10);
    const path = svg.select('path');
    const batteryLevelText = svg.select('#labelSOC');
    const plateNumber = svg.select('#labelPlateNumber');
    const colorScale = d3
        .scaleLinear()
        .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
        .range(['#E02D00', '#E05A00' ,'#E08700' ,'#E0B400' ,'#E0E000' ,'#B4E000' ,'#87E000' ,'#5AE000' ,'#2DE000' ,'#00E000']);
    const pie = d3
        .pie()
        .value(d => d)
        .sort(null);
    const data = [batteryLevel.value, 100 - batteryLevel.value];
    const pieData = pie(data);
    path
        .data(pieData)
        .transition()
        .duration(500)
        .attrTween('d', d => {
            const interpolate = d3.interpolate(
                { startAngle: 0, endAngle: 0 },
                { startAngle: d.startAngle, endAngle: d.endAngle }
            );
            return t => arc(interpolate(t));
        })
        .attr('fill', (d, i) => (i === 0 ? colorScale(batteryLevel.value) : '#e0e0e0'));

    batteryLevelText.text(`${batteryLevel.value}%`);
    plateNumber.text(`${plateNumberText.value}`)
};
onMounted(() => {
    const svg = d3
        .select('#battery-chart')
        .append('svg')
        .attr('viewBox', '0 0 200 200')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.append('path').attr('transform', 'translate(100, 100)');
    svg
        .append('text')
        .attr('x', 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '24px')
        .style('cursor', 'pointer')
        .attr("id", function(d, i) { return "labelSOC"; });
    svg
        .append('text')
        .attr('x', 100)
        .attr('y', 120)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12x')
        .style('fill', '#888888')
        .style('cursor', 'pointer')
        .attr("id", function(d, i) { return "labelPlateNumber"; });
    updateBatteryChart();
    // updateParkingSpace();
});
</script>
<style scoped>
svg, text {
    filter: drop-shadow(1px 1px 0.2px rgb(88 88 88 / 0.15));
}
.svg-container {
    width: 100%;
    height: 100%;
}
input[type="range"]::-webkit-slider-thumb {
    position: relative;
    margin-top: 0px;              /* 會受到寬高影響定位，需微調 */
    background-color: white;
}
.ant-tag {
    border-radius: 4px;
    cursor: pointer;
    transition: all .15s ease-out;
}.ant-tag:hover {
    opacity:0.8;
}
.available {
    fill: rgba(0, 0, 0, 0.08);
    border: 1px solid rgb(217, 217, 217);
    background-color: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.88);
}
.finishing {
    fill: rgba(82, 196, 26, 0.5);
    border: 1px solid rgb(183, 235, 143);
    background-color: rgb(246, 255, 237);
    color: rgb(82, 196, 26);
}
.preparing {
    fill: rgba(22, 119, 255, 0.5);
    border: 1px solid rgb(145, 202, 255);
    background-color: rgb(230, 244, 255);
    color: rgb(22, 119, 255);
}
.chargingbg {
    fill: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background-color: rgb(230, 244, 255);
}
.charging {
    fill: rgba(211, 173, 247, 0.8);
    border: 1px solid rgb(211, 173, 247);
    background-color:rgba(249, 240, 255);
    color: rgb(83, 29, 171);
}
.error {
    fill: rgba(250, 173, 20, 0.5);
    border: 1px solid rgb(255, 229, 143);
    background-color: rgb(255, 251, 230);
    color: rgb(250, 173, 20);
}
.offline {
    fill: rgba(88, 88, 88, 0.88);
    border: 1px solid rgb(8, 8, 8);
    background-color: rgb(255, 255, 255);
    color: rgb(188, 188, 188);
}
.disabled {
    fill: rgba(255, 77, 79, 0.5);
    border: 1px solid rgb(255, 204, 199);
    background-color: rgb(255, 242, 240);
    color: rgb(255, 77, 79);
}
</style>