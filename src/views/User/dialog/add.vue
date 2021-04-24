<template>
  <el-dialog title="新增" :visible.sync="data.dialog_info_flag" @close="close" @open="openDialog" width="630px" >
    <el-form :model="data.form" ref="addInfoForm" :rules="data.rules" >
        <el-form-item label="用户名：" :label-width="data.formLabelWidth" prop="username">
            <el-input v-model="data.form.username" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="密码：" :label-width="data.formLabelWidth" prop="password">
            <el-input type="password" v-model="data.form.password" placeholder="请输入6-20位字母+数字"></el-input>
        </el-form-item>

        <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop="truename">
            <el-input v-model="data.form.truename" placeholder="请输入姓名"></el-input>
        </el-form-item>
        
        <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop="phone">
            <el-input v-model.number="data.form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        
        <el-form-item label="地区：" :label-width="data.formLabelWidth" prop="region">
            <CityPicker :cityPickerLevel="[]" :cityPickerData.sync="data.cityPickerData" />
        </el-form-item>
        
        <el-form-item label="是否启用：" :label-width="data.formLabelWidth" prop="status">
            <el-radio v-model="data.form.status" label="1">禁用</el-radio>
            <el-radio v-model="data.form.status" label="2">启用</el-radio>
        </el-form-item>
        
        <el-form-item label="角色：" :label-width="data.formLabelWidth" prop="role">
            <el-checkbox-group v-model="data.form.role">
                <el-checkbox v-for="item in data.roleItem" :label="item.role" :key="item.role">{{item.name}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="按钮：" :label-width="data.formLabelWidth">
            <template v-if="data.btnPerm.length > 0">
                <div v-for="item in data.btnPerm">
                    <h4>{{item.name}}</h4>
                    <template v-if="item.perm && item.perm.length > 0">
                        <el-checkbox-group v-model="data.form.btnPerm">
                            <el-checkbox v-for="buttons in item.perm" :label="buttons.value" :key="buttons.value">{{buttons.name}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </div>
            </template>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="danger" @click="submit('addInfoForm')" :loading="data.submitLoading">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import sha1 from "js-sha1";
import { GetSystem, GetRole, UserAdd, GetPermButton, UserEdit } from "@/api/user";
import { ref, reactive, watch } from "@vue/composition-api";
// 组件
import CityPicker from "@/components/CityPicker";
// 正则验证
import { stripscript, validateEmail, validatePass } from "@/utils/validate";
export default {
    name: "dialogInfo",
    //组件
    components: {CityPicker},
    // 单项数据流 父级 >> 子级 不能反向修改
    props:{
        flag:{
            type: Boolean,
            default: false
        },
        editData:{
            type: Object,
            default: () => {}
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
        // 表单验证(vue3.0中,表单验证放在最开头位置)
        // 验证邮箱
        let validateUsername = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入邮箱!"));
            } else if (validateEmail(value)) {
                callback(new Error("邮箱格式错误!"));
            } else {
                callback(); //true
            }
        };
        // 验证密码
        let validatePassword = (rule, value, callback) => {
            /* 
            * 业务逻辑
            * 1 编辑状态
            *   需要检验: data.form.id存在并且, 密码不为空时
            *   不需要检验: data.form.id存在并且, 密码为空时
            * 
            * 2 添加状态
            *   需要检验: data.form.id不存在
            */

            if(data.form.id && !value) {
                callback();
            }
            if((data.form.id && value) || !data.form.id) {
                // 过滤后的数据
                if(value){
                    data.form.password = stripscript(value);
                    value = data.form.password;
                }
                if (value === "") {
                    callback(new Error("请输入密码!"));
                } else if (validatePass(value)) {
                    callback(new Error("密码错误!"));
                } else {
                    callback();
                }
            }
        };

        /* 
        * 数据
        */
        const data = reactive({
                dialog_info_flag: false,  //弹窗标记
                // 城市数据
                cityPickerData: {},
                formLabelWidth: '90px',
                form: {
                    username: "",
                    truename: "",
                    password: "",
                    phone: "",
                    region: "",
                    status: "2",
                    role: [],
                    btnPerm: [],
                    type: []
                },
                rules: ({
                    username: [{ validator: validateUsername, trigger: "blur" }],
                    password: [{ validator: validatePassword, trigger: "blur" }],
                    role: [{required: true, message: "请选择角色", trigger: "change"}]
                }),
                // 角色选择
                roleItem: [],
                // 分类下拉
                categoryOption: [],
                // 按钮权限
                btnPerm: [],
                // 按钮加载
                submitLoading:false
        })

        const getRole = () => {
            if(data.roleItem.length > 0 && data.btnPerm.length > 0) {return false}
            GetRole().then(response => {
                data.roleItem = response.data.data;
            }).catch(error => {})
            GetPermButton().then(response => {
                data.btnPerm = response.data.data;
            }).catch(error => {})
        }

        // vue2.0 methods
        const close = () => {
            data.dialog_info_flag = false;
            data.form = {
                    username: "",
                    truename: "",
                    password: "",
                    phone: "",
                    region: "",
                    status: "2",
                    role: [],
                    btnPerm: [],
                    type: []
            },
            resetForm();
            emit('update:flag', false);
        };

        const resetForm = () => {
            data.cityPickerData = {};
            refs.addInfoForm.resetFields();
        }

        const submit = (formName) => {
            refs[formName].validate((valid) => {
                // 表单验证通过
                if (valid) {
                    // 数据处理
                    let requestData = Object.assign({}, data.form);
                    requestData.role = requestData.role.join();  // 数组转字符串
                    requestData.btnPerm = requestData.btnPerm.join();  // 数组转字符串
                    requestData.region = JSON.stringify(data.cityPickerData);
                    
                    // 添加状态: 需要密码, 并且加密码
                    // 编辑状态: 值存在,需要密码,并且加密码,否则删除
                    if(requestData.id){
                        if(requestData.password){
                            requestData.password = sha1(requestData.password)
                        }else{
                            delete requestData.password;
                        }
                        userEdit(requestData)
                    }else{
                        requestData.password = sha1(requestData.password);
                        userAdd(requestData)
                    }
                } else {
                    return false;
                }
            });
        }

        const userAdd = (requestData) => {
            UserAdd(requestData).then(response => {
                let data = response.data;
                root.$message({
                    message: data.message,
                    type:"success"
                })
                close();
                emit("refreshTableData");
            }).catch(error => {})
        }

        const userEdit = (requestData) => {
            UserEdit(requestData).then(response => {
                let data = response.data;
                root.$message({
                    message: data.message,
                    type:"success"
                })
                close();
                emit("refreshTableData");
            }).catch(error => {})
        }

        /* 
        * 数据引用类型
        */
        // 深拷贝 JSON.parse(JSON.stringify(data.form))  //字符串, 再次转json对象 不能拷贝方法(拷贝出来的方法无效)
        // 浅拷贝 Object.assign({}, data.form)  //拷贝出来的就是一个对象

        // 弹窗打开动画结束时
        const openDialog = () => {
            // 角色请求 + 按钮
            getRole();
            // 初始值处理
            let editData = props.editData;
            if(editData.id){  // 编辑
                editData.role =  editData.role ? editData.role.split(',') : [];  // 转化为数组
                editData.btnPerm =  editData.btnPerm ? editData.btnPerm.split(',') : [];
                // 循环JSON对象
                for(let key in editData) {
                    data.form[key] = editData[key];
                }
            } else{  // 添加
                data.form.id && delete data.form.id;
            }
        }

        return{
            data, close, submit, openDialog
        }
    }

    
};
</script>
<style lang="scss" scoped>
</style>