import fs from "fs"
import stationConfig from "@/secret/gochabar.json"
import path from "path"

const rootDir = process.env.ROOT_DIR || path.resolve(__dirname, '../../../../');
const filePath = path.join(rootDir, "secret", "gochabar.json");

const setConfig = async (event, body) => {
    return new Promise( (resolve) => {
        try{
            const keys = Object.keys(body);
            const values = Object.values(body);
            keys.map( (d, idx) => { 
                stationConfig[keys[idx]] = values[idx];
            });
            // console.log(stationConfig)
            const result = fs.writeFileSync(filePath, JSON.stringify(stationConfig, null, 4) );
            console.log(result)
            setResponseStatus(event, 200, "OK");
            resolve( { success:true, message: "200 OK" } );
        }
        catch (err) {
            setResponseStatus(event, 500, "Internal Server Error");
            console.log(err)
            resolve(err);
        }
    });
}
// useRequestHeaders(['x-forwarded-for', 'x-real-ip'])
export default defineEventHandler(async (event) => {
    setResponseHeaders( event, { "Content-Type":"application/json; charset=utf-8" } );
    const body = await readBody( event );
    return await setConfig( event, body );
});