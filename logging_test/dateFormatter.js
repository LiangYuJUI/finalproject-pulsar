function dateFormatter(dtt, formatter=""){
    var dt = new Date(dtt);
    var year = dt.getFullYear();
    var month = String(dt.getMonth() + 1).padStart(2, '0');
    var day = String(dt.getDate()).padStart(2, '0');
    var hours = String(dt.getHours()).padStart(2, '0');
    var minutes = String(dt.getMinutes()).padStart(2, '0');
    var seconds = String(dt.getSeconds()).padStart(2, '0');
    if(formatter == "yyyymmdd"){
        return year + month + day;
    }
    else if(formatter == "yyyymm"){
        return year + month;
    }
    else if(formatter == "-:"){
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
    return year + month + day + hours + minutes + seconds;
}

module.exports = dateFormatter;