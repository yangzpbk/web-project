<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isRouterAlive: true
    }
  }
}
</script>
<style>
#app {
  margin: 0;
  height: 100%;
}

html,
body {
  margin: 0;
  height: 100%;
}
</style>
