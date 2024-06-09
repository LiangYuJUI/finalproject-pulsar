import { useTokenStore } from '../stores/token'


export default defineNuxtRouteMiddleware( async (to, from) => {
    const tokenStore = useTokenStore();

    // console.log(tokenStore.isLogin, tokenStore.isLogin, tokenStore.isLogin)
    // if ( process.client ){
    //     if (!tokenStore.isLogin){
    //         const result = await tokenStore.authRole("viewer");
    //         console.log(`result`)
    //         console.log(result.error)
    //         if (result.error){
    //             if( from && to.path !== from.path && !to.query.redirect_to ){
    //                 // alert(`${result.error.value.message}`)
    //                 return navigateTo("/login")
    //             }
    //         }
    //         else{
    //             tokenStore.user = result.data.user;
    //             tokenStore.isLogin = true;
    //             console.log(tokenStore.user)
    //             console.log(result.data.user)
    //         }
    //     }
    // }
    const headers = useRequestHeaders(['x-forwarded-for', 'x-real-ip']);
    const runtimeConfig = useRuntimeConfig();
    // await tokenStore.getProfile()
    await prefetchComponents('login');
    await preloadComponents('login');
    
    preloadRouteComponents('/login');
    if (process.client) {
        const result = await tokenStore.authRole("viewer");
        if (result.error.value && !tokenStore.isLogin){
            if(to.path !== `/login`){
                alert("Unauthorized");
                return await navigateTo(`/login`);
            }
        }
        else{
            if( !tokenStore.isLogin ){
                const result = await tokenStore.getProfile()
                if (!result.error.value) {
                    tokenStore.isLogin = true;
                    tokenStore.user = result.data.value.data;
                }
            }            
        }
    }
    if(process.server){
        const user = await tokenStore.getProfile()
        // console.log("\x1b[40m\x1b[37m%s\x1b[0m", ` [@/middleware/auth-viewer.global.js] from: ${from?.path}, to: ${to?.path}, ${headers['x-forwarded-for']}, ${headers['x-real-ip']}`)
        // console.log( user?.data?.value?.data?.name, user?.data?.value?.data?.email, user?.data?.value?.data?.roles )
    }
})
