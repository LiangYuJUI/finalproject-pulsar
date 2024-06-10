const logger = require('./logger')

const logs_from = "api/v2/charging/stop.post.js";
const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "apikey" },
    body: {
        station_id: "np01",
        charger_id: "KKKKN01",
        trans_id: "trans-test"
    }
};

logger.info(`Sending request to http://172.17.43.155:54088/api/ev_stop`, { 
	station_id: requestOptions.body.station_id,
	charger_id: requestOptions.body.charger_id,
	trans_id: requestOptions.body.trans_id,
	logs_from: logs_from, 
	function: "stop"
});