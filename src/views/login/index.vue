<template>
  <div class="container-login">
    <el-card>
      <img src="../../assets/04.png" alt />
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" status-icon>
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            style="width:240px;margin-right:8px"
            placeholder="请输入验证码"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入封装获取用户信息的方法
import Auth from "@/unitls/auth";
export default {
  name: "page-login",
  data() {
    var checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}/.test(value)) {
        callback();
      } else {
        callback(new Error("手机号不正确"));
      }
    };
    return {
      loginForm: {
        mobile: "13945674567",
        code: "246810"
      },
      loginRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { len: 6, message: "请输入6个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$http
            .post("authorizations", this.loginForm)
            .then(res => {
              // 保存用户信息并跳转页面
              Auth.setUser(res.data.data);
              this.$router.push("/");
            })
            .catch(err => {
              this.$message.error("手机号或者验证码错误");
            });
        }
      });
    }
  }
};
</script>

<style  lang="less" scoped>
.container-login {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url(../../assets/login_bg.jpg) no-repeat center/cover;
  .el-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      display: block;

      height: 45px;
      margin: 0 auto 20px;
    }
  }
}
</style>