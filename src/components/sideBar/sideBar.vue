<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 17:57:02
 * @FilePath: \web-project\src\components\SideBar\Sidebar.vue
-->
<template>
  <el-menu class="el-menu" router :default-active="1" default-active="1" @open="handleOpen"
    @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item index="/404">
        <i class="el-icon-menu"></i>
        <span slot="title">404</span>
      </el-menu-item>
      <el-menu-item index="/401">
        <i class="el-icon-document"></i>
        <span slot="title">401</span>
      </el-menu-item>
      <el-menu-item index="/routeCenter/project/projectList">
        <i class="el-icon-document"></i>
        <span slot="title">projectList</span>
      </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      menuList: []
    };
  },
  created() {
    this.menuList = this.$router.options.routes;
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },

}
</script>

<style lang="scss" scoped>
.el-menu {
  flex: 1;
  height: 100%
}
</style>