import stationConfig from "@/secret/gochabar.json"
import request from "request"
const logs_from = "api/v2/charging/smartCharging/index.post.js";

const runtimeConfig = useRuntimeConfig();

var chargingStatus = false;
var todayPeakTimeCancel = false;
var firstTimeScheduleExec = false;
var enel_dr = false;
var charging_counter = -1;
var manual_list = [];
var sendStartTimes = {};

const charger_id2name = async(charger_id) => {
    for(let i=0;i<stationConfig.charger_list.length;i++){
        if(stationConfig.charger_list[i].charger_id == charger_id){
            return stationConfig.charger_list[i].charger_name;
        }
    }
}

const getExceptionSchedule = async () => {
    // 送出 request
    // logger.info(`Sending request to ${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/exception/now`, {logs_from: logs_from, function: "getExceptionSchedule"});

    return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/exception/now`).then((response)=>{
        return response;
    }).catch((error) => {
        // 收到 error
        // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from, function: "getExceptionSchedule"}));

        console.log(error);
    });
}
const getRegularSchedule = async () => {
    // 送出 request
    // logger.info(`Sending request to ${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/regular/now`, {logs_from: logs_from, function: "getRegularSchedule"});

    return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/regular/now`).then((response)=>{
        return response;
    }).catch((error) => {
        // 收到 error
        // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from, function: "getRegularSchedule"}));

        console.log(error);
    });
}
const getExceptionScheduleCapacity = async () => {
    // 送出 request
    // logger.info(`Sending request to ${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/exception/now`, {logs_from: logs_from, function: "getExceptionScheduleCapacity"});

    return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/exception/now`).then((response)=>{
        if(response.data.length){
            return Number(response.data[0].capacityLimit)*1000;
        }
        return 1;
    }).catch((error) => {
        // 收到 error
        // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from, function: "getExceptionScheduleCapacity"}));
        
        console.log(error);
    });
}
const getRegularScheduleCapacity = async () => {
    // 送出 request
    // logger.info(`Sending request to ${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/regular/now`, {logs_from: logs_from, function: "getRegularScheduleCapacity"});

    return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/ms/schedule/regular/now`).then( (response) => {
        if(response.data.length){
            return Number(response.data[0].capacityLimit)*1000;
        }
        return 1;
    }).catch((error) => {
        // 收到 error
        // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from, function: "getRegularScheduleCapacity"}));

        console.log(error);
    });
}
const isPeakTime = async () => {
    // 送出 request
    // logger.info(`${runtimeConfig.LOCALHOST}/api/v2/config`, {logs_from: logs_from, function: "isPeakTime"});

    return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/config`).then( (response) => {
        if( response.success ){
            const now = new Date();
            const nowHM = dateFormatter(now, "-:").substring(11, 16);
            const yyyymmdd = dateFormatter(now, "-:").substring(0, 11);
            // const nowHM = "17:30";
            // const yyyymmdd = "2023-07-01"
            if( new Date(yyyymmdd) >= new Date(response.data.summer_date_start) && new Date(yyyymmdd) <= new Date(response.data.summer_date_end) ){
                if( nowHM > response.data.summer_time_start && nowHM < response.data.summer_time_end && now.getDay()>0 && now.getDay()<6){
                    // nowTime is at peak time
                    // console.log("-- isPeakTime(), in summer peak time", true);
                    return true;
                }
                // console.log("-- isPeakTime(), not in summer peak time", false);
                return false;
            }
            else{
                if( nowHM >= response.data.peak_time_start && nowHM < response.data.peak_time_end && now.getDay()>0 && now.getDay()<6){
                    // nowTime is at peak time
                    // console.log("-- isPeakTime(), in peak time", true);
                    return true;
                }
                // console.log("-- isPeakTime(), not in peak time", false);
                return false;
            }
        }
    }).catch((error) => {
        // 收到 error
        // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from, function: "isPeakTime"}));

        console.log(error);
    });
}
const getConfigCapacity = async () => {
    // 送出 request
    // logger.info(`Sending request to ${runtimeConfig.LOCALHOST}/api/v2/config`, {logs_from: logs_from, function: "getConfigCapacity"});

    return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/config`).then( async (response) => {
        if( response.success ){
            if( await isPeakTime() ){
                // nowTime is at peak time
                return Number(response.data.peak_time_kw_limit)*1000;
            }
            return Number(response.data.kw_limit)*1000;
        }
    })
    .catch((error) => {
        // 收到 error
        // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from, function: "getConfigCapacity"}));
    });
}

