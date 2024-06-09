import elasticsearchConfig from "@/secret/elasticsearch.json"
// import es_ca from "@/secret/ca.crt"
import request from "request"
import fs from "fs"

const runtimeConfig = useRuntimeConfig();

const upload_es = ( charger_id, trans_id, charge_time, charge_current, charge_voltage, charge_kwh, licensePlate, soc, mileage, time )  => {
    // const utc_time = new Date((new Date()).getTime()-8*60*60*1000);
    const yyyymm = dateFormatter( time, "yyyymm" );
    const requestOptions = {
        url: `https://localhost:9200/${runtimeConfig.NEOPOWER_STATION_ID}-charginginfo-${yyyymm}/_doc/`,
        method: "POST",
        json: true,
        headers: { "Content-Type": "application/json", "Authorization": `Apikey ${elasticsearchConfig.apiKey}` },
        auth: elasticsearchConfig.auth,
        ca: fs.readFileSync(elasticsearchConfig.caCertPath),
        body: {
            "keyword_charger_id": charger_id,
            "keyword_charger_name": chargerId2name(charger_id),
            "float_charge_current": parseFloat(charge_current),
            "float_charge_voltage": parseFloat(charge_voltage),
            "float_charge_kwh": parseFloat(charge_kwh),
            "float_charge_power": parseFloat(charge_current*charge_voltage/1000),
            "integer_charge_time": charge_time,
            "keyword_license_plate": licensePlate,
            "integer_mileage": parseInt(mileage),
            "byte_soc": parseInt(soc),
            "keyword_trans_id": trans_id,
            "datetime_time": new Date(time)
        }
    };
    request(requestOptions, (error, response, body) => {
        if (error) {
            console.error(' -- charginginfo ES upload error : ', error);
            return { success: false, message:error };
        } else if ( response.statusCode == 200 || response.statusCode == 201 ) {
            return { success: true, message: response.statusCode, data:body };
        } else {
            return { success: false, message: response.statusCode, data:body };
        }
    });
}
export default defineEventHandler(async (event) => {
    try{
        const runtimeConfig = useRuntimeConfig();
        const headers = getHeaders(event);
        // "neopower" in sha256
        if ( headers["authorization"] == undefined ){
            console.log(`-- [Error]: chargingInfo.post.js, 401`)
            setResponseStatus(event, 401, "Unauthorized");
            return JSON.stringify( { message: "401 Unauthorized" }, null, 4);
        }
        else if ( headers["authorization"] != "2c926e384dbfff6f23b4174e0e64ed0b0d332d73039935c9a8e40a88fe8d5b83" ){
            console.log(`-- [Error]: chargingInfo.post.js, 403`)
            setResponseStatus(event, 403, "Forbidden");
            return JSON.stringify( { message: "403 Forbidden" }, null, 4);
        }
        const body = await readBody(event);
        const { station_id, charger_id, trans_id, charge_time, charge_current, charge_voltage, charge_kwh, licensePlate, soc, mileage, time } = body;
        console.log("\x1b[44m%s\x1b[0m", " [Charging Info  ] ", charger_id, charge_current?.padStart(7, " "), charge_voltage?.padStart(7, " "), licensePlate?.padStart(9, " "), soc?.padStart(4, " "), time);
        console.log(station_id, charger_id, trans_id, charge_time, charge_current, charge_voltage, charge_kwh, soc, time)

        if ( station_id  == undefined || charger_id == undefined || charge_time == undefined || charge_current == undefined || charge_voltage == undefined || charge_kwh == undefined || licensePlate == undefined || soc == undefined || time == undefined ){
            console.log(`-- [Error]: chargingInfo.post.js, 400`)
            setResponseStatus(event, 400, "Bad Request");
            return JSON.stringify( { message: "400 Bad Request" }, null, 4);
        }
        // $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { status_code: 2, pile: body } });
        upload_es( charger_id, trans_id, charge_time, charge_current, charge_voltage, charge_kwh, licensePlate, soc, mileage, time);
        return JSON.stringify( { success: true, message: "200 OK" }, null, 4 );

        // await write2MongoDB(event, station_id, charger_id, trans_id, charge_time, charge_current, charge_voltage, charge_kwh, licensePlate, soc, mileage, time);
        // return await executeStatement(event, station_id, charger_id, trans_id, charge_time, charge_current, charge_voltage, charge_kwh, licensePlate, soc, mileage, time);
    }
    catch(err) {
        console.log(`-- [Error]: chargingInfo.post.js, catch 400`, err)
        setResponseStatus(event, 400, "Bad Request");
        return JSON.stringify( { success: false, message: "400 Bad Request" }, null, 4 );
    }
})