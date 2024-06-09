<template>
    <div class="bg-slate-50 flex-grow shadow-lg">
        {{ ev_data[0] }}
        <div class="w-full max-w-7xl aspect-[7/2] mx-auto my-2 rounded shadow-lg">
            <svg class="svg-container font-mono">
                <g>
                    <image class="cursor-pointer hover:opacity-80 transition duration-150"
                        href="~/public/images/icon/building.png" x="0%" y="15%" height="20%" width="9%" />
                    <image class="cursor-pointer hover:opacity-80 transition duration-150"
                        href="~/public/images/icon/toilet.png" x="0%" y="45%" height="20%" width="9%" />
                </g>
                <rect v-for="parking in ev_data" :key="parking.charger_name" :x="parking.rect.x + '%'" :y="parking.rect.y + '%'"
                    :id="parking.charger_name" rx="0.3%" ry="0.3%" :width="parking.rect.width + '%'" :height="parking.rect.height + '%'"
                    :transform="`rotate(${parking.rect.rotate})`"
                    :class="['parking cursor-pointer hover:opacity-50 transition duration-150 ', parking?.chargingpilestatus]"
                    @click="parkingSpaceClick">
                </rect>
                <rect v-for="parking in ev_data" :key="parking.charger_name" :x="parking.rect.x + '%'"
                    :y="parking.rect.y + '%'" :id="parking.charger_name" rx="0.3%" ry="0.3%"
                    :width="parking.rect.width + '%'" :height="parking.rect.height * (1 - parking.soc / 100) + '%'"
                    :transform="`rotate(${parking.rect.rotate})`"
                    :class="['parking cursor-pointer hover:opacity-20 transition duration-150 chargingbg']"
                    style="pointer-events:none;" v-show="parking.chargingpilestatus == 'charging'">
                </rect>
                <text v-for="parking in ev_data" :key="parking.charger_name" class="select-none cursor-pointer"
                    :x="parking.rect.x + '%'" :y="parking.rect.y + '%'" :transform="`rotate(${parking.rect.rotate})`" font-size="60%">
                    {{ parking.charger_name }}
                </text>
                <text class="select-none cursor-pointer" style="writing-mode: vertical-lr; pointer-events:none;"
                    v-for="parking in ev_data" :key="parking.charger_name" :x="parking.rect.x + 1.65 + '%'"
                    :y="parking.rect.y + 1.5 + '%'" :transform="`rotate(${parking.rect.rotate})`" font-size="100%">
                    {{ parking.platenumber }}
                </text>
                <text v-for="parking in ev_data" class="select-none cursor-pointer" style="pointer-events:none;"
                    :key="parking.charger_name" :x="parking.rect.x + 0.1 + '%'" :y="parking.rect.y + 24.5 + '%'"
                    :transform="`rotate(${parking.rect.rotate})`" font-size="70%">
                    {{ Number(parking.charge_current.split("A")[0]).toFixed(0) }} A
                </text>
                <g>
                    <rect x="92%" y="61%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking cursor-pointer hover:opacity-50 transition duration-150 chargingbg"></rect>
                    <rect x="92%" y="63%" rx="0.2%" ry="0.2%" width="1%" height="2%"
                        class="parking cursor-pointer hover:opacity-50 transition duration-150 charging"></rect>
                    <text x="94%" y="64.5%" font-size="90%" class="select-none cursor-pointer">充電</text>

                    <rect x="92%" y="67%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking cursor-pointer hover:opacity-50 transition duration-150 finishing"></rect>
                    <text x="94%" y="70.5%" font-size="90%" class="select-none cursor-pointer">完成</text>

                    <rect x="92%" y="73%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking cursor-pointer hover:opacity-50 transition duration-150 preparing"></rect>
                    <text x="94%" y="76.5%" font-size="90%" class="select-none cursor-pointer">預約</text>

                    <rect x="92%" y="79%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking cursor-pointer hover:opacity-50 transition duration-150 error"></rect>
                    <text x="94%" y="82.5%" font-size="90%" class="select-none cursor-pointer">錯誤</text>

                    <rect x="92%" y="85%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking cursor-pointer hover:opacity-50 transition duration-150 faulted"></rect>
                    <text x="94%" y="88.5%" font-size="90%" class="select-none cursor-pointer">故障</text>

                    <rect x="92%" y="91%" rx="0.2%" ry="0.2%" width="1%" height="4%"
                        class="parking cursor-pointer hover:opacity-50 transition duration-150 available"></rect>
                    <text x="94%" y="94.5%" font-size="90%" class="select-none cursor-pointer">待命</text>
                </g>
            </svg>
        </div>
        <PileInfo />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import PileInfo from '@/components/index/PileInfo'

