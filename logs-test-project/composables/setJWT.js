import { useTokenStore } from '../stores/token'
const tokenStore = useTokenStore()

export const setJWT = () => {
    const JWTToken = useCookie('jwt', { maxAge: 60 * 60 * 24 * 30, httpOnly: true });
    JWTToken.value = tokenStore.getToken;
}
