import stationConfig from "@/secret/gochabar.json"
import fake_data from "./fake_data.json"

var ev_status_all = { "data": [], "describe": "" };

const get_ev_status_all = async () => {
    setTimeout(get_ev_status_all, 5000);
    try{
        // const gochabar_result = await $fetch(`${stationConfig.host}:${stationConfig.port}/api/ev_status`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json", "Authorization": stationConfig.apikey },
        //     body: { station_id: stationConfig.station_id, charger_id: "" }
        // });
        const gochabar_result = fake_data;
        ev_status_all.data = gochabar_result.data;
    }
    catch ( error ){
        console.error(`[ERROR] @/server/api/v2/ev_status/index.js\n${error}`)
        ev_status_all = { "data": [], "describe": `Get data error from server.\nError: ${error}` };
    }
}
const update_ev_status_all = (piles_arr) => {
    // receive charge current command and write it to ev_status_all
    for( let i=0;i<piles_arr.length;i++ ){
        for( let j=0;j<ev_status_all.data.length;j++ ){
            if( piles_arr[i].charger_id == ev_status_all.data[j].charger_id ){
                ev_status_all.data[j].current_target = piles_arr[i].current_target;
                break;
            }
        }
    }
    return { success: true, message: "200 OK" };
}
get_ev_status_all();
export default defineEventHandler(async (event) => {
    if( event.node.req.method == "GET" ){
        setResponseHeaders(event, { "Content-Type":"application/json; charset=utf-8" } );
        setResponseStatus(event, 200, `OK`);
        return JSON.stringify({success: true, message: "200 OK", data: ev_status_all.data, describe:ev_status_all.describe}, null, 4);
    }
    else if( event.node.req.method == "POST" ){
        const body = await readBody(event);
        return update_ev_status_all(body.data);
    }
});