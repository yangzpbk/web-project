<template>
  <div class="login-container">
    <!--<img src="../../assets/images/bg/login-logo-dict.png" alt="" class="logo">-->
    <img src="../../assets/images/bg/login-img-left.png" alt="" class="leftImg">

    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="userId">
        <span class="svg-container">
          <svg-icon type="user" />
        </span>
        <el-input
          v-model="loginForm.userId"
          placeholder="请输入账号"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon type="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :type="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="url"
          placeholder="跳转地址"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { strEnc } from '@/utils/des.js';

export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    const validateuserId = (rule, value, callback) => {
      if (!value || value.length === 0) {
        this.$message.error('账号不能为空！');
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!value || value.length === 0) {
        this.$message.error('验证码不能为空！');
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.length === 0) {
        this.$message.error('密码不能为空！');
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userId: '',
        password: '',
        code: ''
      },
      loginRules: {
        userId: [{ required: true, validator: validateuserId, trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined,
      query: null,
      isdev: false,
      desSecretKey: '',
      flag: 'jxydDict',
      url: '/'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        // console.log("route.............", route);
        this.redirect = route.query && route.query.redirect;
        const query = route.query;
        if (this.query && this.query.redirect) {
          delete query.redirect;
        }
        this.query = query;
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    if (process.env.NODE_ENV === 'development') {
      this.loginForm = {
        userId: 'gaofeng',
        password: 'gzyddict@2022',
        code: ''
      }
      this.isdev = true;
    }

    // this.getCaptcha();
    this.qryDesSecretKey();
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;
        if (this.desSecretKey === null || this.desSecretKey === '') {
          this.$message.error('密钥错误!');
          this.loading = false;
          return false;
        }
        const param = {
          userId: this.loginForm.userId,
          password: this.loginForm.password
        }
        this.$store.dispatch('loginByIct', param).then(() => {
          var userId = strEnc(this.loginForm.userId, this.desSecretKey);
          var targetUrl = strEnc(this.url, this.desSecretKey);
          window.location.href = this.gatewayApi.login + '?flag=' + this.flag + '&userId=' + userId + '&targetUrl=' + targetUrl;
        }).catch(() => {
          this.loading = false;
          return false;
        });
      })
    },
    // 查询基础中心配置的加解密key
    qryDesSecretKey() {
      const param = {
        BUSI_INFO: {
          'paraCode': 'DES-SECRET-KEY',
          'parentValueId': this.flag
        },
        OPR_INFO: {
          opTime: '',
          loginNo: ''
        }
      }
      this.$post(this.baseQueryApi.qryParaValues, param).then(data => {
        const rsp = (data.data.ROOT || {}).BODY || {}
        const code = rsp.RETURN_CODE || '9999'
        if (code !== '0') {
          const msg = rsp.RETURN_MSG || '查询服务调用失败'
          throw new Error(msg)
        }
        this.desSecretKey = rsp.OUT_DATA.paraValues[0].valueName;
      }).catch(err => this.$message.error(err.message))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;

    &::first-line {
      color: #000;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-tabs__item {
    font-size: 18px !important;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000 !important;
      height: 47px;
      caret-color: #000;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }

      &::-webkit-input-placeholder {
        color: red !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #dbdbdb;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #000;
  }

  .el-form-item__content {
    overflow: hidden;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('../../assets/images/bg/login-bg.png') no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
  position: relative;

  .logo {
    position: absolute;
    top: 50px;
    left: 120px;
  }

  .leftImg {
    position: absolute;
    top: 220px;
    left: 120px;
  }

  .login-form {
    position: relative;
    max-width: 100%;
    margin: 160px auto;
    overflow: hidden;
    padding: 50px 40px;
    margin-right: 170px;
    width: 400px;
    background-color: #fff;
    box-shadow: 0 0 16px rgba(88, 144, 255, .18);
    border-radius: 10px;

    .el-button {
      margin-bottom: 0 !important;
    }
  }

  .tips {
    font-size: 14px;
    color: #aaa;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #000;
      margin: 0px auto 40px auto;
      text-align: center;
    }

    .set-language {
      color: #ccc;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .register {
    text-align: right;
    margin: 10px 0 30px;
    font-size: 14px;

    span {
      color: #1381EE;
      cursor: pointer;
    }
  }

  .code {
    width: 60%;
    float: left;
  }

  .getCode {
    width: 40%;
    float: left;
    height: 47px !important;
    line-height: 47px !important;
    background: #f5f5f5;
    padding: 0 !important;
    border: none;
    border-left: 1px solid #dbdbdb;
  }
}
</style>
