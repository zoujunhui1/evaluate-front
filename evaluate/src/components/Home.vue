<template>
  <div>
    Home组件
    <el-button type="info" v-on:click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods:{
    logout(){
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
