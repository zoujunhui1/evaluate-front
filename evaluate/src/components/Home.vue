<template>
    <el-container class="home-container">
      <!--头部-->
      <el-header>
        <div>
          <span>后台管理系统</span>
        </div>
        <el-button type="info" v-on:click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!--左边-->
        <el-aside width="200px">
          <!--菜单栏-->
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
            <!--一级菜单-->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <!--二级菜单-->
              <el-menu-item index="1-4">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>

        </el-aside>
        <!--右边-->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
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

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display:flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #EAEDF1;
}

.home-container {
  height: 100%;
}
</style>
