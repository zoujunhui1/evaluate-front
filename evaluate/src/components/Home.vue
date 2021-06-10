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
            <el-submenu :index = "item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.auth_name }}</span>
              </template>
              <!--二级菜单-->
              <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{subItem.auth_name}}</span>
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
  data(){
    return {
      menuList :[]
    }
  },
  created() {
    this.getMenuList()
  },
  methods:{
    logout(){
      sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList () {
     const res = [
        {
          "id":1,
          "auth_name":"商品管理",
          "path":"goods",
          "children":[
            {
              "id":11,
              "auth_name":"商品列表",
              "path":"goods_list",
            }
          ]
        },
       {
         "id":2,
         "auth_name":"用户管理",
         "path":"user",
         "children":[
           {
             "id":21,
             "auth_name":"用户列表",
             "path":"user_list",
           }
         ]
       }

      ]
      this.menuList = res
      console.log(this.menuList[0].children)
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
