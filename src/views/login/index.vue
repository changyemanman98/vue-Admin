<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in MenuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username">
          <label for="Emeil">邮箱</label>
          <el-input
            id="Emeil"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label for="Password">密码</label>
          <el-input
            id="Password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords" v-show="model == 'register'">
          <label for="Passwords">重复密码</label>
          <el-input
            id="Passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <label for="Code">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15"
              ><el-input
                id="Code"
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input
            ></el-col>
            <el-col :span="9"
              ><el-button
                type="success"
                class="block"
                style="height: 36px"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
                >{{ codeButtonStatus.text }}</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="block"
            :disabled="loginButtonStatus"
            >{{ model == "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// base64,md5,sha1 加密
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateCo,
} from "@/utils/validate";

export default {
  name: "login",
  // vue3.0新特性写法
  // setup(props, comtext) {
  setup(props, { refs, root }) {
    // 这里面放data数据 生命周期 自定义的函数

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
      // 过滤密码的特殊字符
      ruleForm.password = stripscript(value);
      value = ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码!"));
      } else if (validatePass(value)) {
        callback(new Error("密码错误!"));
      } else {
        callback();
      }
    };

    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      // 如果使登录界面直接通过(callback())
      if (model.value == "login") {
        callback();
      }

      // 过滤密码的特殊字符
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;

      if (value === "") {
        callback(new Error("请输入密码!"));
      } else if (value != ruleForm.password) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };

    // 验证验证码
    let validateCode = (rule, value, callback) => {
      // 过滤密码的特殊字符
      ruleForm.code = stripscript(value);
      value = ruleForm.code;

      let reg = /^[a-z0-9]{6}$/;
      if (value === "") {
        callback(new Error("请输入验证码!"));
      } else if (validateCo(value)) {
        callback(new Error("验证码错误!"));
      } else {
        callback();
      }
    };

    const MenuTab = reactive([
      {
        txt: "登录",
        current: true,
        type: "login",
      },
      {
        txt: "注册",
        current: false,
        type: "register",
      },
    ]);
    // 模块值
    const model = ref("login");

    // 修改
    const loginButtonStatus = ref(true);

    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码",
    });

    // 倒计时
    const timer = ref(null);

    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: "",
    });
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }],
    });

    /* 
    *1.不建议在一个方法里执行多个不同的事件,尽可能只做自己本身的事情,不做其他人的事情
    *2.尽量把重复执行的代码封装到一个方法中,通过调用函数进行执行
    */

    /*
     *声明函数
     */
    // 切换模块
    const toggleMenu = (data) => {
      MenuTab.forEach((elem, index) => {
        elem.current = false;
      });
      // 高光
      data.current = true;
      // 修改模块值
      model.value = data.type;

      resetFromData()
      // 清除定时器
      clearCountDown()
    };

    // 清除表单数据
    const resetFromData = (() => {
      // 重置表单
      // this.$refs[formName].resetFields(); //2.0
      refs.ruleForm.resetFields(); //3.0
    });

    // 更改验证码按钮状态
    const updataButtonStatus = ((params) => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    });

    /*
     *获取验证码
     */
    const getSms = () => {
      // 进行提示
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空!");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式错误,请重新输入!");
        return false;
      }

      // 修改获取验证按钮状态
      updataButtonStatus({
        status: true,
        text: "发送中"
      });

      // 获取验证码
      let requestData = {
        username: ruleForm.username,
        module: model.value,
      };

      // 延时多长时间
      GetSms(requestData)
        .then((response) => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success",
          });
          // 启用登录或注册按钮
          loginButtonStatus.value = false;
          // 调定时器,倒计时
          countDown(60);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    /*
     *提交表单
     */
    const submitForm = (formName) => {
      
      // 修改
      refs[formName].validate((valid) => {
        if (valid) {
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      root.$router.push({
          name:'Console',
        })
    };

    /* 
    *登录
    1422665422@qq.com
    li1422665422
    */
    const login = (() => {
      let requestData = {
        username:ruleForm.username,
        password:sha1(ruleForm.password),
        code:ruleForm.code,
        module:'register'
      }
      root.$store.dispatch('app/login', requestData).then(response => {
        console.log(response);
        console.log("登录成功");
        // 页面跳转
        root.$router.push({
          name:'Console',
        })  
      }).catch(error => {
        console.log(error);
      })
    });

    /* 
    *注册
    */
    const register = (() => {
       let requestData = {
           username:ruleForm.username,
           password:sha1(ruleForm.password),
           code:ruleForm.code,
           module:'register'
         }
         Register(requestData).then(response => {
           let data = response.data
           root.$message({
             message:data.message,
             type:'success'
           })
          //  跳转到登录
          toggleMenu(MenuTab[0]);
          clearCountDown();
         }).catch(error => {

         })
    });

    /*
     *计时器
     */
    const countDown = ((number) => {
      // setTimeout: cleartimeout(变量) 只执行一次
      // setInterval: clearInterval 不断的执行,需要条件终止

      // 判断定时器是否存在
      if(timer.value)
      {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updataButtonStatus({
            status: false,
            text: "重新获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    });

    /* 
    *清除计时器
    */
    const clearCountDown = (() => {
      updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      clearInterval(timer.value);
    });

    /*
     *生命周期
     */
    // 挂载完成后
    onMounted(() => {});

    return {
      MenuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      toggleMenu,
      getSms,
      submitForm,
      timer,
      clearCountDown
    };
  },
};
</script>

<style lang="scss" scoped>
#login {
  background-color: #344a5f;
  height: 100vh;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
// 表单
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
    text-align: left;
  }
  .block {
    width: 100%;
    display: block;
  }
}
</style>

