<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-12-05 17:36:53
 * @FilePath: \web-project\src\components\sideBar\components\menuTree.vue
-->
<template>
    <div v-for="item of menuList">
        <el-sub-menu v-if="(item.children && item.children.length > 0)" :key="item.path" :value="item.path"
            :index="item.path">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <menu-tree :menuList="item.children"></menu-tree>
        </el-sub-menu>
        <el-menu-item v-else :index="item.path">
            <el-icon>
                <MagicStick />
            </el-icon>
            <span>{{ item.meta.title }}</span></el-menu-item>
    </div>
</template>

<script>
export default {
    name: "MenuTree",
    props: {
        menuList: {
            type: Array,
            default: []
        },
    },
}
</script>