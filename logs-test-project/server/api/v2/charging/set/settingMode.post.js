import stationConfig from "@/secret/gochabar.json"

const current = async (event, charger_id, charger_limit) => {
    return new Promise( async (resolve) => {
        try {
            // const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/set/settingMode`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
            //     body: {
            //         station_id: stationConfig.station_id,
            //         charger_id: charger_id,
            //         charger_limit: charger_limit
            //     }
            // });
            setResponseStatus(event, 200, `OK`);
            resolve( JSON.stringify( { success: true, message: gochabar_result } ) );
        }
        catch ( error ) {
            setResponseStatus(event, 500, `Internal Server Error`);
            resolve( JSON.stringify( { success: false, message: `${error}` } ) );
        }
        //  Response:
        //      rescode : String, 狀態碼
        //          0000 成功
        //          FFFF 失敗
        //      resmsg : String, 狀態碼說明
        // {
        //     "success": true,
        //     "message": {
        //         "retCode": "0000",
        //         "retMsg": "Success !",
        //         "retData": null
        //     }
        // }
    })
}

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    const { charger_id, charger_limit } = await readBody(event);
    if( charger_id == undefined ){
        setResponseStatus(event, 400, `Bad Request`);
        return { success: false, message: `400 Invalid POST body` };
    }
    return await current(event, charger_id, charger_limit);
});