const sendCurrentCommand = async (pileArr) => {
    const requestOptions = {
        method: "POST",
        body: { charger_id: eachData.charger_id, current: eachData.current }
    }
    // 送出 request
    // logger.info(`Sending request to ${runtimeConfig.LOCALHOST}/api/v2/charging/set/current`, {logs_from: logs_from, function: "getConfigCapacity"});

    // http://localhost:3000
    return Promise.all( pileArr.map(
        (eachData) => { 
            const requestOptions = {
                method: "POST",
                body: { charger_id: eachData.charger_id, current: eachData.current }
            }

            // 送出 request
            // logger.info(`Sending request to ${requestOptions.url}`, Object.assign(requestOptions, {logs_from: logs_from, function: "sendCurrentCommand"}));

            return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/charging/set/current`, requestOptions)
    }))
    .then( (requestResults) => {
        return { success: true, message: requestResults }
    })
    .catch( (error) => {
        // 收到 error
        // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from, function: "sendCurrentCommand"}));

        return { success: false, message: error }
    });
}

// ========logs目前寫到這裡=========
const calCurrent = async (pileArr, capacityLimit) => {
    return new Promise ( async (resolve) => {
        for (let i=0;i<pileArr.length;i++){
            pileArr[i].voltage = parseInt(pileArr[i].charge_voltage);
            // delete pileArr[i].charge_current;
            // delete pileArr[i].licensePlate;
            delete pileArr[i].charge_time;
            delete pileArr[i].vendor_error_code;
            delete pileArr[i].status_code;
            delete pileArr[i].charge_kw;
            delete pileArr[i].charge_voltage;
        }
        // hybrid auto&manual, replace current value
        for(let i=0;i<manual_list.length;i++){
            for(let j=0;j<pileArr.length;j++){
                if(manual_list[i].charger_id == pileArr[j].charger_id){
                    $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { charger_id: manual_list[i].charger_id, current_target: manual_list[i].current } });
                    pileArr[j].current = manual_list[i].current;
                    break;
                }
            }
        }
        try {
            const smartchargingResult = await $fetch(`${runtimeConfig.LOCALHOST}/api/smartcharging`, {
                method: "POST",
                body: JSON.stringify( { chargerList: pileArr, capacityLimit: capacityLimit } )
            });
            for(let i=0;i<smartchargingResult.length;i++){
                $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { charger_id: smartchargingResult[i].charger_id, current_target: smartchargingResult[i].current } });
                //? pileArr is waiting for current command list of pile
                for(let j=0;j<pileArr.length;j++){
                    if(!pileArr.length || !smartchargingResult.length){
                        break;
                    }
                    if(smartchargingResult[i].charger_id == pileArr[j].charger_id){
                        if( smartchargingResult[i].current >= Math.floor(parseInt(pileArr[j].charge_current)*0.98) && smartchargingResult[i].current <= Math.ceil(parseInt(pileArr[j].charge_current)*1.02) ){
                            // remove same current command
                            smartchargingResult.splice(i, 1);
                            // reset i, j to handle decrese index by slice(). until no same charger_id have approximate current&current_command.
                            i=0;
                            j=0;
                        }
                    }
                }
            }
            resolve( { success: true, message: smartchargingResult } );
        }
        catch ( error ){
            console.log("calCurrent(), statusCode:", error);
            resolve( { success: true, message: JSON.parse([]) } );
        }
    })
}
const sendStopChargeCommand = async (pileArr) => {
    return Promise.all( pileArr.map(
        (eachPile) => { 
            console.log("\x1b[42m\x1b[37m%s\x1b[0m", " -- send stop charging command -- ", eachPile.charger_id);
            // remove manual current list
            for(let i=0;i<manual_list.length;i++){
                if(pileArr.charger_id == manual_list[i].charger_id){
                    manual_list.splice(i, 1);
                    break;
                }
            }
            return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/charging/stop`, {
                method: "POST",
                body: { charger_id: eachPile.charger_id }
            })
    }))
    .then( (requestResults) => {
        return { success: true, message: requestResults }
    })
    .catch( (error) => {
        return { success: false, message: error }
    })
}
const sendStartChargeCommand = async (pileArr) => {
    return Promise.all( pileArr.map(
        (eachPile) => { 
            console.log("\x1b[46m\x1b[37m%s\x1b[0m", " -- send start command -- ", eachPile.charger_id, `NPAM-${eachPile.charger_id}-${dateFormatter(new Date())}`);
            return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/charging/start`, {
                method: "POST",
                body: { charger_id: eachPile.charger_id, trans_id: `NPAM-${eachPile.charger_id}-${dateFormatter(new Date())}` }
            })
    }))
    .then( (requestResults) => {
        return { success: true, message: requestResults };
    })
    .catch( (error) => {
        return { success: false, message: error };
    })
}
const smartCharging = async (event, execNextTime) => {
    // call ev_status api to get pile status. drop cell if status_code != 2.
    const requestOptions = {
        url: `${runtimeConfig.LOCALHOST}/api/v2/ev_status`
    };
    // logger.info(`Sending request to ${requestOptions.url}`, {logs_from: logs_from});
    try{
        request(requestOptions, async (error, response, body) => {
            if (error) {

                // 收到 error
                // logger.error(`Error in ${logs_from}`, Object.assign(error, {logs_from: logs_from}));

                // setResponseStatus(event, 500, `Internal Server Error`);
                // console.error('-- Error: /server/api/v2/charging/smartCharging.post.js', error);
            } else if (response.statusCode == 200 || response.statusCode == 201) {
                body = JSON.parse(body);
                //! get piles status_code == 1 (preparing to charge)
                const preparingData = body.data.filter( d => { return d.status_code == 1 } )

                if( preparingData.length ){
                    console.log("\x1b[46m\x1b[37m%s\x1b[0m", ` [Smart Charging] -- Preparing to Charging -- `)
                    preparingData.map( (d) => {
                        for(let i=0;i<manual_list.length;i++){
                            if(d.charger_id == manual_list[i].charger_id){
                                manual_list.splice(i, 1);
                                break;
                            }
                        }
                        console.log(" - ", d.charger_id, d.charge_current.padStart(8, " "), d.licensePlate.padEnd(10, " "), d.soc.padStart(4, " "))
                        return;
                    });
                }
                //! get piles status_code == 2 (charging)
                const chargingData = body.data.filter ( d => { return d.status_code == 2 } );

                //! show charging pile info.
                let charge_power = 0;
                if(chargingData.length){
                    console.log("\x1b[43m\x1b[37m%s\x1b[0m", " [Smart Charging] -- Charging -- ");
                    chargingData.map( (d) => {
                        charge_power += (parseInt(d.charge_voltage) * parseInt(d.charge_current))/1000;
                        console.log(" - ", d.charger_id, d.charge_current.padStart(8, " "), d.licensePlate.padEnd(10, " "), d.soc.padStart(4, " "))
                        return;
                    });
                }
                //! get capacity
                let capacityLimit =  await getConfigCapacity();
                if( (await getExceptionSchedule()).data.length){
                    capacityLimit = await getExceptionScheduleCapacity();
                }
                if ( (await getRegularSchedule()).data.length ){
                    capacityLimit = await getRegularScheduleCapacity();
                }
                if(preparingData.length){
                    capacityLimit = capacityLimit - 120*1000;
                }
                // get setting current per charging pile
                let calCurrentData = [];
                calCurrentData.message = [];
                if(chargingData.length){
                    chargingData.map( (d) => { delete sendStartTimes[d.charger_id]; } );
                    calCurrentData = await calCurrent(chargingData, capacityLimit - 120*1000 );
                }
                if(charge_power > 1800){
                    // sendMessageToLineNotify(`Power exceeds limit: ${charge_power.toFixed(2)}/1800`);
                }
                console.log(" -- ")
                console.log(` ${(new Date()).toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})} -- Peak Time: ${await isPeakTime()}, Pre: ${preparingData.length}, Power: ${charge_power.toFixed(2)} / ${capacityLimit/1000} `);
                //! send start charge command if not in peak time
                // 5 sec/round, 5*12=60, 1minute to start charging
                charging_counter = (charging_counter+1)%6;
                const quick_charging_start = new Date();
                quick_charging_start.setHours(6);
                quick_charging_start.setMinutes(0);
                quick_charging_start.setSeconds(0);
                const quick_charging_end = new Date();
                quick_charging_end.setHours(18);
                quick_charging_end.setMinutes(0);
                quick_charging_end.setSeconds(0);
                const now = new Date();

                //! -- send start charging command --
                if( !enel_dr && now > quick_charging_start && now < quick_charging_end && ( (!await isPeakTime() && preparingData.length) && await getExceptionScheduleCapacity() > 0 && await getRegularScheduleCapacity() > 0) ){
                    // let notify_string = "Start charging command sent:";
                    for(let i=0;i<preparingData.length;i++){
                        let result = await sendStartChargeCommand( [ preparingData[i] ] );
                        sendStartTimes[preparingData[i].charger_id] = sendStartTimes[preparingData[i].charger_id] == undefined ? 1 : (sendStartTimes[preparingData[i].charger_id]+1);
                        if( sendStartTimes[preparingData[i].charger_id] == 30 ) {
                            let notify_string = `Warning:\n${preparingData[i].charger_id} (${await charger_id2name(preparingData[i].charger_id)}) has not started charging for more than ${sendStartTimes[preparingData[i].charger_id]} times.\nPlease check the status of the charger.`
                            // sendMessageToLineNotify(notify_string);
                        }
                    }
                }
                else if( !enel_dr && !charging_counter && ( preparingData.length && ( !await isPeakTime() || await getExceptionScheduleCapacity() > 120 || await getRegularScheduleCapacity() > 120 ) ) ){
                    // sendStartChargeCommand receive an array
                    // 120: one charging pile need 120kw to start
                    // let notify_string = "";
                    if( (capacityLimit/1000 - charge_power) > 120 ){
                        let randomStartArr = [];
                        for( ; randomStartArr.length < 1 ; ){
                            let randomNumber_charger_id = Math.floor(Math.random()*preparingData.length);
                            if(!randomStartArr.includes(randomNumber_charger_id)){
                                randomStartArr.push( randomNumber_charger_id );
                            }
                        }
                        for( let i=0;i<randomStartArr.length;i++){
                            let result = await sendStartChargeCommand( [ preparingData[randomStartArr[i]] ] );
                            sendStartTimes[preparingData[i].charger_id] = sendStartTimes[preparingData[i].charger_id] == undefined ? 1 : (sendStartTimes[preparingData[i].charger_id]+1);
                            if( sendStartTimes[preparingData[i].charger_id] == 10 && Number.isInteger(sendStartTimes[preparingData[i].charger_id]) ) {
                                let notify_string = `Warning:\n${preparingData[i].charger_id} (${await charger_id2name(preparingData[i].charger_id)}) has not started charging for more than ${sendStartTimes[preparingData[i].charger_id]} times.\nPlease check the status of the charger.`
                                // sendMessageToLineNotify(notify_string);
                            }
                        }
                    }
                    else {

                    }
                }
                else {
                    
                }
                //! get soc >= 99 and status is charging
                const finishData = body.data.filter ( (d) => { return (parseInt(d.soc) >= 99 && d.status_code == 2) });
                if( finishData.length ){
                    console.log("\x1b[42m\x1b[37m%s\x1b[0m", " [Smart Charging] -- Charging to Finish -- ");
                    finishData.map( (d) => {
                        console.log(" - ", d.charger_id, d.charge_current.padStart(8, " "), d.licensePlate.padEnd(10, " "), d.soc.padStart(4, " "))
                        return;
                    });
                    //! send stop charging command
                    await sendStopChargeCommand(finishData);
                }
                if ( (await getExceptionSchedule()).data.length ){
                    // first time to setting charging schedule
                    if( !firstTimeScheduleExec ) {
                        // sendMessageToLineNotify(`exception schedule executed.\nlimit: ${capacityLimit/1000} kW\n${(await getExceptionSchedule()).data[0].startDateTime}\n${(await getExceptionSchedule()).data[0].endDateTime}`);
                        firstTimeScheduleExec = true;
                        if( await getExceptionScheduleCapacity() == 0 ){
                            let notifyString = "switch to peak-time.";
                            if(chargingData.length){
                                await sendStopChargeCommand(chargingData);
                                chargingData.map( (d) => {
                                    notifyString += `\n - ${d.charger_id}`
                                    console.log(" - ", d.charger_id, String(d.charge_current).padStart(4, " "));
                                });
                                notifyString += "\ncharging has stopped.";
                            }
                            else{
                                notifyString += "\nno charging piles need to be stopped."
                            }
                            todayPeakTimeCancel = true;
                            // sendMessageToLineNotify(notifyString);
                        }
                    }
                }
                else if ( (await getRegularSchedule()).data.length ){
                    // first time to setting charging schedule
                    if( !firstTimeScheduleExec ) {
                        // sendMessageToLineNotify(`regular schedule executed.\nlimit: ${capacityLimit/1000} kW\n${(await getRegularSchedule()).data[0].startDateTime}\n${(await getRegularSchedule()).data[0].endDateTime}`);
                        firstTimeScheduleExec = true;
                        if( await getRegularScheduleCapacity() == 0 ){
                            let notifyString = "switch to peak-time.";
                            if(chargingData.length){
                                await sendStopChargeCommand(chargingData);
                                chargingData.map( (d) => {
                                    notifyString += `\n - ${d.charger_id}`
                                    console.log(" - ", d.charger_id, String(d.charge_current).padStart(4, " "));
                                });
                                notifyString += "\ncharging has stopped.";
                            }
                            else{
                                notifyString += "\nno charging piles need to be stopped.";
                            }
                            todayPeakTimeCancel = true;
                            // sendMessageToLineNotify(notifyString);
                        }
                    }
                }
                else if( await isPeakTime() ){
                    // daily charging
                    // today first time switch to peak time.
                    // stop all charging pile 
                    if( !todayPeakTimeCancel ){
                        console.log("\x1b[41m%s\x1b[0m", " [------ Switch to peak-time ------]");
                        $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { isPeak: true } });
                        let notifyString = "switch to peak-time.";
                        if(chargingData.length){
                            await sendStopChargeCommand(chargingData);
                            chargingData.map( (d) => {
                                notifyString += `\n - ${d.charger_id}`
                                console.log(" - ", d.charger_id, String(d.charge_current).padStart(4, " "));
                            });
                            notifyString += "\ncharging has stopped.";
                        }
                        else{
                            notifyString += "\nno charging piles need to be stopped.";
                        }
                        todayPeakTimeCancel = true;
                        // sendMessageToLineNotify(notifyString);
                    }
                }
                else {
                    // not in  peak-time
                    if( todayPeakTimeCancel ) {
                        // sendMessageToLineNotify("switch to off-peak time.");
                        $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { isPeak: false } });
                        // reset counter
                        charging_counter = -1;
                        todayPeakTimeCancel = false;
                        const first_priority = ["CBAAA1LPH2180011_01", "CBAAA1LPH2180012_01", "CBAAA1LPH2180013_01", "CBAAA1LPH2180014_01", "CBAAA1LPH2180015_01", "CBAAA1LPH2180016_01",  "CBAAA1LPH2180017_01", "CBAAA1LPH2180018_01", "CBAAA1LPH2180019_01", "CBAAA1LPH2180020_01", "CBAAA1LPH2180021_01", "CBAAA1LPH2180022_01", "CBAAA1LPH2180023_01", "CBAAA1LPH2180024_01", "CBAAA1LPH2180025_01", "CBAAA1LPH2180026_01", "CBAAA1LPH2180027_01", "CBAAA1LPH2180028_01", "CBAAA1LPH2180029_01", "CBAAA1LPH2180030_01"];
                        const start_limit_number = parseInt( (capacityLimit/1000 - charge_power) / 120 ) * 2;
                        let notify_string = "";
                        notify_string = "Start charging command sent:"
                        const result = sendStartChargeCommand( first_priority.slice(start_limit_number) );
                        for(let i=0;i<start_limit_number;i++){
                            notify_string += `\n - ${first_priority[i].charger_id}`;
                            notify_string += `\n   - ${result.message[0].message.resmsg} ${result.message[0].message.rescode}`;
                        }
                        notify_string += `\n--`;
                        // sendMessageToLineNotify(notify_string);
                    }
                    if ( firstTimeScheduleExec ){
                        firstTimeScheduleExec = false;
                    }
                }
                // send current command to gochabar
                if(calCurrentData.message.length && !enel_dr){
                    console.log("\x1b[43m\x1b[37m%s\x1b[0m", " [Smart Charging] -- Set Current -- ");
                    calCurrentData.message.map( (d) => {
                        console.log(" - ", d.charger_id, String(d.current).padStart(4, " "));
                        return;
                    });
                    const commandResults = await sendCurrentCommand(calCurrentData.message);
                    if(commandResults.success){
                        // console.log(commandResults.message);
                    }    
                }
                
            } else {
                console.log("call /ev_status error", response.statusCode);
            }
        })
    }
    catch (error) {
        console.log(error)
    }
    // -- cal finish. set next function call
    if (chargingStatus && execNextTime){
        return setTimeout( () => smartCharging(event, true), 10000);   
    }
    return ;
}

const start_gochabar_auto = async () => {
    return new Promise( async (resolve) => {
        try{
            const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/settingControl`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
                body: { "enabled": false }
            });
            console.log("\x1b[41m%s\x1b[0m", " [------ Send request to gochabar auto------]");
            console.log(gochabar_result);
            resolve( { success: true, message: gochabar_result } );
        }
        catch ( error ){
            console.error('-- Error: start_gochabar_auto', error);
            resolve( { success: false, message: error } );
        }
    });
}

