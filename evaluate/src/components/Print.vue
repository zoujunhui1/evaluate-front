<template>
  <div>
    <div id="printBox">
      <div v-for="(product,index) in productList" :key="index" style="page-break-after:always;">
        <img v-if="product.text_url != ''" :src="product.text_url" alt="">
      </div>
    </div>
<!--打印查询-->
    <el-form ref="queryRangeForm" :model="queryParams" :rules="queryRangeFormRules" label-width="80px">
      <el-form-item label="开始编号" prop="product_id_start">
        <el-input v-model="queryParams.product_id_start"></el-input>
      </el-form-item>
      <el-form-item label="结束编号" prop="product_id_end">
        <el-input v-model="queryParams.product_id_end"></el-input>
      </el-form-item>
      <el-button type="primary" v-on:click="search">查询</el-button>
      <el-button type="primary" v-on:click="printHtml">全部打印</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Print",
  data() {
    return {
      productList: [],
      queryParams:{},
      queryRangeFormRules:{
        product_id_start :[
          { required: true, message: '开始编号', trigger: 'blur' },
        ],
        product_id_end :[
          { required: true, message: '结束编号', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    search() {
      this.$refs.queryRangeForm.validate(async valid=>{
        //参数验证
        if (!valid) return
        //获取数据
        const {data:res} = await this.$http.get('/evaluate/product/range_list',{params: this.queryParams})
        if (res.status > 0 ) return this.$message.error("获取范围数据失败")
        this.productList = res.data.list
      })
    },
    printHtml(){
      this.$print({
        printable: 'printBox',
        type: 'html',
        header: '',
        targetStyles: ['*'], // 打印内容使用所有HTML样式，没有设置这个属性/值，设置分页打印没有效果
      })
    }
  },
  // watch:{
  //   productList:function() {
  //     this.$nextTick(function(){
  //       this.printTest()
  //     });
  //   }
  // }
}

</script>

<style scoped>

</style>
