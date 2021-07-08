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
            <el-input placeholder="请输入产品编号" v-model="queryInfo.product_id" clearable v-on:clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" v-on:click="getGoodsList"></el-button>
            </el-input>
        </el-col>
<!--        <el-col :span="4">-->
<!--          <el-button type="primary" v-on:click="addDialogVisible = true">添加产品</el-button>-->
<!--        </el-col>-->
      </el-row>
<!--产品展示列表-->
      <el-table :data="goodsList" border stripe>
        <el-table-column prop="product_id" label="产品编号"></el-table-column>
        <el-table-column prop="name" label="名称" ></el-table-column>
        <el-table-column prop="product_type" label="类别" ></el-table-column>
        <el-table-column prop="issue_time" label="发行时间" ></el-table-column>

        <el-table-column label="二维码" >
          <template slot-scope="props">
            <el-image v-if="props.row.text_url !==''"
              style="width: 100px; height: 100px"
              :src="props.row.text_url"
              v-on:click="addPreviewSrc(props.row.text_url)"
              :preview-src-list="previewSrcList"
              fit=contain>
            </el-image>
            <span v-else>编辑完成后生成</span>

          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable ="false">
              <el-button type="primary" size="mini" v-on:click="showEditDialog(scope.row.product_id)">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看详情" placement="top-start" :enterable ="false">
              <el-button type="info" size="mini" v-on:click="showGoodsInfo(scope.row.product_id)">查看详情</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable ="false">
              <el-button type="danger" size="mini" v-on:click="removeGoodById(scope.row.product_id)">删除</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="下载图片" placement="top-start" :enterable ="false">
              <el-button type="success" size="mini">
                <a :href="imageDownloadUrl+scope.row.product_id">下载图片</a>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[20, 40, 50]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
