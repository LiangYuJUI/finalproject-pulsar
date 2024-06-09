import jwt from "jsonwebtoken";

export default async (token) => {
    return new Promise( (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        jwt.verify(token, runtimeConfig.JWT_SECRET, async (error, decoded) => {
            if (error) {
                resolve( error );
            }
            else {
                resolve( decoded.name );
            }
        });
    })
}