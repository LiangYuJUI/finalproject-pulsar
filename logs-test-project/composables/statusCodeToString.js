export default (status_code) => {
    const status_array = ["待機", "準備", "充電", "完成", "?_?", "禁用", "故障", "斷線"];
    return status_array[status_code];
}