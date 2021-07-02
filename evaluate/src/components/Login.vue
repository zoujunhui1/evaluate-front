<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--登陆表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.name" placeholder="用户名"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" v-on:click="login">提交</el-button>
        </el-form-item>
      </el-form >
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      //登陆表单的数据绑定对象
      loginForm:{
        'name':'',
        'password':''
      },
      //验证规则
      loginFormRules:{
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.post('/common/login',this.loginForm)
        if (res.status > 0 ) return this.$message.error('登录失败');
        this.$message.success('登录成功');
        //session_storage里存token
        sessionStorage.setItem('token',res.data.token)
        sessionStorage.setItem('id',res.data.id)
        //登录成功调到主页
        await this.$router.push("/home")
        /*下面这种方式也可以*/
        // this.$http.post('/evaluate/login',this.loginForm).then(function (response){
        //   if (response.data.status > 0) return  console.log("失败")
        //   console.log("0k")
        // })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    right: 50%;
    transform:translate(-50%,60%);
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    border:1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    transform: translate(100%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom:0;
    width :100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
