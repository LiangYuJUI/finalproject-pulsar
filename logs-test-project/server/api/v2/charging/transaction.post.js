import stationConfig from "@/secret/gochabar.json"
const transaction = async (event, body) => {
    return new Promise( async (resolve) => {
        try {
            // const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/transaction`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
            //     body: {
            //         station_id: body.stationConfig.station_id,
            //         charger_id: body.charger_id,
            //         trans_id: body.trans_id
            //     }
            // });
            setResponseStatus(event, 200, "OK");
            resolve( JSON.stringify( { success: true, message: gochabar_result } ) );
        }
        catch ( error ) {
            console.error("-- Error: /server/api/v2/charging/transaction.post.js", error);
            setResponseStatus(event, response.statusCode, "Internal Server Error");
            resolve( JSON.stringify( { success: false, message: "500" }, null, 4 ) );
        }

        //  Response:
        //      rescode : String, 狀態碼
        //          0000 成功
        //          FFFF 失敗
        //          0002 查無交易單號（或無權限）
        //          0040 參數錯誤
        //      resmsg      : String,   狀態碼說明
        //      station_id  : String,   充電站ID
        //      charger_id  : String,   充電槍ID
        //      gun_in_time : String,   充電槍進車端時間
        //      start_time  : String,   開始充電時間
        //      end_time    : String,   結束充電時間（充電中為空白字串）
        //      update_time : String,   更新充電資訊的時間
        //      charge_time : Integer,  充電秒數
        //      charge_kw   : String,   充電電壓（非充電中為0V） 
    })
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, { "Content-Type":"application/json;charset=utf-8" } );
    const { charger_id, trans_id } = await readBody(event);
    if( charger_id == undefined, trans_id == undefined ){
        setResponseStatus(event, 400, "Bad Request");
        return { success: false, message: "Invalid POST body" } ;
    }
    return await transaction(event, body);
});