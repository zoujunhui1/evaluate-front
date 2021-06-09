<template>
  <div id="app">
    <template>
      <el-table :data="info" style="width: 100%">
        <el-table-column prop="id" label="id" width="180" ></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      </el-table>
      {{ info }}
    </template>
  </div>
</template>

<script>

export default {
  name: "ProductList",
  data () {
      return {
        // tableData: null,
        info:null
      }
  },
  mounted () {
    this.$http({
      method: 'get',
      url: '/evaluate/list?id=1',
    }).then(function (response) {
      this.info = response.data.data
      console.log(response.data.data);
    }).catch(function (error) {
        console.log(error);
    });
  }
}
</script>

<style scoped>

</style>