<!--产品编辑-->
    <el-dialog title="产品编辑" :visible.sync="showDialogVisible"
               width="70%" @close = "editDialogClosed">

      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" :inline="true">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="product_type">
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
          <el-input v-model="editForm.weight">
            <i slot="suffix" style="font-style:normal;margin-right: 10px;">单位/g</i>
          </el-input>
        </el-form-item>
        <el-form-item label="材质" prop="weight">
          <el-input v-model="editForm.material"></el-input>
        </el-form-item>
        <el-form-item label="厚度" prop="thick">
          <el-input v-model="editForm.thick">
            <i slot="suffix" style="font-style:normal;margin-right: 10px;">单位/mm</i>
          </el-input>
        </el-form-item>
        <el-form-item label="直径" prop="diameter">
          <el-input v-model="editForm.diameter">
            <i slot="suffix" style="font-style:normal;margin-right: 10px;">单位/mm</i>
          </el-input>
        </el-form-item>
        <el-form-item label="评级分数" prop="score">
          <el-select v-model="editForm.score" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in enumsList[200]"
              :key="index" :label="item.enum_name" :value="item.enum_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评级级别" prop="level">
          <el-select v-model.number="editForm.level" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in enumsList[100]" :key="index" :label="item.enum_name" :value="item.enum_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="鉴定结果" prop="identify_result">
          <el-input v-model="editForm.identify_result"></el-input>
        </el-form-item>
        <el-form-item label="背景资料" prop="desc">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input-number v-model="product_num" @change="handleChange" :min="0" :max="100" label="生成数量"></el-input-number>
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
        product_id:null,
        page :1,
        page_size :20,
      },
      goodsList :[],
      total:0,
      showDialogVisible:false,//产品编辑对话框
      imageDownloadUrl :"http://81.71.91.145:8080/evaluate/product/image_download?product_id=",//图片下载
      previewSrcList :[],
      //添加产品
      addForm:{},
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
        ],
        thick: [
          { required: true, message: '厚度', trigger: 'blur' },
        ],
        diameter: [
          { required: true, message: '直径', trigger: 'blur' },
        ],
        material: [
          { required: true, message: '材料', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '长', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        identify_result: [
          { required: true, message: '鉴定结果', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: false, message: '背景资料', trigger: 'blur' },
          { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
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
      previewVisible:false,
      //额外生成的产品数量
      product_num :0,
      //所有枚举
      enumsList:[],
    }
  },
  created () {
    this.getGoodsList()//获取产品列表
    this.getEnumsList()//获取枚举列表
  },
  methods: {
    //产品列表
   async getGoodsList(){
     const {data:res} = await this.$http.get('/evaluate/product/list',{params: this.queryInfo})
     if (res.status > 0 ) return this.$message.error("获取产品列表失败")
     this.goodsList = res.data.list
     this.total = parseInt(res.data.total)
     this.queryInfo.page_size = parseInt(res.data.page_size)
     this.queryInfo.page = parseInt(res.data.page)
    },
    //枚举列表
   async getEnumsList() {
      const {data:res} = await this.$http.get('/common/enum/list')
      if (res.status > 0 ) return this.$message.error("获取配置列表失败")
      const tmp = new Array();
      res.data.list.forEach((item, index) => {
        if (item.level === 1){
          tmp[item.enum_id] = new Array()
          res.data.list.forEach((v, idx) => {
            if (v.father_enum_id == item.enum_id) {
              tmp[item.enum_id].push(v)
            }
          })
       }
     })
     this.enumsList = tmp
    },
    //监听每页展示条数
    handleSizeChange(newSize) {
      this.queryInfo.page_size = newSize
      this.getGoodsList()
    },
    //监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.page =  newPage
      this.getGoodsList()
    },
    //展示产品编辑框
    async showEditDialog(product_id){
      this.showDialogVisible = true
      const {data:res} = await this.$http.get('/evaluate/product/list',{params: {'product_id':product_id}})
      if (res.status > 0 || res.data.list.length === 0) return this.$message.error("获取产品失败")
      this.editForm = res.data.list[0]
      if (this.editForm.score === 0){
        this.editForm.score = null
      }
      if (this.editForm.level === 0) {
        this.editForm.level = null
      }
      this.editForm.product_count = 0
    },
    //编辑产品
    editGood () {
      this.$refs.editFormRef.validate(async valid=>{
        if (!valid) return
        this.editForm.product_count = this.product_num
        this.editForm.weight = parseFloat(this.editForm.weight)
        this.editForm.thick = parseFloat(this.editForm.thick)
        this.editForm.diameter = parseFloat(this.editForm.diameter)
        const {data:res} = await this.$http.post('/evaluate/product/edit',this.editForm)
        if (res.status > 0 ) return this.$message.error("编辑失败")
        //隐藏对话框
        this.showDialogVisible = false
        //重新获取列表
        await this.getGoodsList()
        //提示成功
        this.$message.success('编辑成功');
      })
    },
    //生成数量监听
    handleChange (value){
     this.product_num = value
    },
    //监听修改编辑框关闭
    editDialogClosed() {
     this.$refs.editFormRef.resetFields()
    },
    //删除产品
    async removeGoodById(product_id) {
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
      const {data:res} = await this.$http.post('/evaluate/product/del', {
        'product_id':product_id
      })
      if (res.status > 0 ) return this.$message.error("删除失败")
      //重新获取列表
      await this.getGoodsList()
      //提示成功
      this.$message.success('删除成功');
    },
    //查看详情跳转
    showGoodsInfo(product_id) {
      let routeData = this.$router.resolve({
        path:'/product_info',
        query:{
          product_id: product_id,
        }
      })
      window.open(routeData.href, "_blank");
    },
    //二维码图片预览
    addPreviewSrc(url){
     this.previewSrcList.push(url)
    },
    //图片上传-预览图片
    handlePreview(file) {
      this.previewPath = file.response.data.file_url
      this.previewVisible = true
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
    },
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
