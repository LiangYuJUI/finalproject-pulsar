import { MongoClient } from 'mongodb';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const runtimeConfig = useRuntimeConfig();

const isManager = async (userJWT) => {
    return new Promise( (resolve) => {
        jwt.verify(userJWT, runtimeConfig.JWT_SECRET, async (error, decoded) => {
            if (error) {
                resolve( false );
            }
            else {
                const { roles } = decoded;
                resolve( roles.includes("manager") || roles.includes("neopower") );
            }
        });
    })
}
const isOwner = async (userJWT, updateEmail) => {
    return new Promise( (resolve) => {
        jwt.verify(userJWT, runtimeConfig.JWT_SECRET, async (error, decoded) => {
            if (error) {
                console.error(error);
                resolve( false )
            }
            else {
                const { email } = decoded;
                resolve( updateEmail == email )
            }
        });
    })
}
const update_user = async (event) => {
    return new Promise ( async (resolve) => {
        const userJWT = parseCookies(event).jwt;
        const { name, email, department, jobtitle, roles, password } = await readBody(event);

        if( ! (await isManager(userJWT) || await isOwner(userJWT, email)) ){
            setResponseStatus(event, 403, "Forbidden");
            resolve( { success: false, message: "access denied" } );
        }
        if (!email) {
            setResponseStatus( event, 401, "Missing email" );
            resolve( { success: false, message: "Missing email" } );
        }
        const client = new MongoClient(runtimeConfig.MONGODB_URL);
        try{
            await client.connect();
            const user = await client.db("neopower").collection("users").findOne({ email });
            if (!user) {
                setResponseStatus(event, 401, "Invalid email");
                resolve( { success: false, message: "Invalid email" } );
            }
            let result = "";
            if(password == ""){
                result = await client.db("neopower").collection("users").updateOne({email: email}, {$set: {name: name, email: email, department: department, jobtitle: jobtitle, roles: roles }});
            }
            else{
                result = await client.db("neopower").collection("users").updateOne({email: email}, {$set: {name: name, email: email, password: await bcrypt.hash(password, 10), department: department, jobtitle: jobtitle, roles: roles }});
            }

            if (! result.acknowledged ) {
                setResponseStatus(event, 500, "Internal Server Error");
                resolve( { success: false, message: "Internal Server Error" } );
            }
            if(!result.matchedCount){
                setResponseStatus(event, 404, "Not Found");
                resolve( { success: false, message: "Not Found" } );
            }
            else{
                setResponseStatus(event, 200, "OK");
                resolve( { success: true, message: `Successfully modified. Count: ${result.modifiedCount}` } );
            }
        }
        catch(error){
            setResponseStatus(event, 500, "Internal Server Error");
            resolve( { success: false, message: error} );
        }
        finally{
            await client.close();
        }

    })
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    return await update_user(event);
});