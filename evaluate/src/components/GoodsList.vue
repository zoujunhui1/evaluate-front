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
              <el-button type="primary" icon="el-icon-edit" size="mini" v-on:click="showEditDialog(scope.row.id)">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable ="false">
              <el-button type="danger" icon="el-icon-delete"size="mini" v-on:click="removeGoodById(scope.row.id)">删除</el-button>
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
<!--商品编辑-->
    <el-dialog title="商品编辑" :visible.sync="showDialogVisible"
               width="50%" @close = "editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
               ref="editFormRef" label-width="80px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-on:click="editGood">确 定</el-button>
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
      addDialogVisible:false,//商品添加对话框
      showDialogVisible:false,//商品编辑对话框
      //添加商品
      addForm:{
      },
      //商品添加验证规则
      addFormRules:{
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
      },
      editForm:{
      },
    //商品编辑验证规则
      editFormRules:{
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
      },
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
        if (res.status > 0 ) return this.$message.error("添加失败")
        this.$message.success('添加成功');
        //隐藏对话框
        this.addDialogVisible = false
      })
    },
    //展示产品编辑框
    async showEditDialog(id){
      this.showDialogVisible = true
      const {data:res} = await this.$http.get('/evaluate/list',{params: {'id':id}})
      if (res.status > 0 || res.data.list.length === 0) return this.$message.error("获取产品失败")
      this.editForm = res.data.list[0]
    },
    //编辑商品
    editGood () {
      this.$refs.editFormRef.validate(async valid=>{
        if (!valid) return
        const updateData = {
          'id':this.editForm.id,
          'name':this.editForm.name
        }
        const {data:res} = await this.$http.post('/evaluate/edit',updateData)
        if (res.status > 0 ) return this.$message.error("编辑失败")
        //隐藏对话框
        this.showDialogVisible = false
        //重新获取列表
        await this.getGoodsList()
        //提示成功
        this.$message.success('编辑成功');

      })
    },
    //监听修改编辑框关闭
    editDialogClosed() {
     this.$refs.editFormRef.resetFields()
    },
    //删除商品
    async removeGoodById(id) {
      const confirmResult = await this.$confirm('是否删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      //如果"确认"则会返回字符串confirm
      //如果"取消"则会返回字符串cancel
      if (confirmResult !== "confirm" ) {
        return this.$message.info("已经取消")
      }
      const {data:res} = await this.$http.post('/evaluate/del', {
        'id':id
      })
      console.log(res)
      if (res.status > 0 ) return this.$message.error("删除失败")
      //重新获取列表
      await this.getGoodsList()
      //提示成功
      this.$message.success('删除成功');

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
