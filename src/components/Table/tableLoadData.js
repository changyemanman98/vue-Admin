import { reactive } from '@vue/composition-api';
// 统一Api
import { requestUrl } from "@/api/requestUrl";
import { loadTableData } from "@/api/common";
export function loadData(){
    const tableData = reactive({
        item: [],
        total: 0
    });

    const tableLoadData = (params) => {
        let requestData = {
            url: requestUrl[params.url],
            method: params.mesthod,
            data: params.data
        }
        loadTableData(requestData).then(response => {
            let responseData = response.data.data.data;
            if(responseData && responseData.length > 0){
                tableData.item = responseData;
                tableData.total = response.data.data.total;
            }
        }).catch(error => {})
    }

    return{
        tableData, tableLoadData
    }
}

/* 
* 业务逻辑
*/