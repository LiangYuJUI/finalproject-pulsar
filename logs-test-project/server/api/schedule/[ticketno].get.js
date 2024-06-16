import fs from "fs"
import request from "request"
import elasticsearchConfig from "./elasticsearch.json"

const getSchedule = async (event, ticketno) => {
    return new Promise( async (resolve) => {
        const requestOptions = {
            url: `${elasticsearchConfig.host}/${elasticsearchConfig.indexName}/_doc/${ticketno}`,
            method: 'GET',
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
            try{
                setResponseHeaders(event, {
                    "Content-Type":"application/json",
                });
                setResponseStatus(event, response.statusCode, response.statusMessage);
                if (error) {
                    console.error('[ERROR] /server/api/schedule/[ticketno].get.js\n', error);
                    resolve( {
                        success: false,
                        message: `${response.statusCode} ${response.statusMessage}`,
                        data: error
                    });
                }
                resolve( {
                    success: true,
                    message: `${response.statusCode} ${response.statusMessage}`,
                    data: body
                } );
            }
            catch(error) {
                console.error(e)
                resolve( {
                    success: false,
                    message: `${response.statusCode} ${response.statusMessage}`,
                    data: error
                });
            }
        });
    })
}
export default defineEventHandler( async (event) => {
    const { ticketno } = event.context.params;
    return await getSchedule(event, ticketno);
});