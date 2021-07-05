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
        <el-col :span="7">
          <el-select v-model="queryInfo.enum_id" clearable placeholder="请选择" v-on:clear="getConfigList">
            <el-option
              v-for="(item, index) in selectOptions"
              :key="index"
              :label="item.enum_name"
              :value="item.enum_id">
            </el-option>
          </el-select>
        </el-col>
        <el-button type="primary" icon="el-icon-search"
                   size="small" v-on:click="getConfigList">搜索</el-button>

      </el-row>

      <!--列表展示-->
      <el-table :data="configList" border stripe>
        <el-table-column prop="enum_id" label="id"></el-table-column>
        <el-table-column prop="enum_name" label="名称"></el-table-column>

      </el-table>
    </el-card>

  </div>

</template>

<script>
export default {
  data () {
    return {
      queryInfo :{},
      configList : [],
      selectOptions:[],
      selectQueryInfo:{}
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
