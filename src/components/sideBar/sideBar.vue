<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 17:57:02
 * @FilePath: \web-project\src\components\SideBar\Sidebar.vue
-->
<template>
  <el-menu class="el-menu" router :default-active="$route.path" default-active="1" @open="handleOpen"
    @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <menu-tree :menuData="menuList"></menu-tree>
  </el-menu>
</template>

<script>
import MenuTree from "@/components/sideBar/components/menuTree.vue"
export default {
  name: "SideBar",
  data() {
    return {
      menuList: []
    };
  },
  components:{
    MenuTree
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