import fs from "fs"
import request from "request"
import elasticsearchConfig from "./elasticsearch.json"


const getSchedule = async (event) => {
    return new Promise( async (resolve) => {
        const requestOptions = {
            url: `${elasticsearchConfig.host}/${elasticsearchConfig.indexName}/_search`,
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
            body: {
                "size":10000
            },
            "sort": [
                {"ticketno" : "desc"}
            ],
            ca: fs.readFileSync(elasticsearchConfig.caCertPath)
        };
        request(requestOptions, (error, response, body) => {
            try{
                if (error) {
                    console.error('上傳資料時發生錯誤:', error);
                    resolve( {
                        success: false,
                        message: `${error}`
                    }, null, 2);
                } else if (response.statusCode == 200) {
                    console.log(body)
                    if (body.hits.hits.length){
                        setResponseHeaders(event, {
                            "Content-Type":"application/json",
                        });
                        setResponseStatus(event, 200, `OK`);
                        resolve( JSON.stringify({
                            success: true,
                            message: `${error}`,
                            data: body
                        }, null, 2));
                    }
                    else{
                        setResponseStatus(event, 404, `Not Found`);
                        resolve( {
                            success: true,
                            message: `404 Not Found`
                        }, null, 2);
                    }
                } else {
                    setResponseStatus(event, 500, `${response.statusCode}`);
                    resolve( {
                        success: false,
                        message: `${response.statusCode}`
                    }, null, 2);
                }
            }
            catch(error){
                console.error(e)
                setResponseStatus(event, 500, `${response.statusCode}`);
                    resolve( {
                        success: false,
                        message: `${error}`
                    }, null, 2);
            }
        });
    })
}
export default defineEventHandler( async (event) => {
    return await getSchedule(event);
});