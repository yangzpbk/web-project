<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 17:57:02
 * @FilePath: \web-project\src\components\SideBar\Sidebar.vue
-->
<template>
  <div>
    <el-menu class="el-menu" default-active="/" router @open="handleOpen" @close="handleClose">
      <menu-tree :menuList="menuList"></menu-tree>
    </el-menu>
  </div>
</template>
<script>
import MenuTree from "@/components/sideBar/components/menuTree.vue"
export default {
  name: "SideBar",
  components: {
    MenuTree,
  },
  data() {
    return {
      menuList: []
    };
  },
  created() {
    this.menuList = this.$router.options.routes;
    console.log(this.menuList)
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