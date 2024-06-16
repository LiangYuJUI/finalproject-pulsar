const logger = require('./logger')
const dateFormatter =require("./dateFormatter")
const np01_data = require("./data/np01.json")
const logs_from = ["api/v2/charging/stop.post.js", "api/v2/charging/start.post.js"];
const functions = ["stop", "start"]

setInterval(() => {
    let randomNumber_charger_id = Math.floor(Math.random() * 54);
    let randomNumber_function = Math.floor(Math.random() * 2);
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "apikey" },
        body: {
            station_id: "KL_1012",
            charger_id: np01_data.data[randomNumber_charger_id].charger_id,
            trans_id: `NPAM-${np01_data.data[randomNumber_charger_id].charger_id}-${dateFormatter(new Date())}`
        }
    };
    
    logger.info(`Sending request to http://172.17.43.155:54088/api/ev_${functions[randomNumber_function]}`, { 
        station_id: requestOptions.body.station_id,
        charger_id: requestOptions.body.charger_id,
        trans_id: requestOptions.body.trans_id,
        logs_from: logs_from[randomNumber_function], 
        function: functions[randomNumber_function],
        rescode: "0000",
        resmsg: "success"
    });
}, 3000);
