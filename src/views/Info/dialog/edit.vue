<template>
  <el-dialog title="修改" :visible.sync="data.dialog_info_flag" @close="close" width="580px" @open="openDialog">
    <el-form :model="data.form" ref="addInfoForm">
        <el-form-item label="类型：" :label-width="data.formLabelWidth" prop="category">
            <el-select v-model="data.form.category" placeholder="请选择活动区域">
                <el-option v-for="item in data.categoryOption" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="标题：" :label-width="data.formLabelWidth" prop="title">
            <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        
        <el-form-item label="概况：" :label-width="data.formLabelWidth" prop="content">
            <el-input type="textarea" v-model="data.form.content" placeholder="请输入内容"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="danger" @click="submit" :loading="data.submitLoading">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo, GetList, EditInfo } from "@/api/news";
import {ref, reactive, watch} from "@vue/composition-api";
export default {
    name: "dialogInfo",
    // 单项数据流 父级 >> 子级 不能反向修改
    props:{
        flag:{
            type: Boolean,
            default: false
        },
        category:{
            type: Array,
            default: () => []
        },
        id:{
            type: String,
            default: ""
        }
    },
    // 2.0watch监听器
    watch: {
        flag:{
            handler(newValue, oldValue){
                this.data.dialog_info_flag = newValue;
            }
        }
    },
    setup(props, {emit, root, refs}){
        /* 
        * data
        */
       const data = reactive({
            dialog_info_flag: false,
            formLabelWidth: '70px',
            submitLoading: false,
            form: {
                category: '',
                title: '',
                content: ''
            },
            categoryOption: []
       })

        // 3.0使用watch出现无影响错误
        // watch(() => {
        //     data.dialog_info_flag.value = props.flag;
        // });

        // vue2.0 methods
        const close = () => {
            data.dialog_info_flag = false;
            // emit('close', false) 回调父组件的close属性

            emit('update:flag', false);
            // 回调时需要做逻辑处理的时候,不能用修饰器,反之可以用修饰器(修饰器比较简单)

            // 重置表单
            restForm();
        };

        const openDialog = () => {
            data.categoryOption = props.category;
            getInfo();
        }

        const getInfo = () => {
            let requestData = {
                pageNumber: 1,
                pageSize: 1,
                id: props.id
            };
            GetList(requestData).then(response => {
                let responseData = response.data.data.data[0];
                data.form = {
                    category: responseData.categoryId,
                    title: responseData.title,
                    content: responseData.content
                }
            }).catch(error => {})
        }

        const submit = () => {
            let requestData = {
                id: props.id,
                categoryId: data.form.category,
                title: data.form.title,
                content: data.form.content,
            }
            if(!data.form.category){
                root.$message({
                    message: "分类不能为空",
                    type: "error"
                })
                return false;
            }
            
            data.submitLoading = true;
            EditInfo(requestData).then(response => {
                let responseData = response.data;
                root.$message({
                    message:responseData.message,
                    type: 'success'
                })
                data.submitLoading = false;
                /* 
                * 两种刷新数据方式
                * 1.暴力型 直接刷新接口
                * 2.返回列表 手动修改指定的数据
                */
               emit("getListEdit")
                // 重置表单
                refs.addInfoForm.resetFields();
            }).catch(error => {
                data.submitLoading = false;
                refs.addInfoForm.resetFields();
            })
        }

        return{
            // reactive
            data,
            close, openDialog, submit, getInfo
            // function
        }
    }

    
};
</script>
<style lang="scss" scoped>
</style>