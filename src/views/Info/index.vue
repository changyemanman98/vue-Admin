<template>
  <div>
        <el-row :gutter="16">
            <el-col :span="4">
                <div class="label-wrap category">
                    <label for="">类别：</label>
                    <div class="wrap-content">
                    <el-select v-model="category_value" placeholder="请选择" style="width: 100%">
                        <el-option
                        v-for="item in options.category"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
            <div class="label-wrap data">
                <label for="">日期：</label>
                <div class="wrap-content">
                    <el-date-picker
                        style="width: 100%"
                        v-model="date_value"
                        type="datetimerange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="right"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00', '08:00:00']">
                    </el-date-picker>
                </div>
            </div>
            </el-col>
            <el-col :span="3">
                <div class="label-wrap data">
                    <label for="">关键字：</label>
                    <div class="wrap-content key-work">
                        <el-select v-model="search_key" style="width: 100%">
                            <el-option
                                v-for="item in search_option"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="3">
            <el-input v-model="search_keyWork" placeholder="请输入内容" style="width: 100%;"></el-input>
            </el-col>
            <el-col :span="2">
            <el-button type="danger" style="width: 100%;" @click="getList">搜索</el-button>
            </el-col>
            <el-col :span="3" style="height: 40px;">&nbsp;</el-col>
            <el-col :span="2">
            <el-button type="danger" class="pull-right" style="width: 100%;" @click="dialog_info = true;">新增</el-button>
            </el-col>
        </el-row>
        <div class="black-space-30"></div>

        <!-- 表格 -->
        <el-table v-loading="loadingData" :data="table_data.item" border @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="title" label="标题" width="750"></el-table-column>
            <el-table-column prop="categoryId" label="类型" width="130" :formatter="toCategory"></el-table-column>
            <el-table-column prop="createDate" label="日期" width="237" :formatter="toDate"></el-table-column>
            <el-table-column prop="user" label="管理员" width="115"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
                    <el-button type="success" size="mini" @click="editInfo(scope.row.id)">编辑</el-button>
                    <el-button type="success" size="mini" @click="editInfo(scope.row.id)">编辑详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="black-space-30"></div>

        <!-- 底部分页 -->
        <el-row>
            <el-col :span="12">
                <el-button size="medium" @click="deleteAll">批量删除</el-button>
            </el-col>
            <el-col :span="12">
                <el-pagination
                class="pull-right"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[3, 5, 6, 8]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-col>
        </el-row>

        <!-- 新增弹窗 修饰器 :flag.sync -->
        <DialogInfo :flag.sync="dialog_info" :category="options.category" />
        <!-- 修改弹窗 -->
        <DialogEditInfo :flag.sync="dialog_info_edit" :id="infoId" :category="options.category" @getListEdit="getList" />
  </div>
</template>
<script>
import {GetList, DeleteInfo} from "@/api/news";
import {common} from "@/api/common";
import {global} from "@/utils/global_V3.0";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import {timestampToTime} from "@/utils/common";
export default {
  name: "infoIndex",
  components: {DialogInfo, DialogEditInfo},
  setup(props, {root}) {
    const {str, confirm} = global();
    const {getInfoCategory, categoryItem} = common();

    /* 
    * data
    */
   const data = reactive({
       
   })

    /* 
    * ref
    */
    const dialog_info = ref(false);
    const dialog_info_edit = ref(false);
    const category_value = ref("");
    const date_value = ref("");

    const search_key = ref("id");
    const search_keyWork = ref("");
    const total = ref(0);
    const loadingData = ref(false);
    const deleteInfoId = ref("");
    const infoId = ref("");

    /* 
    * reactive
    */
    const options = reactive({
      category: []
    });
    // 页码
    const page = reactive({
        pageNumber: 1,
        pageSize: 3
    })
    
    // 搜索关键词
    const search_option = reactive([
      {
        value: "id",
        label: "ID",
      },
      {
        value: "title",
        label: "标题",
      },
    ]);
    
    // 表格数据
    const table_data = reactive({
        item: []
    });


    /* 
    * 方法 相当于2.0的methods
    */
    const handleSizeChange = (val) => {
        page.pageSize = val;
        getList();
    };
    const handleCurrentChange = (val) => {
        page.pageNumber = val;
        getList();
    };

    const getList = () => {
        // 单独处理数据
        let requestData = formatData();
        loadingData.value = true;

        GetList(requestData).then(response => {
            let data = response.data.data;
            // 更新数据
            table_data.item = data.data;
            // 页码统计数据
            total.value = data.total;
            loadingData.value = false;
        }).catch(error => {loadingData.value = false;})
    };

    // 搜索条件处理
    const formatData = () => {
        let requestData = {
            pageNumber: page.pageNumber,
            pageSize: page.pageSize
        };
        // 分类ID
        if(category_value.value){
            requestData.categoryId = category_value.value
        }
        // 日期
        if(date_value.value.length > 0) {
            requestData.startTime = date_value.value[0];
            requestData.endTiem = date_value.value[1];
        }
        // 关键字
        if(search_keyWork.value){
            requestData[search_key.value] = search_keyWork.value;
        }
        return requestData;
    }

    // 删除数据
    const deleteItem = (id) => {
        deleteInfoId.value = [id];
        confirm(root,{
            content: "确认删除当前信息,确认后无法恢复!",
            tip: "警告",
            fn: confirmDelete
        });
    };

    const deleteAll = () => {
        if(!deleteInfoId || deleteInfoId.length == 0)
        {
            root.$message({
                message:'请选择要删除的数据!',
                type:'error'
            })
            return false;
        }
        confirm(root,{
            content: "确认删除选择的数据,确认后无法恢复!",
            type: "success",
            fn: confirmDelete,
            id:"2222222"
        })
    };

    const confirmDelete = (val) => {
        DeleteInfo({id: deleteInfoId.value}).then(response => {
            deleteInfoId.value = '';
            getList();
        }).catch(error => {})
    };

    const toDate = (row, column, callValue, index) => {
        return timestampToTime(row.createDate);
    }
    
    const toCategory = (row) => {
        // 调用一个函数,替换旧值,返回新值
        let categoryId = row.categoryId;
        let categoryData = options.category.filter(item => item.id == categoryId)[0];
        return categoryData.category_name;
    }

    const handleSelectionChange = (val) => {
        let id = val.map(item => item.id);
        deleteInfoId.value = id;
    }

    const editInfo = (id) => {
        infoId.value = id;
        dialog_info_edit.value = true;
    }
    
    /* 
    * onMounted
    */
    onMounted(() => {
        // VueX
        //   root.$store.dispatch('common/getInfoCategory').then(response => {
        //       options.category = response;
        //   }).catch(error => {})

        // 获取分类
        getInfoCategory();

        // 获取列表
        getList();
    })

    /* 
    * watch
    */
    watch(() => categoryItem.item, (value) => {
      options.category = value;
    })

    return {
        // ref
        category_value, date_value, search_key, search_keyWork, dialog_info, total, loadingData, deleteInfoId, dialog_info_edit, infoId,
        // reactive
        search_option, options, table_data, page,
        // 2.0 methods
        handleSizeChange, handleCurrentChange, deleteItem, deleteAll, confirmDelete, getList, toDate, toCategory, handleSelectionChange, formatData, editInfo
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";

.label-wrap {
    &.category{
        @include LabelDom(left, 60, 40);
    }
    &.data{
        @include LabelDom(right, 93, 40);
    }
    &.key-work{
        @include LabelDom(right, 99, 40);
    }
}
</style>