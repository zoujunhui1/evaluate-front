<template>
  <div>
<!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--卡片-->
    <el-card>
<!--搜索栏+产品添加-->
      <el-row :gutter="20" >
        <el-col :span="7">
            <el-input placeholder="请输入产品编号" v-model="queryInfo.id" clearable v-on:clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" v-on:click="getGoodsList"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" v-on:click="addDialogVisible = true">添加产品</el-button>
        </el-col>
      </el-row>
<!--产品展示列表-->
      <el-table :data="goodsList" border stripe>
        <el-table-column prop="id" label="产品编号"></el-table-column>
        <el-table-column prop="name" label="名称" ></el-table-column>
        <el-table-column prop="product_type" label="类别" ></el-table-column>
        <el-table-column prop="issue_time" label="发行时间" ></el-table-column>
        <el-table-column  label="二维码" >
          <template slot-scope="props">
            <el-image v-if="props.row.qr_code_url !==''"
              style="width: 100px; height: 100px"
              :src="props.row.qr_code_url"
              fit=contain>
            </el-image>
            <span v-else>正在生成二维码</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable ="false">
              <el-button type="primary" size="mini" v-on:click="showEditDialog(scope.row.id)">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看详情" placement="top-start" :enterable ="false">
              <el-button type="info" size="mini" v-on:click="showGoodsInfo(scope.row.id)">查看详情</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable ="false">
              <el-button type="danger" size="mini" v-on:click="removeGoodById(scope.row.id)">删除</el-button>
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
<!--产品添加对话框-->
    <el-dialog title="产品添加" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules"
               ref="addFormRef" label-width="80px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="产品类别" prop="product_type">
          <el-input v-model="addForm.product_type"></el-input>
        </el-form-item>
        <el-form-item label="发行时间" prop="issue_time">
          <el-input v-model="addForm.issue_time"></el-input>
        </el-form-item>
        <el-form-item label="面值" prop="denomination">
          <el-input v-model="addForm.denomination"></el-input>
        </el-form-item>
        <el-form-item label="版别" prop="product_version">
          <el-input v-model="addForm.product_version"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model.number="addForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="尺寸:长" prop="length">
          <el-input v-model.number="addForm.length"></el-input>
        </el-form-item>
        <el-form-item label="尺寸:宽" prop="width">
          <el-input v-model.number="addForm.width"></el-input>
        </el-form-item>
        <el-form-item label="评级分数" prop="score">
          <el-input v-model="addForm.score"></el-input>
        </el-form-item>
        <el-form-item label="鉴定结果" prop="identify_result">
          <el-input v-model="addForm.identify_result"></el-input>
        </el-form-item>
        <el-form-item label="背景资料" prop="desc">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="图片上传">
          <!--图片上传-->
          <el-upload :action="uploadUrl"
                     :on-preview="handlePreview" :on-remove="handleRemove"
                     list-type="picture" :headers="headerObj" :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过300kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-on:click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-on:click="addGood">确 定</el-button>
      </span>
    </el-dialog>
<!--产品编辑-->
    <el-dialog title="产品编辑" :visible.sync="showDialogVisible"
               width="50%" @close = "editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
               ref="editFormRef" label-width="80px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="产品类别" prop="product_type">
          <el-input v-model="editForm.product_type"></el-input>
        </el-form-item>
        <el-form-item label="发行时间" prop="issue_time">
          <el-input v-model="editForm.issue_time"></el-input>
        </el-form-item>
        <el-form-item label="面值" prop="denomination">
          <el-input v-model="editForm.denomination"></el-input>
        </el-form-item>
        <el-form-item label="版别" prop="denomination">
          <el-input v-model="editForm.product_version"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model.number="editForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="尺寸:长" prop="length">
          <el-input v-model.number="editForm.length"></el-input>
        </el-form-item>
        <el-form-item label="尺寸:宽" prop="width">
          <el-input v-model.number="editForm.width"></el-input>
        </el-form-item>
        <el-form-item label="评级分数" prop="score">
          <el-input v-model="editForm.score"></el-input>
        </el-form-item>
        <el-form-item label="鉴定结果" prop="identify_result">
          <el-input v-model="editForm.identify_result"></el-input>
        </el-form-item>
        <el-form-item label="背景资料" prop="desc">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-on:click="editGood">确 定</el-button>
      </span>
    </el-dialog>
