import {reactive} from "@vue/composition-api";
export function paginationHook(){
    const pageData = reactive({
        currentPage : 1,
        pageSize : 2,
        total : 50,
        pageSizes : [2,3,5]
    })

    // 数据变化
    const totalCount = (val) => pageData.total = val;
    const handleSizeChange = (val) => pageData.pageSize = val;
    const handleCurrentChange = (val) => pageData.currentPage = val

    return{
        pageData,
        totalCount,
        handleSizeChange,
        handleCurrentChange
    }
}
