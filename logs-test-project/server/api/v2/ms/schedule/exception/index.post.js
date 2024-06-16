import sql from "mssql"
import mssqlConfig from "@/secret/mssql.json"

const addSchedule = async (event, startDateTime, endDateTime, capacityLimit, createDateTime, createdBy) => {
    return new Promise( async (resolve) => {
        const mssql_command = `INSERT INTO [chargingScheduleException] ([startDateTime], [endDateTime], [capacityLimit], [createDateTime], [createdBy]) VALUES ('${startDateTime}', '${endDateTime}', ${capacityLimit}, '${createDateTime}', N'${createdBy}')`;
        await sql.connect(mssqlConfig)
        const results = await sql.query(mssql_command);
        // await sql.close();
        setResponseHeaders(event, {
            "Content-Type":"application/json",
        });
        setResponseStatus(event, 200, `OK`);
        resolve( JSON.stringify({ 
                success:true, 
                message:`200 OK, ${results}`, 
            }, null, 4)
        );

    })
} 

export default defineEventHandler(async (event) => {
    const { startDateTime, endDateTime, capacityLimit, createDateTime, createdBy } = await readBody(event);
    console.log(startDateTime, endDateTime, capacityLimit, createDateTime, createdBy)
    return await addSchedule(event, startDateTime, endDateTime, capacityLimit, createDateTime, createdBy);
});