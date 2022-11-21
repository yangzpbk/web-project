<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-21 09:56:13
 * @FilePath: \web-project\src\components\sideBar\components\menuTree.vue
-->
<template>
    <div>
        <!-- v-if="!item.hidden" -->
        <template v-for="(item, index) in activeRoute">
            <!--二级菜单-->
            <el-submenu :index="item.path">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ item.name }}</span>
                </template>
            </el-submenu>
            <!--顶级菜单-->
            <el-menu-item :index="item.path">
                <span>{{ item.meta.title }}</span>
            </el-menu-item>
        </template>
    </div>
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