import sql from "mssql"
import mssqlConfig from "@/secret/mssql.json"

const schduleHistroy = async (event) => {
    return new Promise( async (resolve) => {
        const mssql_command = `SELECT * FROM [dbo].[chargingScheduleException] ORDER BY [startDateTime]`;
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