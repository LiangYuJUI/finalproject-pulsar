import axios from 'axios';
import https from 'https';
import zoneTable from "./zone.json";

const getVehicleData = async (stationId) => {
    return new Promise((resolve) => {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        axios.get("https://neopower.com.tw/api/v2/ms/vehicle", { httpsAgent: agent })
            .then((response) => {
                var responseData = response.data.data;
                var responseList = [];
                if(responseData){
                    responseData.forEach(element => {
                        if(element.DrivingStatus == "已進站"){
                            responseList.push({
                                "PlateNumber": element.PlateNumber,
                                "SOC": element.SOC
                            })
                        }
                    });
                    var sortedList = [];
                    sortedList = responseList.sort(function(a,b) {
                        return a.SOC - b.SOC;
                    })
                    resolve(sortedList);
                }
                
            })
            .catch((error) => {
                console.log(error);
                resolve("error")
            });
    })
}

const getParkingSpaceData = async () => {
    return new Promise((resolve) => {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        axios.get("https://neopower.com.tw/api/v2/ev_status", { httpsAgent: agent })
            .then((response) => {
                var responseData = response.data.data;
                var usableSpace = [];
                responseData.forEach(element => {
                    if(element.status_code == 0){
                        usableSpace.push(element.charger_id);
                    }
                });
                resolve(usableSpace);
            })
            .catch((error) => {
                console.log(error);
                resolve("error")
            });
    })
}


const getSpaceConfig = async () => {
    return new Promise((resolve) => {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        axios.get("https://neopower.com.tw/api/v2/config", { httpsAgent: agent })
            .then((response) => {
                var config = [];
                const configData = response.data.data.charger_list;
                configData.forEach(element => {
                    config[element.charger_id] = element.charger_name;
                });
                resolve(config);
            })
            .catch((error) => {
                console.log(error);
                resolve("error")
            });
    })
}

export default defineEventHandler(async (event) => {
    const vehicleData = await getVehicleData();
    const spaceConfig = await getSpaceConfig();
    const parkingSpace = await getParkingSpaceData();
    if((vehicleData == "error") || (spaceConfig == "error") || (parkingSpace == "error")){
        return [];
    }
    var usableSpace = [];
    parkingSpace.forEach(element => {
        usableSpace.push(spaceConfig[element]);
    });

    var zone = [];
    zoneTable.forEach(function(element, index) {
        zone.push({
            "name": String.fromCharCode(index + 65),
            "index": index,
            "spaceNum": element.length * 2,
            "space": element,
            "usableSpaceNum": 0
        })
    });

    usableSpace.forEach(element => {
        const spaceName = element.split("-");
        const pileName = parseInt(spaceName[0], 10);
        zone.forEach(eachZone => {
            if(eachZone.space.includes(pileName)){
                eachZone.usableSpaceNum++;
            }
        });
    });
    const returnData = [];
    var alternate_i = 1;
    vehicleData.forEach(vehicle => {
        var usableZone = null;
        var maxUsableDensity = 0;
        zone.forEach(element => {
            if((element.usableSpaceNum/element.spaceNum) > maxUsableDensity){
                usableZone = element.index;
                maxUsableDensity = element.usableSpaceNum/element.spaceNum;
            }
        });

        if(usableZone != null){
            returnData.push({
                "PlateNumber": vehicle.PlateNumber,
                "Zone": String.fromCharCode(usableZone + 65)
            });
            zone[usableZone].usableSpaceNum--;
        }else{
            returnData.push({
                "PlateNumber": vehicle.PlateNumber,
                "Zone": `候補${alternate_i}`
            });
            alternate_i++;
        }
    });

    return returnData;
})