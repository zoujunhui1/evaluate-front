<template>
  <div>
    <h3>产品详情</h3>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column>
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="产品编号">
              <span>{{ props.row.product_id }}</span>
            </el-form-item>
            <el-form-item label="产品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="产品类别">
              <span>{{ props.row.product_type }}</span>
            </el-form-item>
            <el-form-item label="发行时间">
              <span>{{ props.row.issue_time }}</span>
            </el-form-item>
            <el-form-item label="面值">
              <span>{{ props.row.denomination }}</span>
            </el-form-item>
            <el-form-item label="版别">
              <span>{{ props.row.product_version }}</span>
            </el-form-item>
            <el-form-item label="尺寸">
              <span> {{props.row.diameter}} * {{ props.row.thick }} mm</span>
            </el-form-item>
            <el-form-item label="重量">
              <span>{{ props.row.weight }} g</span>
            </el-form-item>
            <el-form-item label="评级分数">
              <span>{{ infoEnumsList[props.row.score] }} {{infoEnumsList[props.row.level]}}</span>
            </el-form-item>
            <el-form-item label="鉴定结果">
              <span>{{ props.row.identify_result }}</span>
            </el-form-item>
            <el-form-item label="背景资料">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <div class="showImage">
      <div class="block" v-for="imgUrl in url">
        <el-image :src="imgUrl.product_img" fit="fill"></el-image>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsInfo",
  data() {
    return {
      tableData: [],
      url:[],
      infoEnumsList:[]
    }
  },
  created() {
    let product_id = this.$route.query.product_id
    this.getGoods(product_id)
    this.getEnumsList()
  },
  methods: {
    async getGoods (product_id) {
      const {data:res} = await this.$http.get('/evaluate/product/info',{params: {'product_id':product_id}})
      if (res.status > 0 ) return this.$message.error("获取产品详情失败")
      this.tableData.push(res.data.list)
      if (this.tableData.length > 0) {
        this.url = res.data.list.pic
      }
    },
    //枚举列表
    async getEnumsList() {
      const {data:res} = await this.$http.get('/common/enum/list')
      if (res.status > 0 ) return this.$message.error("获取配置列表失败")
      const tmp = new Array();
      res.data.list.forEach((item) => {
        tmp[item.enum_id]= item.enum_name
      })
      this.infoEnumsList = tmp
    },
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .showImage {
    margin-bottom: 10px;
  }
</style>
