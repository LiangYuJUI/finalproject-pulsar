import fs from "fs"
import request from "request"
import elasticsearchConfig from "./elasticsearch.json"

const deleteSchedule = async (event, ticketno) => {
    return new Promise( async (resolve) => {
        console.log(ticketno)
        setResponseHeaders(event, {
            "Content-Type":"application/json",
        });
        const requestOptions = {
            url: `${elasticsearchConfig.host}/${elasticsearchConfig.indexName}/_doc/${ticketno}`,
            method: 'DELETE',
            json: true,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Apikey ${elasticsearchConfig.apiKey}`
            },
            auth:{
                "user": "elastic",
                "password": "neopower83515567"
            },
            ca: fs.readFileSync(elasticsearchConfig.caCertPath)
        };
        request(requestOptions, (error, response, body) => {
            if (error) {
                console.error('[DELETE] ERROR:', error);
                setResponseStatus(event, 500, `Internal Server Error`);
                resolve( {
                    success: false,
                    message: `${error}`
                });
            } else if (response.statusCode == 200) {
                console.log('[DELETE] SUCCESS:', ticketno)
                setResponseStatus(event, 200, `OK`);
                resolve( {
                    success: true,
                    message: `200 OK`
                });
            } else {
                console.log('[DELETE] ERROR:', response.statusCode, ticketno)
                setResponseStatus(event, 404, `Not Found`);
                resolve( {
                    success: false,
                    message: `404 Not Found`
                });
            }
        });
    })
}
export default defineEventHandler( async (event) => {
    const { ticketno } = event.context.params;
    return await deleteSchedule(event, ticketno);
});