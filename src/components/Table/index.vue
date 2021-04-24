<template>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <!-- 多选框 -->
            <el-table-column v-if="tableConfig.selection" type="selection" width="50"> </el-table-column>
            <!-- 文本数据渲染 -->
            <template v-for="item in tableConfig.tHead">
                <!-- v-slot -->
                <el-table-column v-if="item.conlumnType === 'slot'" :key="item.field" :prop="item.field" :label="item.label">
                    <template slot-scope="scope">
                        <slot :name="item.slotName" :data="scope.row"></slot>
                    </template>
                </el-table-column>
                <!-- 文本数据渲染 -->
                <el-table-column v-else :key="item.field" :prop="item.field" :label="item.label" width="180"></el-table-column>
            </template>
        </el-table>
        <el-pagination
            v-if="tableConfig.paginationShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout= "tableConfig.paginationLayout"
            :total="total"
            background>
        </el-pagination>
    </div>
</template>
<script>
import tableLoadData from "@/mixins/tableLoadData";
import pagination from "@/mixins/pagination";
export default {
    name: "tableVue",
    mixins: [tableLoadData, pagination],
    data(){
        return{
            tableConfig:{
                selection: true,
                recordCheckbox: false,
                requestData: {},
                tHead: [],
                paginationShow: true,
                paginationLayout: "total, sizes, prev, pager, next, jumper"
            },
            tableData: []
        }
    },
    methods:{
        initTableConfig(){
            let configData = this.config;
            let keys = Object.keys(this.tableConfig);
            for(let key in configData){
                if(keys.includes(key)){  // includes
                    this.tableConfig[key] = configData[key];
                }
            }
        }
    },
    mounted(){
        this.initTableConfig();
    },
    beforeMount(){
        this.initTableConfig();
    },
    props: {
        config:{
            type: Object,
            default: () => {}
        }
    }
}
</script>
<style lang="scss" scoped>

</style>

<!--
初始化的数据, 不需要监听
可以在挂载前预先处理
-->

<!-- 
    v-slot插槽 父组件传值给子组件
    1.匿名插槽: 没有指定某一个插槽, 全部都显示
    2.具名插槽: 指定插槽显示内容
    3. 作用域插槽: 可以进行数据绑定, 父子组件通讯
-->