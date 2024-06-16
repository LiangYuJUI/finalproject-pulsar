import stationConfig from "@/secret/gochabar.json"

const runtimeConfig = useRuntimeConfig();

const setChargeTargetInfo = ( charger_id, current_target ) => {
    $fetch(`${runtimeConfig.LOCALHOST}/api/v2/ev_status`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: {
            data:[{
                charger_id:charger_id,
                current_target:current_target
            }]
        }
    })
    return ;
}
const setCurrent = async ( event, charger_id, current ) => {
    return new Promise( async (resolve) => {
        try {
            // const gochabar_result = $fetch(`${stationConfig.host}:${stationConfig.port}/api/set/current`, { 
            //     method: "POST",
            //     headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
            //     body: { station_id: stationConfig.station_id, charger_id: charger_id, current: current }
            // });
            setChargeTargetInfo(charger_id, current);
            setResponseStatus(event, 200, `OK`);
            resolve( JSON.stringify( { success: true, message: gochabar_result } ) );
        }
        catch ( error ) {
            console.error( error );
            setResponseStatus(event, 500, `Internal Server Error`);
            resolve( JSON.stringify( { success: false, message: `${error}` } ) );
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
    const { charger_id, current } = await readBody(event);
    if ( charger_id == undefined, current == undefined ){
        setResponseStatus(event, 400, `Bad Request`);
        resolve( JSON.stringify( { success: false, message: `Invalid POST body` } ) );
    }
    return await setCurrent(event, charger_id, current);
});