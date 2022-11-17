<!--
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 16:58:54
 * @FilePath: \web-project\src\views\redirect\index.vue
-->
<script>
export default {
  beforeCreate() {
    const { params, query } = this.$route;
    const { path } = params;
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
