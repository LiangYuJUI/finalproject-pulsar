export default defineEventHandler(async (event) => {
    try {
        const runtimeConfig = useRuntimeConfig();
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
        const { station_id, charger_id, status_code, time, vendor_error_code } = body;
        console.log("\x1b[43m%s\x1b[0m", " [Charging Status] ", charger_id, status_code, vendor_error_code, time);
        if ( station_id == undefined || charger_id == undefined || status_code == undefined || time == undefined || vendor_error_code == undefined ){
            setResponseStatus(event, 400, "Bad Request");
            return JSON.stringify( { success: false, message: "400 Bad Request" }, null, 4 );
        }
        $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { status_code: status_code, pile: { charger_id: charger_id, vendor_error_code: vendor_error_code, time: time } } });
        return JSON.stringify( { success: true, message: "200 OK" }, null, 4 );
    }
    catch (error) {
        setResponseStatus(event, 500, "Internal Server Error");
        return JSON.stringify( { success: false, message: "500 Internal Server Error" }, null, 4 );
    }
})