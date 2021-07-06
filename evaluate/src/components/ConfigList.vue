<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>配置列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--配置-->
    <el-card>
<!--筛选栏-->
      <el-row :gutter="20" >
        <el-col :span="12">
          <el-select v-model="queryInfo.enum_id" clearable placeholder="请选择" v-on:clear="getConfigList">
            <el-option
              v-for="(item, index) in selectOptions"
              :key="index"
              :label="item.enum_name"
              :value="item.enum_id">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="small" v-on:click="getConfigList">搜索</el-button>
        </el-col>
        <el-col :span="7">
          <el-button round type="primary" v-on:click="showDialogVisible = true">添加配置</el-button>
        </el-col>

      </el-row>
      <!--列表展示-->
      <el-table :data="configList" border stripe>
        <el-table-column prop="enum_id" label="id"></el-table-column>
        <el-table-column prop="enum_name" label="名称"></el-table-column>
      </el-table>
    </el-card>

<!--配置添加-->
    <el-dialog title="添加配置" :visible.sync="showDialogVisible"
               width="50%" @close = "addDialogClosed">
      <el-form :model="addConfigForm" :rules="addConfigFormRules" ref="addConfigFormRef" label-width="80px">
        <el-form-item label="一级配置" prop="enum_id">
          <el-select v-model.number="addConfigForm.enum_id" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in selectOptions"
              :key="index" :label="item.enum_name" :value="item.enum_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置名称" prop="enum_name">
          <el-input v-model="addConfigForm.enum_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-on:click="addConfig">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data () {
    return {
      queryInfo :{},
      configList : [],
      selectOptions:[],
      selectQueryInfo:{},
      showDialogVisible:false,//配置添加对话框
      addConfigForm:{},//添加配置
      addConfigFormRules:{
        enum_id: [
          { required: true, message: '枚举id', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' }
        ],
        enum_name: [
          { required: true, message: '配置名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    this.getConfigList()
    this.getSelectOption()
  },
  methods :{
    async getConfigList() {
      const {data:res} = await this.$http.get('/common/enum/list',{params: this.queryInfo})
      if (res.status > 0 ) return this.$message.error("获取配置列表失败")
      this.configList = res.data.list
    },
    async getSelectOption() {
      const {data:res} = await this.$http.get('/common/enum/list',{params: this.queryInfo})
      if (res.status > 0 ) return this.$message.error("获取配置列表失败")
      this.configList = res.data.list
      if (res.data.list.length > 0) {
        res.data.list.forEach((item, index) => {
          if (item.level === 1){
            this.selectOptions.push(item)
          }
        })
      }
    },
    //监听修改编辑框关闭
    addDialogClosed() {
      this.$refs.addConfigFormRef.resetFields()
    },
    //添加配置
    async addConfig (){
      this.$refs.addConfigFormRef.validate(async valid=>{
        if (!valid) return
        const {data:res} = await this.$http.post('/common/enum/add',this.addConfigForm)
        if (res.status > 0 ) return this.$message.error("添加失败")
        //隐藏对话框
        this.showDialogVisible = false
        //重新获取列表
        await this.getConfigList()
        //提示成功
        this.$message.success('添加成功');
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}

</style>
