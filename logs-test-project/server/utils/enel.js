export default async () => {
    return new Promise( async (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        try{
            const station_status = await $fetch(`${runtimeConfig.LOCALHOST}/api/v2/station_status`);
            //! get piles status_code == 2 (charging)
            const chargingData = station_status.data.piles.filter ( (d) => { return d.status_code == 2 } );
            chargingData.map( (d) => d.current = 20);
            Promise.all( chargingData.map( eachData => { 
                return $fetch(`${runtimeConfig.LOCALHOST}/api/v2/charging/set/current`, {
                    method: "POST",
                    body: { charger_id: eachData.charger_id, current: eachData.current }
                })
            }))
            .then( requestResults => {
                const successNumber = requestResults.filter( d => { return d.success == true });
                // sendLog(1, 6, "192.168.2.86", "np01", enelResult.message);
                resolve({ success: true, message: `DR successfully started.\n${successNumber.length} charging piles set to 20A.` });
            })
            .catch( error => {
                // sendLog(1, 0, "192.168.2.86", "np01", enelResult.message);
                resolve({ success: false, message: `DR start failed.\n${error}.` })
            });
        }    
        catch( error ){
            // sendLog(1, 0, "192.168.2.86", "np01", enelResult.message);
            resolve({ success: false, message: `DR start failed.\n${error}.` })
        }
    } )
}