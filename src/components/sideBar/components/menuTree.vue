<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-21 09:56:13
 * @FilePath: \web-project\src\components\sideBar\components\menuTree.vue
-->
<template v-for="(menu, index) in menuData">
    <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.menuId + ''">
        <template slot="title">
            <icon-svg :name="menu.icon || ''"></icon-svg>
            <span>{{ menu.name }}</span>
        </template>
        <sub-menu v-for="item in menu.list" :key="item.menuId" :menu="item" :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
    </el-submenu>
    <el-menu-item v-else :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
        <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
        <span>{{ menu.name }}</span>
    </el-menu-item>
</template>
<script>

export default {
    name: "MenuTree",
    props: ['menuData'],
    // methods: {
    //     printLn() {
    //         console.log(this.menuList);
    //     }
    // },
    created(){
        console.log(this.menuData)
    },
    computed: {
        activeRoute: function () {
            return this.menuData.filter(function (routes) {
                console.log(routes);
                return !routes.hidden;
            })
        }
    },
}
</script>

<style lang="scss" scoped>

</style>