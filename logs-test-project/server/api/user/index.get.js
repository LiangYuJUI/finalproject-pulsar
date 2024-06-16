import { MongoClient } from 'mongodb';

const getUsers = async (event) => {
    return new Promise ( async (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        
        // read jwt from cookie
        const userJWT = parseCookies(event).jwt;

        // check permission
        if ( ! userJWT ){
            setResponseStatus(event, 401, "Unauthorized");
            resolve( { success: false, message: "Unauthorized" } );
            return ;
        }
        else if( ! (await checkPermission(userJWT, "manager") ) ){
            setResponseStatus(event, 403, "Forbidden");
            resolve( { success: false, message: "Forbidden" } );
            return ;
        }
        
        const client = new MongoClient(runtimeConfig.MONGODB_URL);
        try {
            await client.connect();
            // const result = await client.db("evcms").collection("user").findOne({ name: "黃翊唐" });
            // await User.find({}) return the user list
            const result = await client.db("neopower").collection("users").find({}).toArray();
            setResponseStatus(event, 200, "OK");
            resolve( { success: true, data: result} );
        }
        catch(error) {
            console.error(error);
            setResponseStatus(event, 500, "Internal Server Error");
            resolve( { success: false, message: `500 Internal Server Error\n${error}`} );
        }
        finally {
            await client.close();
        }
    })
}

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    return await getUsers(event)
});