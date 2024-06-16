export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const { message, ip, station_id } = await readBody(event);
    // stickerPackageId=446&stickerId=1988&
    let sendMessage = `message=\n${message}\n--\n${(new Date()).toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})} (UTC%2B8)`;
    if(ip.length){
        sendMessage += `\n${ip}`;
    }
    let lineNotifyToken = `Bearer ${runtimeConfig["LINE_NOTIFY_TOKEN"]}`;
    if(station_id == "ENEL"){
        lineNotifyToken = `Bearer ${runtimeConfig["ENEL_LINE_NOTIFY_TOKEN"]}`;
    }
    return $fetch("https://notify-api.line.me/api/notify", {
        method: "POST",
        headers: { "Authorization": lineNotifyToken, "Content-Type": "application/x-www-form-urlencoded" },
        body: sendMessage
    }).then( (result) => {
        setResponseHeaders(event, { "Content-Type":"application/json", });
        if(result.message = "ok"){
            setResponseStatus(event, 200, "200 OK");
            return JSON.stringify( { success: true, message: result.message }, null, 4 );
        }
        setResponseStatus(event, 500, "Internal Server Error");
        return JSON.stringify( { "success": false, "message": `${result.message}\n${ (new Date()).toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})} (UTC%2B8)` }, null, 4);
    });
});