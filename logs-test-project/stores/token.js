import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', {
    state: () => ({
        isLogin: false,
        user: {},
    }),
    actions: {
        async login(email, pwd) {
            let result = await useFetch("/api/user/login", {
                method: "POST",
                body: {
                    "email": email,
                    "password": pwd
                }
            });
            if( result.data.value.data.access_token ){
                this.isLogin = true;
                this.user = result.data.value.data.user;
            }
            // let jwt = useCookie('jwt', { maxAge: 60 * 60 * 12, httpOnly: true });
            // let user = useCookie('user');
            // jwt.value = result.data.value.data.access_token;
            // user.value = result.data.value.data.user;
            return result;
        },
        async logout() {
            // clear store
            // const jwt = useCookie('jwt');
            let result = await useFetch("/api/user/logout", {
                method: "POST"
            });
            if(result.data.value.success){
                this.isLogin = false;
                this.user = {};
            }
            return result;
        },
        async getProfile() {
            let result = await useFetch("/api/user/profile");
            return result
        },
        async authRole(role) {
            let result = await useFetch("/api/user/auth", {
                method: "POST",
                body:{"role":role}
            });
            return result;
        }
    },
    getters: {
        getIsLogin: (state) => state.isLogin,
        getToken: (state) => state.token,
        // getAuthentication: () => authentication()
    }
})

