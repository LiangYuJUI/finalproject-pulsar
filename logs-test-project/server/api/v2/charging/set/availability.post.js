import stationConfig from "@/secret/gochabar.json"

const setAvailability = async (event, charger_id, availability) => {
    return new Promise( async (resolve) => {
        try{
            // const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/set/availability`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
            //     body: {
            //         station_id: stationConfig.station_id,
            //         charger_id: charger_id,
            //         availability: availability
            //     }
            // });
            setResponseStatus(event, 200, `OK`);
            resolve( JSON.stringify( { success: true, message: gochabar_result } ) );
        }
        catch ( error ) {
            setResponseStatus(event, 500, `Internal Server Error`);
            resolve( JSON.stringify( { success: false, message: `500 ${error}` } ) );
        }
        //  Response:
        //      rescode : String, 狀態碼
        //          0000 成功
        //          FFFF 失敗
        //      resmsg : String, 狀態碼說明
    })
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, { "Content-Type":"application/json;charset=utf-8" } );
    const { charger_id, availability } = await readBody(event);
    if( charger_id == undefined, availability == undefined ){
        setResponseStatus(event, 400, `Bad Request`);
        resolve( { success: false, message: `Invalid POST body` } );
    }
    return await setAvailability(event, charger_id, availability);
});