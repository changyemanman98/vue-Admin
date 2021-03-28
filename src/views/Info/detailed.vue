<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="信息分类:">
      <el-select v-model="form.categoryId">
          <el-option v-for="item in data.category" :key="item.id" :value="item.id" :label="item.category_name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="新闻标题:">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="缩略图:">
      <UploadImg :imgUrl.sync="form.imgUrl" :config="upLoadingConfig" />
    </el-form-item>
    <el-form-item label="发布日期:">
        <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" disabled>
        </el-date-picker>
    </el-form-item>
    <el-form-item label="详细内容:">
      <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit" :loading="data.submitLoading">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { GetList, EditInfo } from "@/api/news";
import { ref, reactive, onMounted } from "@vue/composition-api";
import {timestampToTime} from "@/utils/common";
// 富文本编辑器
import { quillEditor } from "vue-quill-editor";
// 组件
import UploadImg from "@/components/UploadImg"; 
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
  name: "InfoDetailed",
  components: {quillEditor, UploadImg},
  setup(props, { root }) {
    // 图片上传配置
    const upLoadingConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "utLRZFGkx2pWCnWbTKb87xKL8-hv1i48457rM-e_",
      secretkey: "NBrI1HdpxgUCU8xbk6iK-mSg6wrcpxDyv0F-QdQZ",
      buckety: "li-vue-project"
    });

    const data = reactive({
        id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
        category: [],
        editorOption: {},
        submitLoading: false,
    })

    const form = reactive({
        categoryId: "",
        title: "",
        createDate: "",
        content: "",
        imgUrl: ""
    })

    // let id = root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
    // let title = root.$route.params.title || root.$store.getters["infoDetailed/infoTitle"];

    /* 
    * 获取信息分类
    */
    const getInfoCategory = () => {
        root.$store.dispatch('common/getInfoCategory').then(response => {
              data.category = response;
          }).catch(error => {})
    }

    /* 
    * 获取当前ID的信息
    */
    const getInfo = () => {
        let requestData = {
            pageNumber: 1,
            pageSize: 1,
            id: data.id
        };
        GetList(requestData).then(response => {
            let responseData = response.data.data.data[0];
            form.categoryId = responseData.categoryId;
            form.title = responseData.title;
            form.createDate = timestampToTime(responseData.createDate);
            form.content = responseData.content;
        }).catch(error => {})
    }

    /* 
    * 保存
    */
    const submit = () => {
        let requestData = {
            id: data.id,
            categoryId: form.categoryId,
            title: form.title,
            content: form.content,
            imgUrl: form.imgUrl
        }
        
        data.submitLoading = true;
        EditInfo(requestData).then(response => {
            let responseData = response.data;
            root.$message({
                message:responseData.message,
                type: 'success'
            })
            data.submitLoading = false;
        }).catch(error => {
            data.submitLoading = false;
            refs.addInfoForm.resetFields();
        })
    }

    onMounted(() => {
        getInfoCategory(),
        getInfo()
    })

    return{
        // reactive
        data, form, upLoadingConfig,
        // function
        submit
    }
  },
};
</script>

<style lang="scss" scoped>

</style>