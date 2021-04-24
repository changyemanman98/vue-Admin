<template>
    <div>
        <el-row :gutter="16">
            <el-col :span="20">
                <div class="label-wrap">
                    <label>关键字：</label>
                    <div class="warp-content">
                        <el-row :gutter="16">
                            <el-col :span="3">
                                <SelectVue :config="data.configOption" :selectData.sync="data.selectData" />
                            </el-col>
                            <el-col :span="5">
                                <el-input v-model="data.key_word" placeholder="请输入搜索的关键字"></el-input>
                            </el-col>
                            <el-col :span="14">
                                <el-button type="danger" @click="search">搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
                <el-button type="danger" class="pull-right" @click="delEditdata()">添加用户</el-button>
            </el-col>
        </el-row>
        <div class="black-space-30">
            <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
                <!-- 插槽 -->
                <template v-slot:status="slotData">
                    <el-switch @change="handleSwitch(slotData.data)" v-model="slotData.data.status" active-value="2" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </template>
                <template v-slot:operation="slotData">
                    <el-button size="small" type="danger" @click="handleDel(slotData.data)">删除</el-button>
                    <el-button size="small" type="success" @click="handleEdit(slotData.data)">编辑</el-button>
                </template>
                <template v-slot:tableFooterLeft>
                    <el-button size="small" @click="handlerBatchDel()">批量删除</el-button>
                </template>
                <!-- 插槽 -->
            </TableVue>
            <!-- 子组件 -->
            <DialogAdd :flag.sync="data.dialog_add" :editData="data.editData" @refreshTableData="refreshData" />
        </div>
    </div>
</template>
<script>
import {ref} from "@vue/composition-api";
import {global} from "@/utils/global_V3.0";
import {reactive} from "@vue/composition-api";
// 下拉选项组件
import SelectVue from "@/components/Select";
// Table组件
import TableVue from "@/components/Table3.0";
import DialogAdd from "./dialog/add";
import {UserDel, UserActives} from "@/api/user";
export default {
    name:"userIndex",
    components: { SelectVue, TableVue, DialogAdd },
    setup(props, {root, refs}){
        const {confirm} = global();
        const userTable = ref(null);
        const data = reactive({
            // table选择的数据
            tableRow: {},
            cityPickerData: {},
            dialog_add: false,
            editData: {},
            configOption: {
                init:["username", "phone"],
            },
            // 下拉菜单的数据
            selectData: { value: "username", label: "姓名" },
            // 搜索关键字
            key_word: "",
            // 阻止状态
            updataUserStatusFlag: false, 
            // table组件配置参数
            configTable: {
                // 多选框
                selection: true,
                // 翻页记录checkbox
                recordCheckbox: true,
                // 表头
                tHead:[
                    {
                        label:"邮箱/用户名", 
                        field:"username"
                    },{
                        label:"真实姓名", 
                        field:"truename"
                    },{
                        label:"手机号", 
                        field:"phone"
                    },{
                        label:"地区", 
                        field:"region"
                    },{
                        label:"角色", 
                        field:"role"
                    },{
                        label:"禁启用状态", 
                        field:"status",
                        conlumnType: "slot",
                        slotName:"status"
                    },{
                        label:"操作", 
                        conlumnType:"slot",
                        slotName:"operation"
                    }
                ],
                // 请求接口URL
                requestData: {
                    url: "getUserList",
                    method: "post",
                    data: {
                        pageNumber: 1,
                        pageSize: 10
                    }
                },
                paginationShow: true,
                paginationLayout: "total, sizes, prev, pager, next, jumper"
            }
        });

        // 搜索
        const search = () => {
            let requestData = {
                [data.selectData.value] : data.key_word
            }
            // 调用组件内的方法
            refs.userTable.paramsLoadData(requestData);
        }

        // 多选删除
        const handlerBatchDel = () => {
            let userId = data.tableRow.idItem
            if(!userId || userId.length === 0){
                root.$message({
                    message:"请勾选需要删除的用户!",
                    type:"error"
                })
                return false;
            }

            confirm(root,{
               content: "确认删除当前信息,删除后无法恢复!",
               tip: "警告",
               fn: userDelete
           })
        }

        // 删除用户
        const userDelete = () => {
            UserDel({id: data.tableRow.idItem}).then(response => {
                // 第一种删除写法
                // refs.userTable.refreshData();
                // 第二种删除写法 
                refreshData();
            }).catch(error => {})
        }

        const refreshData = () => {
            userTable.value.refreshData();
        }

        // 单点删除
        let handleDel = (params) => {
            data.tableRow.idItem = [params.id];
            confirm(root,{
                content: "确认删除当前信息,删除后无法恢复!",
                tip: "警告",
                fn: userDelete
            })
        }

        // 编辑
        const handleEdit = (params) => {
            data.dialog_add = true;
            // 子组件赋值
            data.editData = Object.assign({}, params);
        }

        // 修改用户状态
        const handleSwitch = (params) => {
            UserActives({ id: params.id, status: params.status }).then(response => {
                root.$message({
                    message: response.data.message,
                    type: "success"
                })
            }).catch(error => {})
        }

        const delEditdata = () => {
            data.dialog_add = true,
            data.editData = {}
        }

        return{
            data, 
            userTable,
            refreshData,
            handleDel,
            handlerBatchDel,
            handleEdit,
            handleSwitch,
            search,
            delEditdata
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
.label-wrap {
    @include LabelDom(left, 60, 40);
}
</style>