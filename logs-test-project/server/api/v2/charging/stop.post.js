import stationConfig from "@/secret/gochabar.json"
const logs_from = "api/v2/charging/stop.post.js";
const runtimeConfig = useRuntimeConfig();

const getTrans_id = async ( charger_id ) => {
    return new Promise ( async (resolve) => {
        // 送出 request
        // logger.info(`Sending request to ${runtimeConfig.LOCALHOST}/api/v2/station_status?charger_id=${charger_id}`, { 
        //     events: JSON.stringify({url: `${runtimeConfig.LOCALHOST}/api/v2/station_status?charger_id=${charger_id}`}), 
        //     logs_from: logs_from, 
        //     function: "getTrans_id"
        // });

        // let result = await $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status?charger_id=${charger_id}`);
        let result = null
        if(result.data.trans_id.length){
            resolve({success: true, data: result.data.trans_id});
        }
        else{
            resolve({success: false, data: {}});
        }
    })
}
const stop = async (event, charger_id) => {
    return new Promise( async (resolve) => {
        // get trans_id by query ==MSSQL== -> Memory from system
        const result = await getTrans_id(charger_id);
        try{
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
                body: {
                    station_id: stationConfig.station_id,
                    charger_id: charger_id,
                    trans_id: result.data
                }
            };

            // 送出 request
            logger.info(`Sending request to ${stationConfig.host}:${stationConfig.port}/api/ev_stop`, { 
                station_id: requestOptions.body.station_id,
                charger_id: requestOptions.body.charger_id,
                trans_id: requestOptions.body.trans_id,
                logs_from: logs_from, 
                function: "stop"
            });

            // const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/ev_stop`, requestOptions);
            const gochabar_result = null

            setResponseStatus(event, 200, "OK");
            resolve( { success: true, message: gochabar_result });
        }
        catch ( error ) {
            // 收到 error
            logger.error(`Error in ${logs_from}`, { events: JSON.stringify(error), logs_from: logs_from, function: "stop"});

            console.error(error);
            setResponseStatus(event, 500, `Internal Server Error`);
            resolve( { success: false, message: `${error}` });
        }
        //  Response:
        //      rescode : String, 狀態碼
        //          0000 成功
        //          FFFF 失敗
        //          0002 失敗（充電槍不是準備充電狀態）
        //          0010 無此充電站ID（或無權限）
        //          0011 無此充電樁ID（或無權限）
        //          0012 無此充電樁的充電槍ID
        //          0040 參數錯誤
        //      resmsg : String, 狀態碼說明
    })
}

export default defineEventHandler(async (event) => {
    // 收到request
    // logger.info('Request received', { events: JSON.stringify({method: event.node.req.method, url: event.node.req.url}), logs_from: logs_from, function: "main"});

    setResponseHeaders(event, { "Content-Type":"application/json;charset=UTF-8" });
    const { charger_id } = await readBody(event);
    if( charger_id == undefined ){
        // 收到 error
        // logger.error(`Error in ${logs_from}`, { events: "charger_id == undefined, 400 Bad Request", logs_from: logs_from, function: "main"});

        setResponseStatus(event, 400, `Bad Request`);
        return { success: false, message: `Invalid POST body` };
    }
    return await stop(event, charger_id);
});