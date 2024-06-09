function sendMsgToDiscord(charger_id) {
    return new Promise( async (resolve) => {
        try{
            const runtimeConfig = useRuntimeConfig();
            $fetch(runtimeConfig.DISCORD_WEBHOOK_URL.LOG, {
                method: "POST",
                body:{
                    "content": null,
                    "embeds": [
                        {
                        "title": "Charging start",
                        "color": 31487,
                        "fields": [
                            {
                            "name": `${charger_id}`,
                            "value": ``,
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
            })
            resolve( JSON.stringify( { success: true, message: "200 OK"}, null, 4 ) );
        }
        catch ( error ) {
            resolve( JSON.stringify( { success: false, message: "500 Interal Server Error"}, null, 4 ) );
        }
    })
}
export default defineEventHandler(async (event) => {
    try{
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
        const { station_id, charger_id } = body;
        console.log("\x1b[42m%s\x1b[0m", " [Charging Start ] ", charger_id);
        if( station_id == undefined || charger_id == undefined ){
            setResponseStatus(event, 400, "Bad Request");
            return JSON.stringify( { success: false, message: "400 Bad Request" }, null, 4 );
        }
        sendMsgToDiscord( charger_id );
        return JSON.stringify( { success: true, message: "200 OK" }, null, 4 );
    }
    catch {
        setResponseStatus(event, 400, "Bad Request");
        return JSON.stringify( { success: false, message: "400 Bad Request" }, null, 4);
    }
})