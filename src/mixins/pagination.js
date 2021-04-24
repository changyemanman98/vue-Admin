let pagination = {
    data(){
        return{
            currentPage : 1,
            pageSize : 2,
            total : 50,
            pageSizes : [2,3,5]
        }
    },
    created(){

    },
    mounted(){
        
    },
    methods: {
        handleSizeChange(val){
            this.tableConfig.requestData.data.pageSize = val;
            this.tableLoadData()
        },
        handleCurrentChange(val){
            this.tableConfig.requestData.data.pageNumber = val;
            this.tableLoadData()
        }
    }
}

export default pagination