import jwt from "jsonwebtoken";

const logout = async (event) => {
    return new Promise ( async (resolve) => {        
        const runtimeConfig = useRuntimeConfig();
        const userJWT = parseCookies(event).jwt;
        if (userJWT) {
            jwt.verify(userJWT, runtimeConfig.JWT_SECRET, (error, decoded) => {
                if (error) {
                    // token auth fail
                    setResponseStatus(event, 500, "Internal Server Error");
                    resolve( { success: false, message: "You have logged out or token is illegal (expired/not found)" } );
                } 
                else {
                    // destroy token
                    // add token to a block list... or add a expired time
                    setCookie(event, "jwt", "");
                    setResponseStatus(event, 200, "OK");
                    resolve( { success: true, message: "Logout successful" } );
                }
            });
        } else {
            // no token
            setResponseStatus(event, 401, "Unauthorized");
            resolve( { success: false, message: "You have logged out" } );
        }
    });
}
export default defineEventHandler(async (event) => {
    setResponseHeaders(event, { "Content-Type":"application/json; charset=utf-8" } );
    return await logout(event);
});