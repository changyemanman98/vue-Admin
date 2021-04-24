<template>
    <el-upload
        class="avatar-uploader"
        :action="config.action"
        :data="data.uploadKey"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="data.imgUrl" :src="data.imgUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import { QiniuToKen } from "@/api/common";
import {ref, reactive, onMounted, watch} from "@vue/composition-api";
export default {
    /* 
    * 1.组件的过程要做什么(七牛云token,显示默认图片,选择图片后渲染自身图片)
    * 2.最终结果要做什么(返回选择后的图片路径)
    */
    name:"uploadImg",
    props:{
        imgUrl:{
            type: String,
            default: ""
        },
        config:{
            type: Object,
            default: ()=>{}
        }
    },
    setup(props,{root, emit}){
        const data = reactive({
            image: "",
            uploadKey:{
                token: "",
                key: ""
            }
        })
        const handleAvatarSuccess = (res, file) =>  {
            let image = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
            data.image = image;
            emit("update:imgUrl", image);
        }

        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                root.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                root.$message.error('上传头像图片大小不能超过 2MB!');
            }

            // 文件名转码
            let suffix = file.name;
            let key = encodeURI(`${suffix}`)
            data.uploadKey.key = key;
            return isJPG && isLt2M;
        }

        /* 
        * 获取七牛云token
        */
        const getQiniuToKen = () => {
            let requestData = {
                "ak": props.config.accesskey,
                "sk": props.config.secretkey,
                "buckety": props.config.buckety
            }
            QiniuToKen(requestData).then(response => {
                data.uploadKey.token = response.data.data.token;
            }).catch(error => {})
        }

        onMounted(() => {
            getQiniuToKen()
        })

        /* 
        * 监听
        */
        watch(() => props.imgUrl, (value) => {
            data.imgUrl = value;
        })

        return{
            data,
            handleAvatarSuccess,
            beforeAvatarUpload
        }
    }
}
</script>

<style lang="scss" scoped>
.el-icon-plus{
  border: 1px dashed #d9d9d9;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-icon-plus:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>