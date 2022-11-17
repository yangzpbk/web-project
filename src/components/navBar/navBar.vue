<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 17:56:53
 * @FilePath: \web-project\src\components\Navbar\Navbar.vue
-->
<template>
  <div>
    <p>{{ formatDate(this.nowDate.getTime()) }}</p>
  </div>
</template>
<script>
export default {
  name:"NavBar",
  data() {
    return {
      // 当前时间
      nowDate: new Date(),
      // 计时器
      timer: null,
      msgList: [],
      total: 0
    }
  },
  mounted() {
    const that = this;
    this.timer = setInterval(() => {
      that.nowDate = new Date();
    }, 1000);
  },
  destroyed() {
    if (this.timer) {
      // 在Vue实例销毁前，清除当前日期定时器
      clearInterval(this.timer);
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // 退出清空tab
        this.$store.state.tagsbar.visitedViews.splice(0, this.$store.state.tagsbar.visitedViews.length);
        this.$router.push('/login');
      })
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
