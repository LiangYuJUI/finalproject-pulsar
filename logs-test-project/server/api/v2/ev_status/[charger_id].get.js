import stationConfig from "@/secret/gochabar.json"
// import apidescribe from "./describe.json"

const ev_status = async (event, charger_id) => {
    return new Promise( async (resolve) => {
        if( charger_id == undefined ){
            setResponseStatus(event, 400, `Bad Request`);
            resolve( { success: false, message: `Invalid POST body` } );
        }
        try{
            const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/ev_status`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
                body: { station_id: stationConfig.station_id, charger_id: charger_id }
            });
            setResponseHeaders(event, { "Content-Type":"application/json" });
            setResponseStatus(event, 200, `OK`);
            resolve( { success: true, message: gochabar_result } );
        }
        catch ( error ){
            console.error('-- Error: /server/api/v2/charging/[charger_id].get.js', error);
            setResponseStatus(event, 500, `Internal Server Error`);
            resolve( { success: false, message: error } );
        }
        //  Response:
        //      rescode : String, 狀態碼
        //          0000 成功
        //          FFFF 失敗
        //          0010 無此充電站ID（或無權限）
        //          0400 參數錯誤
        //      resmsg : String, 狀態碼說明
        //      data   : Array , 該站的充電槍ID
        //          charger_id      : String 充電槍ID
        //          model           : String 設備型號
        //          charger_type    : String 充電介面
    })
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, { "Content-Type":"application/json;charset=UTF-8" });
    const { charger_id } = event.context.params;
    return await ev_status(event, charger_id);
});