const pile_window_show = ref(false)

const charger_list = [ 
    { "rect": { "x": 10, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "6-1", "charger_id": "CBAAA1LPH2180011_01" },
    { "rect": { "x": 13.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "7-1", "charger_id": "CBAAA1LPH2180013_01" },
    { "rect": { "x": 17, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "8-1", "charger_id": "CBAAA1LPH2180015_01" },
    { "rect": { "x": 20.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "9-1", "charger_id": "CBAAA1LPH2180017_01" },
    { "rect": { "x": 24, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "10-1", "charger_id": "CBAAA1LPH2180019_01" },
    { "rect": { "x": 27.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "11-1", "charger_id": "CBAAA1LPH2180021_01" },
    { "rect": { "x": 31, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "12-1", "charger_id": "CBAAA1LPH2180023_01" },
    { "rect": { "x": 34.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "13-1", "charger_id": "CBAAA1LPH2180025_01" },
    { "rect": { "x": 38, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "14-1", "charger_id": "CBAAA1LPH2180027_01" },
    { "rect": { "x": 41.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "15-1", "charger_id": "CBAAA1LPH2180029_01" },
    { "rect": { "x": 45, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "16-1", "charger_id": "CBAAA1LPH2180031_01" },
    { "rect": { "x": 48.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "17-1", "charger_id": "CBAAA1LPH2180033_01" },
    { "rect": { "x": 52, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "18-1", "charger_id": "CBAAA1LPH2180035_01" },
    { "rect": { "x": 55.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "19-1", "charger_id": "CBAAA1LPH2180037_01" },
    { "rect": { "x": 59, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "20-1", "charger_id": "CBAAA1LPH2180039_01" },
    { "rect": { "x": 62.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "21-1", "charger_id": "CBAAA1LPH2180041_01" },
    { "rect": { "x": 66, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "22-1", "charger_id": "CBAAA1LPH2180043_01" },
    { "rect": { "x": 69.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "23-1", "charger_id": "CBAAA1LPH2180045_01" },
    { "rect": { "x": 73, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "23-2", "charger_id": "CBAAA1LPH2180046_01" },
    { "rect": { "x": 76.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "24-1", "charger_id": "CBAAA1LPH2180047_01" },
    { "rect": { "x": 80, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "24-2", "charger_id": "CBAAA1LPH2180048_01" },
    { "rect": { "x": 83.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "25-1", "charger_id": "CBAAA1LPH2180049_01" },
    { "rect": { "x": 87, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "25-2", "charger_id": "CBAAA1LPH2180050_01" },
    { "rect": { "x": 90.5, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "26-1", "charger_id": "CBAAA1LPH2180051_01" },
    { "rect": { "x": 94, "y": 5, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "26-2", "charger_id": "CBAAA1LPH2180052_01" },
    { "rect": { "x": 10, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "6-2", "charger_id": "CBAAA1LPH2180012_01" },
    { "rect": { "x": 13.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "7-2", "charger_id": "CBAAA1LPH2180014_01" },
    { "rect": { "x": 17, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "8-2", "charger_id": "CBAAA1LPH2180016_01" },
    { "rect": { "x": 20.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "9-2", "charger_id": "CBAAA1LPH2180018_01" },
    { "rect": { "x": 24, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "10-2", "charger_id": "CBAAA1LPH2180020_01" },
    { "rect": { "x": 27.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "11-2", "charger_id": "CBAAA1LPH2180022_01" },
    { "rect": { "x": 31, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "12-2", "charger_id": "CBAAA1LPH2180024_01" },
    { "rect": { "x": 34.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "13-2", "charger_id": "CBAAA1LPH2180026_01" },
    { "rect": { "x": 38, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "14-2", "charger_id": "CBAAA1LPH2180028_01" },
    { "rect": { "x": 41.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "15-2", "charger_id": "CBAAA1LPH2180030_01" },
    { "rect": { "x": 45, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "16-2", "charger_id": "CBAAA1LPH2180032_01" },
    { "rect": { "x": 48.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "17-2", "charger_id": "CBAAA1LPH2180034_01" },
    { "rect": { "x": 52, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "18-2", "charger_id": "CBAAA1LPH2180036_01" },
    { "rect": { "x": 55.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "19-2", "charger_id": "CBAAA1LPH2180038_01" },
    { "rect": { "x": 59, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "20-2", "charger_id": "CBAAA1LPH2180040_01" },
    { "rect": { "x": 62.5, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "21-2", "charger_id": "CBAAA1LPH2180042_01" },
    { "rect": { "x": 66, "y": 35, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "22-2", "charger_id": "CBAAA1LPH2180044_01" },
    { "rect": { "x": 10, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "1-2", "charger_id": "CBAAA1LPH21B0002_01" },
    { "rect": { "x": 13.5, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "1-1", "charger_id": "CBAAA1LPH21B0001_01" },
    { "rect": { "x": 17, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "2-2", "charger_id": "CBAAA1LPH21B0004_01" },
    { "rect": { "x": 20.5, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "2-1", "charger_id": "CBAAA1LPH21B0003_01" },
    { "rect": { "x": 24, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "3-2", "charger_id": "CBAAA1LPH21B0006_01" },
    { "rect": { "x": 27.5, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "3-1", "charger_id": "CBAAA1LPH21B0005_01" },
    { "rect": { "x": 31, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "4-2", "charger_id": "CBAAA1LPH21B0007_01" },
    { "rect": { "x": 34.5, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "4-1", "charger_id": "CBAAA1LPH21B0008_01" },
    { "rect": { "x": 38, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "5-2", "charger_id": "CBAAA1LPH21B0010_01" },
    { "rect": { "x": 41.5, "y": 72, "width": 3.3, "height": 25, "rotate": 0 }, "charger_name": "5-1", "charger_id": "CBAAA1LPH21B0009_01" },
    { "rect": { "x": 75, "y": -100, "width": 3.3, "height": 25, "rotate": 30 }, "charger_name": "27-1", "charger_id": "CBAAA1LPH2180053_01" },
    { "rect": { "x": 78.5, "y": -100, "width": 3.3, "height": 25, "rotate": 30 }, "charger_name": "27-2", "charger_id": "CBAAA1LPH2180054_01" }
];

const props = defineProps(["ev_data"])
console.log("-------------------------evs")
console.log(props.ev_data)

props.ev_data.map( (d, idx) => { 
    Object.assign(d, charger_list[idx] ) 
    switch (d.status_code) {
        case 0:
            d.chargingpilestatusc = '待命';
            d.chargingpilestatus = 'available';
            break;
        case 1:
            d.chargingpilestatusc = '準備';
            d.chargingpilestatus = 'preparing';
            break;
        case 2:
            d.chargingpilestatusc = '充電';
            d.chargingpilestatus = 'charging';
            break;
        case 3:
            d.chargingpilestatusc = '完成';
            d.chargingpilestatus = 'finishing';
            break;
        case 5:
            d.chargingpilestatusc = '禁用';
            d.chargingpilestatus = 'disabled';
            break;
        case 6:
            d.chargingpilestatusc = '故障';
            d.chargingpilestatus = 'error';
            break;
        case 7:
            d.chargingpilestatusc = '斷線';
            d.chargingpilestatus = 'offline';
            break;
        default:
            d.chargingpilestatusc = '未知';
            d.chargingpilestatus = 'unknown';
            break;
    }
})

watch(props.ev_data, (new_data) => {
    console.log("--------------old")
    console.log(props.ev_data)
    console.log("--------------new")
    console.log(new_data)
})

const parkingSpaceClick = (event) => {
    console.log(event.id-1)
    pile_window_show = true;
    // tempParkingSpace.data = parkingSpaces[event.target.id - 1].data
    // tempParkingSpace.show = true;
    // batteryLevel.value = NaN;
    // plateNumberText.value = "";
    // if(tempParkingSpace.data.chargingpilestatus == "charging" || tempParkingSpace.data.chargingpilestatus == "finishing"){
    //     batteryLevel.value = tempParkingSpace.data.soc;
    //     plateNumberText.value = tempParkingSpace.data.platenumber;
    // }
    // updateBatteryChart();
    // pileHistoryClick( { "query":{"chargingid":tempParkingSpace.data.chargingid}, "page":0 } );
    // vehicleHistoryClick( {"query":{"platenumber":tempParkingSpace.data.platenumber}, "page":0} );
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

// onMounted(() => {
//     const svg = d3
//         .select('#battery-chart')
//         .append('svg')
//         .attr('viewBox', '0 0 200 200')
//         .attr('width', '100%')
//         .attr('height', '100%')
//         .attr('preserveAspectRatio', 'xMidYMid meet');
//     svg.append('path').attr('transform', 'translate(100, 100)');
//     svg
//         .append('text')
//         .attr('x', 100)
//         .attr('y', 100)
//         .attr('text-anchor', 'middle')
//         .attr('dominant-baseline', 'middle')
//         .style('font-size', '24px')
//         .style('cursor', 'pointer')
//         .attr("id", function(d, i) { return "labelSOC"; });
//     svg
//         .append('text')
//         .attr('x', 100)
//         .attr('y', 120)
//         .attr('text-anchor', 'middle')
//         .attr('dominant-baseline', 'middle')
//         .style('font-size', '12x')
//         .style('fill', '#888888')
//         .style('cursor', 'pointer')
//         .attr("id", function(d, i) { return "labelPlateNumber"; });
//     updateBatteryChart();
//     // updateParkingSpace();
// });

</script>
<style scoped>

svg, text {
    filter: drop-shadow(1px 1px 0.2px rgb(88 88 88 / 0.15));
}

.svg-container {
    width: 100%;
    height: 100%;
}
.ant-tag {
    border-radius: 4px;
    cursor: pointer;
    transition: all .15s ease-out;
}
.ant-tag:hover {
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
    cursor: pointer;
}
.charging {
    fill: rgba(211, 173, 247, 0.8);
    border: 1px solid rgb(211, 173, 247);
    background-color:rgba(249, 240, 255);
    color: rgb(83, 29, 171);
}
.error {
    fill: rgba(250, 173, 20, 0.5);
    border: 1px solid rgb(255, 229 143);
    background-color: rgb(255, 251, 230);
    color: rgb(250, 173, 20);
}

.disabled {
    fill: rgba(66, 66, 66, 0.5);
    border: 1px solid rgb(88, 88, 88);
    background-color: rgb(255, 255, 255);
    color: rgb(230, 230, 230);
}

.offline {
    fill: rgba(255, 77, 79, 0.5);
    border: 1px solid rgb(255, 204, 199);
    background-color: rgb(255, 242, 240);
    color: rgb(255, 77, 79);
}

.faulted {
    fill: rgba(255, 77, 79, 0.5);
    border: 1px solid rgb(255, 204, 199);
    background-color: rgb(255, 242, 240);
    color: rgb(255, 77, 79);
}
</style>