import fs from "fs"
import request from "request"
import elasticsearchConfig from "./elasticsearch.json"

const addSchedule = async (event, body) => {
    return new Promise( async (resolve) => {
        if(body.transdate == undefined || body.localid == undefined || body.ticketno == undefined || body.ticketsn == undefined || body.carno == undefined || body.empno == undefined || body.dtloutdate == undefined || body.outtime == undefined || body.lineid == undefined || body.status == undefined || body.rem1 == undefined || body.mileage == undefined || body.dtlbackdate == undefined || body.backtime == undefined || body.rem2 == undefined || body.updatetime == undefined){
            setResponseStatus(event, 400, `Bad Request`);
            resolve( {
                success: false,
                message: `Invalid POST body`
            });
        }
        const requestOptions = {
            url: `${elasticsearchConfig.host}/${elasticsearchConfig.indexName}/_doc/${body.ticketno}`,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Apikey ${elasticsearchConfig.apiKey}`
            },
            auth:{
                "user": "elastic",
                "password": "neopower83515567"
            },
            body: body,
            ca: fs.readFileSync(elasticsearchConfig.caCertPath)
        };
        // 發送請求
        request(requestOptions, (error, response, body) => {
            if (error) {
                console.error('上傳資料時發生錯誤:', error);
                setResponseStatus(event, 500, `Internal Server Error`);
                resolve( {
                    success: false,
                    message: `${error}`
                });
            } else if (response.statusCode == 200 || response.statusCode == 201) {
                setResponseHeaders(event, { "Content-Type":"application/json" });
                setResponseStatus(event, 200, `OK`);
                resolve( JSON.stringify({
                    success: true,
                    message: body
                }));
            } else {
                setResponseStatus(event, response.statusCode, `Internal Server Error`);
                resolve( {
                    success: false,
                    message: `${response.statusCode}`
                });
            }
        });
    })
}
export default defineEventHandler( async (event) => {
    const body = await readBody(event);
    return await addSchedule(event, body);
});