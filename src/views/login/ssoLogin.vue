<template>
  <div class="warnning">
    系统跳转中,{{ message }},如果跳转不成功，请设置允许弹窗.....
  </div>
</template>

<script>
import { strDec } from '@/utils/des.js';

export default {
  name: 'SsoLogin',
  data() {
    return {
      loginFlag: true,
      code: null,
      redirect: null,
      message: '',
      desSecretKey: '',
      login: {
        userId: null,
        targetUrl: null,
        flag: null
      }
    }
  },
  created() {
    const query = this.$route.query;
    if (!query) {
      this.$message.error('请求参数错误，拒绝跳转!');
      return false;
    }
    this.login.userId = query.userId;
    this.login.targetUrl = query.targetUrl;
    this.login.flag = query.flag;

    if (!this.login.userId) {
      this.$message.error('请求参数错误，拒绝跳转!');
      return false;
    }
    if (!this.login.targetUrl) {
      this.$message.error('请求参数错误，拒绝跳转!');
      return false;
    }
    if (!this.login.flag) {
      this.$message.error('请求参数错误，拒绝跳转!');
      return false;
    }
    this.qryDesSecretKey();
  },
  mounted() {
  },
  methods: {
    getStrDec(str, key) {
      return strDec(str, key);
    },
    handleIctLogin() {
      const param = this.login;
      const _that = this;

      this.$store.dispatch('loginByIct', param).then(() => {
        this.$store.dispatch('GenerateAllRoutes').then(() => {
          if (process.env.NODE_ENV === 'development') {
            this.handleRedirect();
          } else {
            this.$store.dispatch('GetSystemUserFuncMenu').then(() => {
              this.handleRedirect();
            })
          }
        })
        this.loading = false;
        _that.message = '验证完成,开始跳转';
      }).catch(() => {
        this.loading = false;
        this.loginFlag = false;
      });
    },
    handleRedirect() {
      /** 如果是按功能集成，需要调用基础中心接口获取跳转路由信息 */
      const _url = this.loginFlag ? this.login.targetUrl : '/ssoErr';
      window.location.href = _url;
    },
    // 查询基础中心配置的加解密key
    qryDesSecretKey() {
      const param = {
        BUSI_INFO: {
          'paraCode': 'DES-SECRET-KEY',
          'parentValueId': this.login.flag
        },
        OPR_INFO: {
          opTime: this.formatDate(),
          loginNo: this.login.userId
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
        this.login.userId = this.getStrDec(this.login.userId, this.desSecretKey);
        this.login.targetUrl = this.getStrDec(this.login.targetUrl, this.desSecretKey);
        this.redirect = this.login.targetUrl || '/';
        this.message = '参数接收完成,开始验证';
        this.handleIctLogin();
      }).catch(err => this.$message.error(err.message))
    },
    // 时间格式化
    formatDate() {
      const date = new Date();
      const Y = date.getFullYear() + '-';
      const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() + '';
      return Y + M + D + h + m + s;
    }
  }
}
</script>

<style scoped>
  .warnning {
    color: #ff0000;
  }
</style>
