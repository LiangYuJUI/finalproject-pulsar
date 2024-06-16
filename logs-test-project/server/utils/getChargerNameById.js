import stationConfig from "@/secret/gochabar.json"
export default async (charger_id) => {
    for(let i=0;i<stationConfig.charger_list.length;i++){
        if(stationConfig.charger_list[i].charger_id == charger_id){
            return stationConfig.charger_list[i].charger_name;
        }
    }
}