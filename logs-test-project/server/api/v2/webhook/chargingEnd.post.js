function sendMsgToDiscord( charger_id, trans_id, start_time, end_time ) {
    return new Promise( async (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        try {
            $fetch(runtimeConfig.DISCORD_WEBHOOK_URL.LOG, {
                method: "POST",
                body:{
                    "content": null,
                    "embeds": [
                    {
                        "title": "Charging stops",
                        "color": 65331,
                        "fields": [
                            {
                                "name": `${charger_id}`,
                                "value": `Trans_id: ${trans_id}\n${start_time} ~ ${end_time}`
                            }
                        ],
                        "footer": {
                            "text": "NeoPower EVCMS",
                            "icon_url": "https://neopower.com.tw/favicon.ico"
                        },
                        "timestamp": `${(new Date()).toISOString()}`
                    }
                    ],
                    "username": `${runtimeConfig.STATION_NAME}系統`,
                    "avatar_url": "https://neopower.com.tw/favicon.ico",
                    "attachments": [],
                    "flags": 4096
                }
            });
            resolve( JSON.stringify( { success: true, message: "200 OK"}, null, 4 ) );
        }
        catch(error){
            resolve( JSON.stringify( { success: false, message: "500 Interal Server Error"}, null, 4 ) );
        }
    })
}
export default defineEventHandler(async (event) => {
    try {
        const headers = getHeaders(event);
        // "neopower" in sha256
        if ( headers["authorization"] == undefined ){
            setResponseStatus(event, 401, "Unauthorized");
            return JSON.stringify( { success: false, message: "401 Unauthorized" }, null, 4 );
        }
        else if ( headers["authorization"] != "2c926e384dbfff6f23b4174e0e64ed0b0d332d73039935c9a8e40a88fe8d5b83" ){
            setResponseStatus(event, 403, "Forbidden");
            return JSON.stringify( { success: false, message: "403 Forbidden" }, null, 4 );
        }
        const body = await readBody(event);
        // console.log("-- chargingEnd.post.js, body:", body)
        const { station_id, charger_id, trans_id, start_time, end_time, gun_in_time, gun_out_time, charge_time, time, charge_kwh, interrupt_type } = body;
        console.log("\x1b[41m%s\x1b[0m", " [Charging End   ] ", charger_id, trans_id, charge_time, charge_kwh, interrupt_type, time);
        if ( station_id == undefined || charger_id == undefined || trans_id == undefined || start_time == undefined || end_time == undefined || gun_in_time == undefined || charge_time == undefined || time == undefined || charge_kwh == undefined || interrupt_type == undefined ){
            setResponseStatus(event, 400, "Bad Request");
            return JSON.stringify( { success: false, message: "400 Bad Request" }, null, 4 );
        }
        sendMsgToDiscord( charger_id, trans_id, start_time, end_time );
        return JSON.stringify( { success: true, message: "200 OK" }, null, 4 );
    }
    catch (error) {
        setResponseStatus(event, 400, "Bad Request");
        return JSON.stringify( { success: false, message: `400 Bad Request ${error}` }, null, 4 );
    }
});