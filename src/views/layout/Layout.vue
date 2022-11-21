<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 17:15:53
 * @FilePath: \web-project\src\views\layout\Layout.vue
-->
<template>
  <div class="mainPart">
    <!-- 头部 -->
    <!-- <el-header>
        <nav-bar />
      </el-header> -->

    <!-- 头部以下 -->
    <el-container id="container">
      <!-- 菜单栏 -->
      <el-aside width="180px">
        <side-bar />
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import NavBar from '@/components/navBar/navBar';
import SideBar from '@/components/sideBar/sideBar';
export default {
  name: 'Layout',
  components: { NavBar, SideBar },
}
</script>

<style lang="scss" scoped>
.mainPart {
  height: 100%;
}

#container {
  height: 100%;
}
</style>