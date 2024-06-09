const runtimeConfig = useRuntimeConfig();
const calCurrent = async (chargerList, capacityLimit) => {
    
    if(capacityLimit > 100000){
        capacityLimit /= 1000;
    }
    const maxCapacityLimit = 1700;
    let result = [];
    for(let i=0;i<chargerList.length;i++){
        let current = 0;
        if( chargerList[i].soc < 30 && chargerList[i].soc >= 95 ){
            current = 60;
        }
        else if( chargerList[i].soc > 90 ){
            current = 90;
        }
        else{
            current = 180;
        }
        result.push( {
            station_id: "KL_1012",
            charger_id: chargerList[i].charger_id,
            current: parseInt(current)%182
        })
    }
    let totalCurrent = 0;
    for(let i=0;i<result.length;i++){
        totalCurrent += result[i].current;
    }
    if( totalCurrent >= parseInt( capacityLimit*1.5) ){
        console.log(` -- totalCurrent: ${totalCurrent} aaaa`)
        console.log(` -- parseInt( (capacityLimit/1000)*1.5): ${parseInt( capacityLimit*1.5)}`)
        const ratio = ( ( capacityLimit*1.5) / totalCurrent);
        for(let i=0;i<result.length;i++){
            result[i].current =  parseInt(result[i].current * ratio);
            $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`, { method: "PUT", body: { charger_id: result[i].charger_id, current_target: result[i].current }});
        }
    }
    return result;
}
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { chargerList, capacityLimit } = body;
    return await calCurrent(chargerList, capacityLimit);
});