import elasticsearchConfig from "@/secret/elasticsearch.json"
import fs from "fs"
import request from "request"

const uploadData = async (event, index, body) => {
    return new Promise( (resolve, reject) => {
        const requestOptions = {
            url: `https://localhost:9200/${index}/_doc/`,
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Apikey ${elasticsearchConfig.apiKey}`
            },
            auth: elasticsearchConfig.auth,
            ca: fs.readFileSync(elasticsearchConfig.caCertPath),
            body: body
        };
        request(requestOptions, (error, response, body) => {
            // console.log(body)
            if (error) {
                console.error('上傳資料時發生錯誤:', error);
                resolve({success:false, message:error});
            } else if (response.statusCode == 200 || response.statusCode == 201) {
                if (body.hits.hits.length){
                    resolve({success:true, message: response.statusCode, data:body.hits.hits}, null, 2);
                }
                else{
                    resolve({success:true, message:404, data:[]}, null, 2);
                }
            } else {
                resolve({success:false, message:response.statusCode, data:body}, null, 2);
            }
        });
    });
}
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { index } = event.context.params;
    return await uploadData(event, index, body);
});