import sql from "mssql"
import mssqlConfig from "@/secret/mssql.json"

// YYYYMMDDhhmmss
const dateFormatter = (dtt, formatter="") => {
    var dt = new Date(dtt);
    var year = dt.getFullYear();
    var month = String(dt.getMonth() + 1).padStart(2, '0');
    var day = String(dt.getDate()).padStart(2, '0');
    var hours = String(dt.getHours()).padStart(2, '0');
    var minutes = String(dt.getMinutes()).padStart(2, '0');
    var seconds = String(dt.getSeconds()).padStart(2, '0');
    if(formatter=="-:"){
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
    return year + month + day + hours + minutes + seconds;
}

const schduleHistroy = async (event) => {
    return new Promise( async (resolve) => {
        const now = dateFormatter(new Date(), "-:");
        const mssql_command = `SELECT * FROM [dbo].[chargingScheduleException] WHERE [startDateTime] < '${now}' AND [endDateTime] > '${now}' ORDER BY [startDateTime] DESC`;
        await sql.connect(mssqlConfig)
        const results = await sql.query(mssql_command);
        // await sql.close();
        setResponseHeaders(event, {
            "Content-Type":"application/json",
        });
        setResponseStatus(event, 200, `OK`);
        resolve( JSON.stringify({ 
                success:true, 
                message:"200 OK", 
                data: results.recordsets[0]
            }, null, 4)
        );
    })
} 

export default defineEventHandler(async (event) => {
    return await schduleHistroy(event);
});