const runtimeConfig = useRuntimeConfig();
export default async (message, station_id="", ip="") => {
    let sendMessage = `message=\n${message}\n--\n${(new Date()).toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})} (UTC%2B8)`;
    if(ip.length){
        sendMessage += `\n${ip}`;
    }
    let lineNotifyToken = `Bearer ${runtimeConfig["LINE_NOTIFY_TOKEN"]}`;
    if(station_id == "ENEL"){
        lineNotifyToken = `Bearer ${runtimeConfig["ENEL_LINE_NOTIFY_TOKEN"]}`;
    }
    // return $fetch("https://notify-api.line.me/api/notify", {
    //     method: "POST",
    //     headers: { "Authorization": lineNotifyToken, "Content-Type": "application/x-www-form-urlencoded" },
    //     body: sendMessage
    // }).then( (result) => {
    //     if(result.message = "ok"){
    //         return JSON.stringify( { success: true, message: result.message }, null, 4 );
    //     }
    //     return JSON.stringify( { success: false, message: result.message }, null, 4);
    // }).catch( (error) => {
    //     return JSON.stringify( { success: false, message: error }, null, 4);
    // })
}