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
            <el-input placeholder="请输入内容" v-model="queryInfo.id">
              <el-button slot="append" icon="el-icon-search" v-on:click="getGoodsList"></el-button>
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
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable ="false">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable ="false">
              <el-button type="danger" icon="el-icon-delete"size="mini">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[10, 20, 35, 40]"
        :page-size="queryInfo.count"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      queryInfo :{
        id:null,
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
    //商品列表
   async getGoodsList(){
     const {data:res} = await this.$http.get('/evaluate/list',{params: this.queryInfo})
     if (res.status > 0 ) return this.$message.error("获取产品列表失败")
     this.goodsList = res.data.list
     this.total = parseInt(res.data.total)
     this.queryInfo.count = parseInt(res.data.count)
     this.queryInfo.page = parseInt(res.data.page)
    },
    //监听每页展示条数
    handleSizeChange(newSize) {
      this.queryInfo.count = newSize
      this.getGoodsList()
    },
    //监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.page =  newPage
      this.getGoodsList()
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
.el-pagination {
  margin-top: 15px;
}
</style>
