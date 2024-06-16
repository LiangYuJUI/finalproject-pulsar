// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/content', '@nuxt/image-edge', '@pinia/nuxt'],
    postcss: {
        plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': {},
            tailwindcss: {},
            autoprefixer: {},
        }
    },
    content: {
        // https://content.nuxtjs.org/api/configuration
    },
    css: ['@/assets/css/tailwind.css'],
    typescript: {
        typeCheck: true
    },
    app: {
        baseURL: '/np01',
    },
    runtimeConfig: {
        LOCALHOST: process.env.LOCALHOST,
        MONGODB_URL: process.env.MONGODB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        WEBHOOK_HEADER_AUTHORIZATION: process.env.WEBHOOK_HEADER_AUTHORIZATION,
        LINE_NOTIFY_TOKEN: process.env.LINE_NOTIFY_TOKEN,
        ENEL_LINE_NOTIFY_TOKEN: process.env.ENEL_LINE_NOTIFY_TOKEN,
        NEOPOWER_STATION_ID: process.env.NEOPOWER_STATION_ID,
        GOCHABAR_STATION_ID: process.env.GOCHABAR_STATION_ID,
        STATION_NAME: process.env.STATION_NAME,
        MAIL: {
            SENDER: process.env.MAIL_SENDER,
            APPPWD: process.env.MAIL_APPPWD
        },
        DISCORD_WEBHOOK_URL: {
            ALERT:  process.env.DISCORD_WEBHOOK_URL_ALERT,
            LOG:    process.env.DISCORD_WEBHOOK_URL_LOG
        },
    },
    nitro: {
        experimental: {
            openAPI : true,
        }
    }
})