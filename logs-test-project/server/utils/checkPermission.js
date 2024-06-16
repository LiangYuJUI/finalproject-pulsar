import jwt from "jsonwebtoken";

export default async (token, role) => {
    return new Promise( (resolve) => {
        const runtimeConfig = useRuntimeConfig();
        jwt.verify(token, runtimeConfig.JWT_SECRET, async (error, decoded) => {
            if (error) {
                resolve( false );
            }
            else {
                const { roles } = decoded;
                resolve( roles.includes(role) );
            }
        });
    })
}