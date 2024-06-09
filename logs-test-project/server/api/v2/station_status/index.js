import stationConfig from "@/secret/gochabar.json";
const logs_from = "api/v2/station_status/index.js";
const stationStatus = {
    isPeak: false,
    isAuto: false,
    isDR: false,
    updated_time: new Date(), 
    power: 0,
    powerLimit: 0,
    piles: []
};

const getAllPilesStatus = async () => {
    return new Promise( async (resolve) => {
        //try{
            const requestDetails = {
                url: `${stationConfig.host}:${stationConfig.port}/api/ev_status`,
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey},
                body: { station_id: stationConfig.station_id, charger_id: "" }
            };

            // 送出 request
            logger.info(`Sending request to ${requestDetails.url}`, { events: JSON.stringify(requestDetails), logs_from: logs_from, function: "getAllPilesStatus"});

            const gochabar_result = await $fetch(requestDetails.url, {
                method: requestDetails.method,
                headers: requestDetails.headers,
                body: requestDetails.body
            });


            // 收到 response
            logger.info(`Received response from ${requestDetails.url}`, { events: JSON.stringify({rescode: gochabar_result.rescode, resmsg: gochabar_result.resmsg}), logs_from: logs_from, function: "getAllPilesStatus" });
            resolve( { success: true, message: gochabar_result } );
        //}
        // catch ( error ){

        //     // 收到 error
        //     logger.error(`Error in ${logs_from}`, { events: JSON.stringify(error), logs_from: logs_from, function: "getAllPilesStatus"});
        //     resolve( { success: false, message: error } );
        // }
    });
}

export default defineEventHandler(async (event) => {
    // 收到request
    logger.info('Request received', { events: JSON.stringify({method: event.node.req.method, url: event.node.req.url}), logs_from: logs_from, function: "main"});

    const calledMethod = event.node.req.method;
    // console.log(event.node.req.headers)
    if( calledMethod == "GET" ){
        setResponseHeaders(event, { "Content-Type":"application/json; charset=utf-8" } );
        // if data is empty
        if(!stationStatus.piles.length || (Math.abs((new Date()).getTime() - stationStatus.updated_time.getTime()))/1000 > 240){
            console.log(" -- api/v2/station_status update pile status by api/v2/ev_status", new Date());
            console.log(" == time delate ", (Math.abs((new Date()).getTime() - stationStatus.updated_time.getTime()))/1000, "s")
            stationStatus.piles = stationConfig.charger_list;
            // const ev_status = await $fetch(`/api/v2/ev_status`);
            stationStatus.updated_time = new Date();
            const ev_status = (await getAllPilesStatus()).message;
            stationStatus.piles.map( eachPile => {
                // initialize each pile
                for( let i=0;i<ev_status.data.length;i++){
                    if( eachPile.charger_id == ev_status.data[i].charger_id ){
                        Object.assign(eachPile, {
                            status_code: ev_status.data[i].status_code,
                            voltage: parseInt(ev_status.data[i].charge_voltage),
                            current: parseInt(ev_status.data[i].charge_current),
                            current_target: -1,
                            power: parseInt(ev_status.data[i].charge_voltage)*parseInt(ev_status.data[i].charge_current)/1000 ,
                            charge_time: ev_status.data[i].charge_time,
                            charge_kwh: ev_status.data[i].charge_kw,
                            error_code: ev_status.data[i].vendor_error_code,
                            license_plate: ev_status.data[i].licensePlate,
                            soc: ev_status.data[i].soc,
                            mileage: -1,
                            trans_id: "",
                            updated_time: new Date()
                        });
                        break;
                    }
                }
            });
            // get real-time piles data
            
            // if( ev_status.success ){
            //     console.log("ev_status.success", ev_status.success);
            // }
            // console.log(ev_status);
        }
        setResponseStatus(event, 200, `OK`);
        const query = getQuery(event);
        if( query.charger_id ){
            console.log(query.charger_id)
            const result = stationStatus.piles.filter( eachPile => { return eachPile.charger_id == query.charger_id } )[0];
            return JSON.stringify( { success: true, data: result }, null, 4);
        }
        if( query.power != undefined ){
            console.log(query.power)
            return JSON.stringify( { success: true, data: stationStatus.power }, null, 4);
        }
        // console.log(event.node.req);
        return JSON.stringify( { success: true, message: "200 OK", data: stationStatus }, null, 4 );
    }
    else if( calledMethod == "POST" || calledMethod == "PUT" ){
        const body = await readBody(event);
        setResponseHeaders(event, { "Content-Type":"application/json; charset=utf-8" } );
        setResponseStatus(event, 200, `OK`);
        if( body.isPeak != undefined ) {
            stationStatus.isPeak = body.isPeak;
        }
        if( body.isAuto != undefined ) {
            stationStatus.isAuto = body.isAuto;
        }
        if( body.isDR != undefined ) {
            stationStatus.isDR = body.isRD;
        }
        // send from enel electric meter 
        if( body.power != undefined ) {
            stationStatus.power = body.power;
        }
        if( body.powerLimit != undefined ) {
            stationStatus.powerLimit = body.powerLimit;
        }
        if( body.current_target != undefined ) {
            stationStatus.piles.map( d => {
                if ( d.charger_id == body.charger_id ) {
                    d.current_target = body.current_target;
                    d.updated_time = new Date();
                    return ;
                }
            });
        }
        if( body.status_code == 2 ){
            stationStatus.piles.map( d => {
                if( d.charger_id == body.pile.charger_id ){
                    d.status_code = 2;
                    d.voltage = parseInt(body.pile.charge_voltage);
                    d.current = parseInt(body.pile.charge_current);
                    d.charge_kwh = parseInt(body.pile.charge_kwh);
                    d.license_plate = body.pile.licensePlate;
                    d.soc = parseInt(body.pile.soc);
                    d.mileage = parseInt(body.pile.mileage);
                    d.trans_id = body.pile.trans_id;
                    d.updated_time = new Date();
                }
            });
        }
        else if( body.status_code >= 0 ){
            stationStatus.piles.map( d => {
                if( d.charger_id == body.pile.charger_id ){
                    d.status_code = body.status_code;
                    d.voltage = 0;
                    d.current = 0;
                    d.charge_kwh = 0;
                    if( body.status_code != 3 ){
                        d.license_plate = "";
                        d.soc = "";
                        d.mileage = "";
                        d.trans_id = "";
                    }
                    d.updated_time = new Date();
                }
            });
        }
        return JSON.stringify( { success: true, message: "200 OK", data: {} }, null, 4 );
    }
});