<template>
  <div>
<!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--卡片-->
    <el-card>
<!--搜索栏+商品添加-->
      <el-row :gutter="20" >
        <el-col :span="7">
            <el-input placeholder="请输入内容" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
<!--商品展示列表-->
      <el-table :data="goodsList" border stripe>
        <el-table-column prop="product_id" label="产品编号"></el-table-column>
        <el-table-column prop="name" label="名称" ></el-table-column>
        <el-table-column prop="" label="操作" ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      queryInfo :{
        page :1,
        count :10,
      },
      goodsList :[],
      total:0,
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
   async getGoodsList(){
     const {data:res} = await this.$http.get('/evaluate/list',{params: this.queryInfo})
     if (res.status > 0 ) return this.$message.error("获取产品列表失败")
     this.goodsList = res.data.list
     this.total = res.data.total
     console.log(this.total,this.goodsList )
    }
  }
}
</script>

<style lang="less" scoped>

.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
