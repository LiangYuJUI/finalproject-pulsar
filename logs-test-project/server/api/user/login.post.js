import { MongoClient } from 'mongodb';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const login = async (event) => {
    return new Promise ( async (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        const ip = event.node.req.headers['x-forwarded-for'];
        const user_agent = event.node.req.headers['user-agent'];
        const { email, password } = await readBody(event);

        if (!email || !password) {
            setResponseStatus( event, 401, "Missing email or password" );
            resolve( { success: false, message: "Missing email or password" } );
            return ;
        }
        const client = new MongoClient(runtimeConfig.MONGODB_URL);
        try {
            await client.connect();
            const user = await client.db("neopower").collection("users").findOne({email});
            if( !user ){
                // user not found
                setResponseStatus(event, 401, "Invalid email or password" );
                resolve( { success: false, message: "Invalid email or password"} );
                return ;
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if( !isPasswordCorrect ){
                sendLog(1, 2, "192.168.2.86", "np01", `${user.name}(${user.email} login failed)`);
                sendMailToUser(user.email, "您剛剛登入失敗了", ip, user_agent);
                // sendMessageToLineNotify(`${user.name} login failed`, ip);
                sendMessageToDiscord("Login failed event", "--", `- Name: ${user.name}\n- Email: ${user.email}\n- station: ${user.station}`);

                setResponseStatus(event, 401, "Invalid email or password");
                resolve( { success: false, message: "Invalid email or password" } );
                return ;
            }
            else{
                const token = jwt.sign({ name: user.name, email: user.email, department: user.department, jobtitle: user.jobtitle, roles: user.roles, station: user.station }, runtimeConfig.JWT_SECRET, { expiresIn: "12h" });
                setCookie(event, "jwt", token);
                sendLog(1, 6, "192.168.2.86", "np01", `${user.name}(${user.email}) login successful)`);
                sendMailToUser(user.email, "您剛剛成功登入了", ip, user_agent);
                // sendMessageToLineNotify(`${user.name} logged in`, ip);
                sendMessageToDiscord("Login event", "--", `- Name: ${user.name}\n- Email: ${user.email}\n- station: ${user.station}`);

                setResponseStatus(event, 200, "OK");
                resolve( { success: true, data: { access_token: token, user:{name: user.name, email:user.email, department: user.department, jobtitle: user.jobtitle, roles: user.roles, station: user.station } } } );
            }
        }
        catch(error) {
            console.error(error);
            sendLog(1, 0, "192.168.2.86", "np01", "login error");
            setResponseStatus(event, 500, "Internal Server Error");
            resolve( { success: false, message: `500 Internal Server Error\n${error}` } );
        }
        finally {
            await client.close();
        }
    })
}
export default defineEventHandler( async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    return await login(event);
});