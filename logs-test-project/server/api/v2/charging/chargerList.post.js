import stationConfig from "@/secret/gochabar.json"

const chargerList = async (event) => {
    return new Promise( async (resolve) => {
        try {
            const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/chargerList`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
                body: { station_id: stationConfig.station_id },
            });
            setResponseStatus(event, 200, "OK");
            resolve( JSON.stringify( { success: true, message: gochabar_result } ) );
        }
        catch ( error ) {
            setResponseStatus(event, 500, "Internal Server Error");
            resolve( JSON.stringify( { success: false, message: "500 Internal Server Error" } ) );
        }
        //     }
        // });
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
    setResponseHeaders(event, { "Content-Type":"application/json;charset=utf-8" } );
    return await chargerList( event );
});