import { MongoClient, ObjectId } from 'mongodb';
import jwt from "jsonwebtoken";

const runtimeConfig = useRuntimeConfig();

const isManager = async (userJWT) => {
    return new Promise( (resolve) => {
        jwt.verify(userJWT, runtimeConfig.JWT_SECRET, async (error, decoded) => {
            if (error) {
                resolve( false );
            }
            else {
                const { name, email, roles } = decoded;
                resolve( roles.includes("manager") || roles.includes("neopower") );
            }
        });
    })
}
const deleteUser = async (event) => {
    return new Promise ( async(resolve) => {
        const userJWT = parseCookies(event).jwt;
        const _id = event.context.params["_id"];
        const ip = event.node.req.headers["x-forwarded-for"];
        if(!await isManager(userJWT)){
            setResponseStatus(event, 403, "Forbidden");
            resolve( { success: false, message: "Access denied" } );
            return ;
        }
        if (!_id) {
            setResponseStatus(event, 401, "Missing uid");
            resolve( { success: false, message: "Missing uid" } );
            return ;
        }
        const client = new MongoClient(runtimeConfig.MONGODB_URL);
        try{
            await client.connect();
            const user = await client.db("neopower").collection("users").findOne({_id: new ObjectId(_id)});
            if ( (user == null) || (user.email == "ty80517@gmail.com") ) {
                setResponseStatus(event, 401, "Invalid uid");
                resolve( { success: false, message: "Invalid uid" } );
                return ;
            }
            const result = await client.db("neopower").collection("users").deleteOne({ _id: new ObjectId(_id) });
            if ( !result.deletedCount ) {
                setResponseStatus(event, 404, "Not Found");
                resolve( { success: false, message: "Not Found. No users were deleted" } );
                return ;
            }
            if ( !result.acknowledged ) {
                setResponseStatus(event, 500, "Internal Server Error");
                resolve( { success: false, message: "Internal Server Error" } );
                return ;
            }
            else {
                // sendMessageToLineNotify( `使用者刪除\nName: ${user.name}\nMail: ${user.email}\nRoles: ${user.roles}\nStation: ${user.station}`, ip);
                setResponseStatus(event, 200, "OK");
                resolve( { success: true, message: `Successfully deleted. Count: ${result.deletedCount}` } );
            }
        }
        catch ( error ) {
            console.error(error);
            setResponseStatus(event, 500, "Internal Server Error");
            resolve( { success: false, message: error } );
        }
        finally {
            await client.close();
        } 
    })
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    return await deleteUser(event);
});
