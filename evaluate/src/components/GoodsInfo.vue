<template>
  <div @click="btn">
    跳转
  </div>

</template>

<script>
export default {
name: "GoodsInfo",
methods:{
  btn() {
    let routeData = this.$router.resolve({
      path:'/onlineLook',
      query:{
        name: 'mzz',
        age: 11
      }
    })
    window.open(routeData.href, "_blank");

  }
}
}

</script>

<style scoped>

</style>
