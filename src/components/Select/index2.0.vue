<template>
    <el-select v-model="selectValue" placeholder="请选择">
        <el-option v-for="item in initOptionData" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
</template>
<script>
export default {
    name: "",
    data(){
        return{
            selectValue: "",
            initOptionData: [],
            option: [
                { value: "name", label: "姓名" },
                { value: "phone", label: "手机号" },
                { value: "email", label: "邮箱" },
                { value: "id", label: "ID" },
                { value: "title", label: "标题" }
            ],
        }
    },
    methods:{
        /* 
        * 初始化下拉选项
        */
        initOption(){
            let initData = this.config.init;
            let optionArr = [];
            // 数据校验
            if(initData.length === 0)
            {
                return false;
            }
            initData.forEach(item => {
                let arr = this.option.filter(elem => elem.value == item);  //filter匹配成功后是一个数组,需要取下标第一个
                if(arr.length > 0){
                    optionArr.push(arr[0]);
                }
            })
            // 数据校验
            if(optionArr.length === 0){
                return false;
            }
            // 初始化赋值
            this.initOptionData = optionArr;
            // 初始化搜索类型
            this.selectValue = optionArr[0].value;
        }
    },
    props:{
        config:{
            type: Object,
            default: () => {}
        }
    },
    watch:{
        config:{
            handler(newValue, oldValue){
                this.initOption();
            },
            immediate:true  //组件初始化时,马上对config监听
        }
    }
}
</script>
<style lang="scss" scoped>

</style>