import elasticsearchConfig from "@/secret/elasticsearch.json"
import request from "request"
import fs from "fs"
const runtimeConfig = useRuntimeConfig();
const dateFormatter = (dtt, formatter="yyyymmdd") => {
    var dt = new Date(dtt);
    var year = dt.getFullYear();
    var month = String(dt.getMonth() + 1).padStart(2, '0');
    var day = String(dt.getDate()).padStart(2, '0');
    var hours = String(dt.getHours()).padStart(2, '0');
    var minutes = String(dt.getMinutes()).padStart(2, '0');
    var seconds = String(dt.getSeconds()).padStart(2, '0');
    if(formatter.toLowerCase() == "yyyymmdd" ){
        return year + month + day;
    }
    else if( formatter.toLowerCase() == "yyyymm" ) {
        return year + month;
    }
    return year + month + day + hours + minutes + seconds;
}
const upload_es = (power) => {
    // const utc_time = new Date((new Date()).getTime()-8*60*60*1000);
    const time = new Date();
    const yyyymm = dateFormatter( time, "yyyymm" );
    const requestOptions = {
        url: `https://localhost:9200/${runtimeConfig.NEOPOWER_STATION_ID}-power-${yyyymm}/_doc/`,
        method: "POST",
        json: true,
        headers: { "Content-Type": "application/json", "Authorization": `Apikey ${elasticsearchConfig.apiKey}` },
        auth: elasticsearchConfig.auth,
        ca: fs.readFileSync(elasticsearchConfig.caCertPath),
        body: {
            "float_power": power,
            "datetime_time": time
        }
    };
    request(requestOptions, (error, response, body) => {
        if (error) {
            console.error(' -- charginginfo ES upload error : ', error);
            return {success:false, message:error};
        }
        else if (response.statusCode == 200 || response.statusCode == 201) {
            return { success:true, message: response.statusCode, data:body };
        }
        else {
            return { success:false, message:response.statusCode, data:body };
        }
    });
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    setResponseStatus(event, 200, "OK");
    const runtimeConfig = useRuntimeConfig();
    // const ip = event.node.req.headers['x-forwarded-for'];
    const headers = getHeaders(event);

    if(headers["authorization"] != "43c05f600904184e5a16732e579a928e89f3264bedfd391cb3145f617e64cf0e"){
        setResponseStatus(event, 403, "Forbidden");
        return JSON.stringify( { success: false, message: "Forbidden" }, null, 4)
    }

    const { power } = await readBody(event);
    if ( isNaN(power) ) {
        setResponseStatus(event, 400, "Bad Request");
        return JSON.stringify( { success: false, message: "400 Invalid POST body" }, null, 4 );
    }
    console.log( (new Date()).toLocaleString('zh', { year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}), `  ${power} kW`, "api/v2/webhook/power");
    upload_es(power);
    $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { power: power } });
    setResponseStatus(event, 200, "OK");
    return JSON.stringify( { success: true, message: "200 OK" }, null, 4 );
})
