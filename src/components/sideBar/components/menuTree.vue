<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-21 09:56:13
 * @FilePath: \web-project\src\components\sideBar\components\menuTree.vue
-->
<template>
    <div>
        <template v-for="menu in this.menuData" :key="menu.index">
            <el-submenu :key="menu.index" :index="menu.index" v-if="menu.children">
                <template slot="title">
                    <i :class="menu.icon"></i>
                    <span slot="title">{{ menu.name }}</span>
                </template>
                <menu-tree :menuData="menu.children"></menu-tree>
            </el-submenu>
            <el-menu-item :key="menu.index + 1" :index="menu.index" v-else>
                <i :class="menu.icon"></i>
                <span slot="title">{{ menu.name }}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
import { Template } from 'webpack';

export default {
    name: "MenuTree",
    props: ['menuData'],
    created(){
        console.log(this.menuList);
    },
    components: { Template }
}
</script>

<style lang="scss" scoped>

</style>