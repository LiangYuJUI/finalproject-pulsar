import jwt from "jsonwebtoken";

const authRole = async (event) => {
    return new Promise( async (resolve) => {
        const body = await readBody(event);
        const runtimeConfig = useRuntimeConfig();
        const cookies = parseCookies(event);
        const token = cookies.jwt;
        if (token) {
            jwt.verify(token, runtimeConfig.JWT_SECRET, (error, user) => {
                if (error) {
                    // token verify fail
                    setResponseStatus(event, 403, "Forbidden");
                    resolve( { success: false, message: "Forbidden" } );
                } 
                else {
                    if ( user.roles.includes(body.role) ) {
                        setResponseStatus(event, 200, "OK");
                        resolve( {
                            success: true,
                            message: "Authorized",
                            data: { access_token: token,
                                user: { 
                                    name: user.name,
                                    email: user.email,
                                    department: user.department,
                                    jobtitle: user.jobtitle,
                                    roles: user.roles,
                                    station: user.station
                                }
                            }
                        });
                    }
                    else {
                        setResponseStatus(event, 403, "Forbidden");
                        resolve( { success: false, message: "Forbidden" } );
                    }
                }
            });
        } 
        else {
            // no token provide
            setResponseStatus( event, 401, "Unauthorized" );
            resolve( { success: false, message: "Unauthorized" } );
        }
    })
}
export default defineEventHandler(async (event) => {
    setResponseHeaders( event, { "Content-Type":"application/json; charset=utf-8" } );

    return await authRole(event);
});