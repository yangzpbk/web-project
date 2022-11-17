<template>
  <router-view @dispatchTaskOrder="dispatchTaskOrder" />
</template>

<script>
export default {
  name: 'PlaceholderView',
  props: {},
  data() {
    return {}
  },
  methods: {
    dispatchTaskOrder(row) {
      this.$emit('dispatchTaskOrder', row);
    }
  }
}
</script>

<style scoped>

</style>
