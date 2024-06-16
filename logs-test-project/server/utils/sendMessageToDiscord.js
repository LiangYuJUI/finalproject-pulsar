export default async (title, subtitle, message, level) => {
    const runtimeConfig = useRuntimeConfig();
    // $fetch(runtimeConfig.DISCORD_WEBHOOK_URL.ALERT, {
    //     method: "POST",
    //     body:{
    //         "content": null,
    //         "embeds": [
    //         {
    //             "title": title,
    //             "color": 5375,
    //             "fields": [
    //             {
    //                 "name": subtitle,
    //                 "value": message
    //             }
    //             ],
    //             "footer": {
    //                 "text": "NeoPower EVCMS",
    //                 "icon_url": "https://neopower.com.tw/favicon.ico"
    //             },
    //             "timestamp": `${(new Date()).toISOString()}`
    //         }
    //         ],
    //         "username": `${runtimeConfig.STATION_NAME}系統`,
    //         "avatar_url": "https://neopower.com.tw/favicon.ico",
    //         "attachments": [],
    //         "flags": 4096
    //     }
    // })
}