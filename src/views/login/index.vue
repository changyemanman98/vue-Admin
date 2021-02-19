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
          <label>邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label>密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords" v-show="model == 'register'">
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <label>验证码</label>
          <el-row :gutter="11">
            <el-col :span="15"><el-input v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input></el-col>
            <el-col :span="9"><el-button type="success" class="block" style="height:36px;">获取验证码</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="block"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {stripscript, validateEmail, validatePass, validateCo} from "@/utils/validate"

export default {
  data() {
    // 验证邮箱
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱!"));
      } else if(validateEmail(value)) {
        callback(new Error("邮箱格式错误!"));
      } else {
        callback(); //true
      }
    };

    // 验证密码
    var validatePassword = (rule, value, callback) => {
      // 过滤密码的特殊字符
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码!"));
      } else if (validatePass(value)) {
        callback(new Error("密码错误!"));
      } else {
        callback();
      }
    };

    // 验证重复密码
    var validatePasswords = (rule, value, callback) => {
      // 如果使登录界面直接通过(callback())
      if(this.model == "login")
      {
        callback();
      }

      // 过滤密码的特殊字符
      this.ruleForm.passwords = stripscript(value);
      value = this.ruleForm.passwords;

      if (value === "") {
        callback(new Error("请输入密码!"));
      } else if (value != this.ruleForm.password) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };

    // 验证验证码
    var validateCode = (rule, value, callback) => {
      // 过滤密码的特殊字符
      this.ruleForm.code = stripscript(value);
      value = this.ruleForm.code;

      let reg = /^[a-z0-9]{6}$/;
      if (value === "") {
        callback(new Error("请输入验证码!"));
      } else if (validateCo(value)) {
        callback(new Error("验证码错误!"));
      } else {
        callback();
      }
    };
    return {
      MenuTab: [
        {
          txt: "登录",
          current: true,
          type:"login"
        },
        {
          txt: "注册",
          current: false,
          type:"register"
        },
      ],
      // model
      model: "login",
      // 表单
      ruleForm: {
        username: "",
        password: "",
        passwords: "",
        code: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        passwords: [{ validator: validatePasswords, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
      },
    };
  },
  created() {},
  mounted() {},
  // 编写函数
  methods: {
    toggleMenu(data) {
      this.MenuTab.forEach((e) => {
        e.current = false;
      });
      data.current = true;

      this.model = data.type;
    },
    // 表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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