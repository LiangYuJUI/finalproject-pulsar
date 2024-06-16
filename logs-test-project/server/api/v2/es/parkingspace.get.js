import elasticsearchConfig from "@/secret/elasticsearch.json"
import fs from "fs"
import request from "request"

const vehicle = (query) => {
    return new Promise( (resolve, reject) => {
        let body = Object.keys(query).length ? { "size":100, "query":{"match_phrase":query} } : { "size":100 }        
        const requestOptions = {
            url: `${elasticsearchConfig.host}/parkingspace/_search`,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Apikey ${elasticsearchConfig.apiKey}`
            },
            auth: elasticsearchConfig.auth,
            ca: fs.readFileSync(elasticsearchConfig.caCertPath),
            body: body
        };
        request(requestOptions, (error, response, body) => {
            // console.log(body)
            if (error) {
                console.error('上傳資料時發生錯誤:', error);
                resolve({"success":false, "message":error});
            } else if (response.statusCode == 200) {
                if (body.hits.hits.length){
                    resolve({"success":true, "message":200, "data":body.hits.hits}, null, 2);
                }
                else{
                    resolve({"success":true, "message":404, "data":[]}, null, 2);
                }
            } else {
                resolve({"success":false, "message":response.statusCode, "data":body}, null, 2);
            }
        });
        
    });
}
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await vehicle(query);
});