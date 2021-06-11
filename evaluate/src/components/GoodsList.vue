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
            <el-input placeholder="请输入产品编号" v-model="queryInfo.id" clearable v-on:clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" v-on:click="getGoodsList"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" v-on:click="addDialogVisible = true">添加商品</el-button>
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
<!--商品添加对话框-->
    <el-dialog title="商品添加" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules"
               ref="addFormRef" label-width="80px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button v-on:click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" v-on:click="addGood">确 定</el-button>
  </span>
    </el-dialog>
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
      addDialogVisible:false,
      //添加商品
      addForm:{
        name :''
      },
      //商品验证规则
      addFormRules:{
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
      }
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
    },
    //添加产品
    addGood() {
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return
        const {data:res} = await this.$http.post('/evaluate/add',this.addForm)
        console.log(res)
        this.$message.success('添加成功');
        //隐藏对话框
        this.addDialogVisible = false
      })
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
