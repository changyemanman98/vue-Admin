<template>
    <div id="category">
        <el-button type="danger" @click="addFirst({type: 'category_first_add'})">添加一级分类</el-button>
        <hr color="#e9e9e9" style="margin-left: -30px; margin-right: -30px;" />
        <div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="category-wrap">
                        <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
                            <!-- 一级分类 -->
                            <h4>
                                <svg-icon icon-class="puls"></svg-icon>
                                {{firstItem.category_name}}
                                <div class="button-group">
                                    <el-button size="mini" type="danger" round @click="editCategory({data: firstItem, type: 'category_first_edit' })">编辑</el-button>
                                    <el-button size="mini" type="success" round @click="handlerAddChildren({data: firstItem, type: 'category_children_add' })">添加子级</el-button>
                                    <el-button size="mini" round @click="deleteCategoryConfirm(firstItem.id)">删除</el-button>
                                </div>
                            </h4>
                            <!-- 子级分类 -->
                            <ul v-if="firstItem.children">
                                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                                    {{childrenItem.category_name}}
                                    <div class="button-group">
                                        <el-button size="mini" type="danger" round>编辑</el-button>
                                        <el-button size="mini" round >删除</el-button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form label-width="142px" class="from-wrap" ref="categoryForm">
                        <el-form-item label="一级分类名称" v-if="category_first_input">
                            <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称" v-if="category_children_input">
                            <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="submit" :loading="submit_button_loading" :disabled="submit_button_disabled">确定</el-button>
                        </el-form-item>
                    </el-form>
                    
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import {AddFirstCategory, DeleteCategory, EditCategory, AddChildrenCategory} from "@/api/news";
import {ref, reactive, onMounted, watch} from "@vue/composition-api";
import {global} from "@/utils/global_V3.0";
import {common} from "@/api/common";
export default {
    name:"category",
    setup(props, {root}){
        // global
        const {confirm} = global();
        const {getInfoCategory, getInfoCategoryAll,  categoryItem} = common();

        /* 
        * ref
        */
        const submit_button_type = ref(''); 
        const category_first_input = ref(true);
        const category_children_input = ref(true);
        const submit_button_loading = ref(false);

        const category_first_disabled = ref(true);
        const category_children_disabled = ref(true);
        const submit_button_disabled = ref(true);
        const deleteId = ref('');

        /* 
        * reactive
        */
        const form = reactive({
          categoryName: '',
          secCategoryName: ''
        });

        const category = reactive({
            item: [],
            current: []
        })

        /* 
        * methods 2.0定义方法
        */
        const submit = () => {
            if(submit_button_type.value == 'category_first_add'){
                addFirstCategory();
            }
            if(submit_button_type.value == 'category_first_edit'){
                editFirstCategory();
            }
            if(submit_button_type.value == 'category_children_add'){
                addChildrenCategory();
            }
        }

        // 确定(添加一级分类)
        const addFirstCategory = () => {
            if(!form.categoryName){
                    root.$message({
                        message: "分类名称不能为空",
                        type: "error"
                    });
                    return false;
            }
            // 按钮加载状态
            submit_button_loading.value = true;
            AddFirstCategory({categoryName: form.categoryName}).then(response => {
                let data = response.data
                if(data.resCode === 0)
                {
                    root.$message({
                        message: data.message,
                        type: "success"
                    });
                    category.item.push(response.data.data);
                }
                submit_button_loading.value = false;
                form.categoryName = '';
                form.secCategoryName = '';
            }).catch(error => {
                submit_button_loading.value = false;
                form.categoryName = '';
                form.secCategoryName = '';
            })
        }

        const addFirst = (params) => {
            submit_button_type.value = params.type;
            category_first_input.value = true;
            category_children_input.value = false;
            category_first_disabled.value = false;
            submit_button_disabled.value = false;
        }

        // 警告删除
        const deleteCategoryConfirm = (categoryID) => {
            deleteId.value = categoryID;
            confirm(root,{
                content: "确认删除当前信息,确认后无法恢复!",
                tip: "警告",
                fn: deleteCategory,
                catchFn: () => {
                    deleteId.value = '';
                }
            });
        }
        // 删除
        const deleteCategory = () => {
            DeleteCategory({categoryId: deleteId.value}).then(response => {
                // let index = category.item.findIndex(item => item.id == deleteId.value);
                // // 删除数组指定元素
                // category.item.splice(index,1);
                
                let newDate = category.item.filter(item => item.id != deleteId.value);
                category.item = newDate;
            }).catch(error => {})
        }

        // 编辑
        const editCategory = (params) => {
            submit_button_type.value = params.type;
            category_first_disabled.value = false;
            category_children_input.value = false;
            submit_button_disabled.value = false;

            // 一级名称输入还原名称
            form.categoryName = params.data.category_name;

            // 存储当前数据对象
            category.current = params.data;
        } 
        const editFirstCategory = () =>{
            if(category.current.length == 0)
            {
                root.$message({
                    message: "未选择分类!",
                    type: 'error'
                })
                return false;
            }
            let requestDate = {
                id: category.current.id,
                categoryName: form.categoryName
            }
            EditCategory(requestDate).then(response => {
                let responseData = response.data;
                root.$message({
                    message: responseData.message,
                    type: 'success'
                })
                category.current.category_name = responseData.data.data.categoryName;
                // 清空输入框文字
                form.categoryName = '';
                category.current = [];
            }).catch(error => {})
        }

        // 添加子级
        const handlerAddChildren = (params) => {
            // 更新确定按钮类型
            submit_button_type.value = params.type;
            // 存储数据
            category.current = params.data;
            // 禁用一级输入框
            category_first_input.value = true;
            // 启用子级输入框
            category_children_disabled.value = false;
            // 启用确定按钮
            submit_button_disabled.value = false;
            // 显示子级输入框
            category_children_input.value = true;
            // 显示一级分类文本
            form.categoryName = params.data.category_name;
        }

        const addChildrenCategory = () => {
            if(!form.secCategoryName)
            {
                root.$message({
                    message:"子级分类名称不能为空",
                    type:"error"
                })
                return false;
            }
            let responseData = {
                categoryName : form.secCategoryName,
                parentId : category.current.id
            }
            AddChildrenCategory(responseData).then(response => {
                let responseData = response.data.data;
                root.$message({
                    message: "子级添加成功!",
                    type: "success"
                })
                // 调用分类列表接口
                getInfoCategoryAll();
                // 清空子级输入框内容
                form.secCategoryName = '';
            }).catch(error => {})
        }

        /* 
        * 生命周期 (onMounted DOM页面挂载完成时执行的函数 替换2.0的mounted)
        */
        onMounted(() => {
            getInfoCategoryAll();
        })

        /* 
        * watch
        */
        watch(() => categoryItem.item, (value) => {
            category.item = value;
        })

        return{
            // ref
            category_first_input, category_children_input, submit_button_loading, category_first_disabled, category_children_disabled, submit_button_disabled, deleteId, submit_button_type,
            // reactive
            form, category,
            // function
            submit, addFirst, deleteCategoryConfirm, deleteCategory, editCategory, addFirstCategory, editFirstCategory, handlerAddChildren, addChildrenCategory
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
.category-wrap{
    div:first-child{
        &:before{top: 20px;}
    }
    div:last-child{
        &:before{bottom: 21px;}
    }
}
.menu-title{
    line-height: 44px;
    padding-left: 22px;
    background-color: #f3f3f3;
}
.category{
    position: relative;
    line-height: 44px;
    cursor: pointer;
    &:before{
        content: '';
        position: absolute;
        left: 22px;
        top: 0;
        bottom: 0;
        width: 32px;
        border-left: 1px dotted #000;
    }
    h4{
        position: relative;
        padding-left: 40px;
    }
    svg{
        position: absolute;
        left: 15px;
        top: 14px;
        background-color: #fff;
    }
    li{
        position: relative;
        padding-left: 40px;
        margin-left: 23px;
        &:before{
            content: '';
            position: absolute;
            top: 22px;
            left: 0;
            width: 32px;
            border-bottom: 1px dotted #000;
        }
    }
    h4, li{
        @include webkit(transition, all .5s ease 0s);
        &:hover{
            background-color: #f3f3f3;
            .button-group{
                display: block;
            }
        }
    }

}
.button-group{
    display: none;
    position: absolute;
    top: -1px;
    font-size: 2;
    right: 11px;
    font-size: 12px;
}
.from-wrap{
    width: 410px;
    padding-top: 26px;
}
</style>