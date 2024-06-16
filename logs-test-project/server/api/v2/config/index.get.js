import stationConfig from "@/secret/gochabar.json"
import stationConfig_default from "@/secret/gochabar_default.json"

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, { "Content-Type":"application/json; charset=utf-8" } );
    setResponseStatus(event, 200, `OK`);
    
    const { defaultConfig } = getQuery(event);
    if( defaultConfig == "" ){
        return JSON.stringify( { success: true, data: stationConfig_default }, null, 4);
    }
    return JSON.stringify( { success: true, data: stationConfig}, null, 4);

});