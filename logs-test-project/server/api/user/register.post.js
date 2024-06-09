import { MongoClient } from 'mongodb';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (event) => {    
    return new Promise( async (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        const ip = event.node.req.headers['x-forwarded-for'];
        // read cookie
        const user_jwt = parseCookies(event).jwt;
        // read&show body
        const { email, name, department, jobtitle, roles, station, password } = await readBody(event);
        if (!user_jwt) {
            setResponseStatus(event, 401, "Unauthorized");
            resolve( { success: false, message: "Unauthorized" } );
            return ;
        }
        await jwt.verify(user_jwt, runtimeConfig.JWT_SECRET, (error, user) => {
            if (error) {
                // token auth fail
                setResponseStatus(event, 401, "Unauthorized");
                resolve( { success: false, message: "Unauthorized" } );
                return ;
            } 
            else {
                if ( ! user?.roles.includes("neopower") ) {
                    setResponseStatus(event, 403, "Forbidden");
                    resolve( { success: false, message: "Forbidden" } );
                    return ;
                };
            }
        });
        if (!email || !password) {
            setResponseStatus( event, 400, "Missing email or password" );
            resolve( { success: false, message: "Missing email or password" } );
            return ;
        }
        const client = new MongoClient(runtimeConfig.MONGODB_URL);
        try{
            await client.connect();
            const user = await client.db("neopower").collection("users").findOne({ email });
            if (user) {
                setResponseStatus(event, 409, "Email already registered");
                resolve( { success: false, message: "Email already registered" } );
                return ;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const new_user = { name: name, email: email, department: department, jobtitle: jobtitle, roles: roles, station: runtimeConfig.NEOPOWER_STATION_ID, password: hashedPassword };
            const result = await client.db("neopower").collection("users").insertOne(new_user);
            // sendMessageToLineNotify( `使用者新增\nName: ${name}\nMail: ${email}\nRoles: ${roles}\n`, ip);

            setResponseStatus(event, 200, "200 OK");
            resolve( { success: true, message: `A document was inserted with the _id: ${result.insertedId}`} );
        }
        catch(error){
            console.error(error);
            setResponseStatus(event, 500, "Internal Server Error");
            resolve( { success: false, message: `500 Internal Server Error\n${error}` } );
        }
        finally{
            await client.close();
        }
    })
}
export default defineEventHandler( async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    return await register(event);
});