const stop_gochabar_auto = async () => {
    return new Promise( async (resolve) => {
        try{
            const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/settingControl`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
                body: { "enabled": true }
            });
            console.log("\x1b[41m%s\x1b[0m", " [------ Send request to gochabar auto off------]");
            console.log(gochabar_result);
            resolve( { success: true, message: gochabar_result } );
        }
        catch ( error ){
            console.error('-- Error: start_gochabar_auto', error);
            resolve( { success: false, message: error } );
        }
    });
}

export default defineEventHandler(async (event) => {
    // 收到request
    // logger.info('Request received', { method: event.node.req.method, url: event.node.req.url, logs_from: logs_from});
    
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    setResponseStatus(event, 200, "OK");
    try{
        // const ip = event.node.req.headers['x-forwarded-for'];
        const headers = getHeaders(event);
        // read jwt from cookie
        const userJWT = parseCookies(event).jwt;
        const body = await readBody(event);
        
        const { status } = getQuery(event);
        if ( status ) {
            return { success: true, message: chargingStatus };
        }
        if (body.enel_dr == false) {
            if(headers["authorization"] == "43c05f600904184e5a16732e579a928e89f3264bedfd391cb3145f617e64cf0e"){
                if(enel_dr == true){
                    enel_dr = false;
                    smartCharging(event, false);
                    $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { isDR: false } });
                    // sendMessageToLineNotify("DR closed successfully");
                    // sendMessageToLineNotify(`【${runtimeConfig.NEOPOWER_STATION_ID}${runtimeConfig.STATION_NAME}】\nDR closed successfully`, "ENEL");
                    return JSON.stringify( { success: true, message: "Closed successfully" }, null, 4)
                }
                // sendMessageToLineNotify("DR already closed");
                // sendMessageToLineNotify(`【${runtimeConfig.NEOPOWER_STATION_ID}${runtimeConfig.STATION_NAME}】\nDR already closed`, "ENEL");
                return JSON.stringify( { success: false, message: "Already closed" }, null, 4)
            }
            else{
                // 403 Forbidden
                // logger.error(`Error in ${logs_from}`, {error: "403 Forbidden", logs_from: logs_from});

                setResponseStatus(event, 403, "Forbidden");
                return JSON.stringify( { success: false, message: "Forbidden" }, null, 4)
            }        
        }
        else if ( body.enel_dr == true ) {
            // sha256(enelxneopower)
            if(headers["authorization"] == "43c05f600904184e5a16732e579a928e89f3264bedfd391cb3145f617e64cf0e"){
                if( !enel_dr ){
                    const enelResult = await enel();
                    sendLog(1, enelResult.success ? 6 : 0, "192.168.2.86", "np01", enelResult.message);
                    enel_dr = enelResult.success;
                    $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { isDR: enelResult.success } });
                    // sendMessageToLineNotify(enelResult.message);
                    // sendMessageToLineNotify(`【${runtimeConfig.NEOPOWER_STATION_ID}${runtimeConfig.STATION_NAME}】\n${enelResult.message}`, "ENEL");
                    return JSON.stringify({ success: enelResult.success, message: enelResult.message }, null, 4);
                }
                // sendMessageToLineNotify("DR already turned on");
                // sendMessageToLineNotify(`【${runtimeConfig.NEOPOWER_STATION_ID}${runtimeConfig.STATION_NAME}】\nDR already turned on`, "ENEL");
                return JSON.stringify( { success: false, message: "Already turned on" }, null, 4)
            }
            else{
                // 403 Forbidden
                // logger.error(`Error in ${logs_from}`, {error: "403 Forbidden", logs_from: logs_from});

                setResponseStatus(event, 403, "Forbidden");
                return JSON.stringify( { success: false, message: "Forbidden" }, null, 4)
            }
        }
        if ( body.on == true ) {
            // check permission
            if ( ! userJWT ){
                setResponseStatus(event, 401, "Unauthorized");
                return JSON.stringify( { success: false, message: "Unauthorized"}, null, 4);
            }
            else if( ! (await checkPermission(userJWT, "manager") ) ){
                setResponseStatus(event, 403, `Forbidden`);
                return JSON.stringify( { success: false, message: "Forbidden"}, null, 4);
            }
            else{
                console.log("\x1b[47m\x1b[37m%s\x1b[0m", " [Smart Charging] -- Start Smart Charging -- ");
                const gochabar_auto = start_gochabar_auto();
                if (chargingStatus == false) {
                    chargingStatus = true;
                    $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { isAuto: true } });
                    // sendMessageToLineNotify(`Auto mode was turned on by ${await getNameByJwt(userJWT)}`);
                    try {
                        // await setAllPileCurrentLimit(181);
                        smartCharging(event, true);
                        getCapacityLimitSchedule(event);
                        return { success: true, message: "Started" };
                    }
                    catch (error) {
                        return { success: false, message: `Start error: ${error}` };
                    }
                }
                return { success: false, message: "already started" };
            }
        }
        else if ( body.on == false ) {
            if ( ! userJWT ){
                setResponseStatus(event, 401, "Unauthorized");
                return JSON.stringify( { success: false, message: "Unauthorized" }, null, 4);
            }
            else if( ! (await checkPermission(userJWT, "manager") ) ){
                setResponseStatus(event, 403, "Forbidden");
                return JSON.stringify( { success: false, message: "Forbidden" }, null, 4);
            }
            // stop auto mode
            if (!chargingStatus) {
                return { success: false, message: "already stoped" }
            }
            else{
                const gochabar_auto = stop_gochabar_auto();
                // sendMessageToLineNotify(`Auto mode was turned off by ${await getNameByJwt(userJWT)}`);
            }
            chargingStatus = false;
            // update station status by fetch
            $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { isAuto: false } });
            return { success: true, message: "Stoped" };
        }
        if ( body.charger_id ) {
            // for manual mode
            if ( ! userJWT ){
                setResponseStatus(event, 401, "Unauthorized");
                return JSON.stringify( { success: false, message: "Unauthorized" }, null, 4);
            }
            else if( ! (await checkPermission(userJWT, "manager") ) ){
                setResponseStatus(event, 403, "Forbidden");
                return JSON.stringify( { success: false, message: "Forbidden" }, null, 4);
            }
            if( Number(body.current) > 0 ) {
                let found = false;
                for( let i=0;i<manual_list.length;i++ ){
                    if( manual_list[i].charger_id == body.charger_id ){
                        manual_list[i].current = body.current;
                        found = true;
                        break;
                    }
                }
                if(!found){
                    manual_list.push({charger_id:body.charger_id, current:Number(body.current)});
                }
                // sendMessageToLineNotify(`Set current by ${await getNameByJwt(userJWT)}\n - ${body.charger_id}, ${body.current}A`, "NP01");
                return { success: true, message: "200 OK" };
            }
        }
    }
    catch(error){
        console.error(error);
    }
    return ;
});