<!--图片预览-->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%" >
      <img :src="previewPath" class="previewImg">
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
      addDialogVisible:false,//产品添加对话框
      showDialogVisible:false,//产品编辑对话框
      //添加产品
      addForm:{
      },
      //产品添加验证规则
      addFormRules:{
        name: [
          { required: true, message: '产品名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        product_type: [
          { required: true, message: '产品类别', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        issue_time: [
          { required: true, message: '发行时间', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        denomination: [
          { required: true, message: '面值', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        product_version: [
          { required: true, message: '版别', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '重量', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        length: [
          { required: true, message: '长', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        width: [
          { required: true, message: '宽', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '评级分数', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        identify_result: [
          { required: true, message: '鉴定结果', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '背景资料', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      },
      //编辑产品
      editForm:{
      },
    //产品编辑验证规则
      editFormRules:{
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        product_type: [
          { required: true, message: '产品类别', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        issue_time: [
          { required: true, message: '发行时间', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        denomination: [
          { required: true, message: '面值', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        product_version: [
          { required: true, message: '版别', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '重量', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        length: [
          { required: true, message: '长', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        width: [
          { required: true, message: '宽', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '评级分数', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        identify_result: [
          { required: true, message: '鉴定结果', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '背景资料', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      },
      //图片上传地址
      uploadUrl:"http://150.109.150.224/evaluate/upload",
      headerObj :{
        Authorization:window.sessionStorage.getItem('token')
      },
      //图片上传-图片地址
      pic :[],
      //图片上传-图片预览地址
      previewPath :"",
      //图片上传-图片预览
      previewVisible:false
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    //产品列表
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
        //刷新当前页面
        await this.getGoodsList()
      })
    },
    //展示产品编辑框
    async showEditDialog(id){
      this.showDialogVisible = true
      const {data:res} = await this.$http.get('/evaluate/list',{params: {'id':id}})
      if (res.status > 0 || res.data.list.length === 0) return this.$message.error("获取产品失败")
      this.editForm = res.data.list[0]
    },
    //编辑产品
    editGood () {
      this.$refs.editFormRef.validate(async valid=>{
        if (!valid) return
        const {data:res} = await this.$http.post('/evaluate/edit',this.editForm)
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
    //删除产品
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
      if (res.status > 0 ) return this.$message.error("删除失败")
      //重新获取列表
      await this.getGoodsList()
      //提示成功
      this.$message.success('删除成功');
    },
    //查看详情跳转
    showGoodsInfo(id) {
      let routeData = this.$router.resolve({
        path:'/goods_info',
        query:{
          id: id,
        }
      })
      window.open(routeData.href, "_blank");
    },
    //图片上传-预览图片
    handlePreview(file) {
      this.previewPath = file.response.data.file_url
      this.previewVisible = true
      // console.log(previewPath)
    },
    //图片上传-移除图片
    handleRemove(file) {
      //1.获取要删除图片的地址
      const filePath = file.response.data.file_url

      //2.从pic数组中找到该地址的索引值
      const i = this.addForm.pic.findIndex(x =>
        x.pic === filePath
      )
      //3.删除该地址
      this.addForm.pic.splice(i,1)
    },
    //图片上传-监听图片上传成功的钩子
    handleSuccess(response) {
      if (response.status > 0 ) return this.$message.error("上传失败")
      this.pic.push(response.data.file_url)
      this.addForm.pic = this.pic
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
.previewImg {
  width: 100%;
}
</style>
