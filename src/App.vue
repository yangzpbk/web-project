<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 16:24:34
 * @FilePath: \web-project\src\App.vue
-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
