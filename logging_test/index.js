const logger = require('./logger')
const dateFormatter = require("./dateFormatter")

const np01_data = require("./data/np01.json")
const np04_data = require("./data/np04.json")
const np03_data = require("./data/np03.json")
const np_data = []
np_data.push(np01_data.data)
np_data.push(np03_data.data)
np_data.push(np04_data.data)
const np_system_id = ["np01", "np03", "np04"]
const station_id = ["KL_1012", "AX_0000", "KL_0004"]

const logs_from = ["api/v2/charging/stop.post.js", "api/v2/charging/start.post.js", "api/v2/charging/set/current.post.js"];
const functions = ["stop", "start", "setCurrent"]
const data_length = [54, 26, 36]

setInterval(() => {
	let random_station_id = Math.floor(Math.random() * 3)
	let random_charger_id = Math.floor(Math.random() * data_length[random_station_id]);
	let random_function = Math.floor(Math.random() * 10);
	if (random_function >= 2) {
		random_function = 2
	}
	let random_error = Math.floor(Math.floor(Math.random() * 100) % Math.floor(Math.random() * 12));
	if (random_error != 1) {
		random_error = 0
	}
	// console.log(random_station_id, random_charger_id, random_function, random_error)
	const error_result = {
		rescode: "FFFF",
		resmsg: "error"
	}
	const success_result = {
		rescode: "0000",
		resmsg: "success"
	}
	const log_options = {
		np_system_id: np_system_id[random_station_id],
		station_id: station_id[random_station_id],
		charger_id: np_data[random_station_id][random_charger_id].charger_id,
		logs_from: logs_from[random_function],
		function: functions[random_function]
	}

	if (random_function == 2) {
		log_options.current = Math.floor(Math.random() * 60) + 120;
	}
	if (random_error) {
		log_options.api_response = JSON.stringify(error_result)
		logger.error(`Error: ${JSON.stringify(error_result)}`, log_options)
	} else {
		log_options.api_response = JSON.stringify(success_result)
		logger.info(`Sending request to http://172.17.43.155:54088/api/ev_${functions[random_function]}`, log_options)
	}
}, 6000);
