import sql from "mssql"
import mssqlConfig from "@/secret/mssql.json"

const schduleHistroy = async (event, schedule_id) => {
    return new Promise( async (resolve) => {
        const mssql_command = `DELETE FROM [dbo].[chargingScheduleException] WHERE [id] = '${schedule_id}'`;
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
                data: results
            }, null, 4)
        );
    })
} 

export default defineEventHandler(async (event) => {
    const { schedule_id } = event.context.params;
    return await schduleHistroy(event, schedule_id);
});

