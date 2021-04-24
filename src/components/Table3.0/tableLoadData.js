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
            // 后台返回数据时并不是返回一个数组, 有时返回一个null, 统一返回一个数组, 无论是否空
                tableData.item = responseData;
                tableData.total = responseData.length === 0 ? 0 : response.data.data.total;
        }).catch(error => {})
    }

    return{
        tableData, tableLoadData
    }
}

/* 
* 业务逻辑
*/