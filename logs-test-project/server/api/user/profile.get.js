import jwt from "jsonwebtoken";

const get_profile = async (event) => {
    return new Promise ( async (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        const user_jwt = parseCookies(event).jwt;
        if (user_jwt) {
            jwt.verify(user_jwt, runtimeConfig.JWT_SECRET, (error, user) => {
                if (error) {
                    // token auth fail
                    setResponseStatus( event, 401, "Unauthorized" );
                    resolve( JSON.stringify( { success: false, message: "Unauthorized" }, null, 4));
                } else {
                    setResponseStatus( event, 200, "OK" );
                    resolve( {
                        success: true,
                        message: "ok",
                        data: {
                            name: user.name,
                            email: user.email,
                            department: user.department,
                            jobtitle: user.jobtitle,
                            roles: user.roles,
                            station: user.station
                        }
                    });
                }
            });
        }
        else {
            // no jwt in cookie
            setResponseStatus( event, 401, "Unauthorized" );
            resolve( { success: false, message: "Unauthorized" } );
        }
    })
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {"Content-Type":"application/json; charset=utf-8"});
    return await get_profile(event)
});