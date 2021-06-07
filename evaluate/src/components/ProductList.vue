<template>
  <div>
    <h1>list</h1>
    <p>{{msg}}</p>
    <el-button @click="visible = true">Button</el-button>
    <el-dialog :visible.sync="visible" title="Hello world">
      <p>Try Element</p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProductList",
  data () {
    return {
      msg: "我是 list 组件"
    }
  }
}
</script>

<style scoped>

</style>
