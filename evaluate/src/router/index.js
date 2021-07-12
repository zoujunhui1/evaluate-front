import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '../components/GoodsList'
import Login from '../components/Login'
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import GoodsInfo from "../components/GoodsInfo";
import ConfigList from "../components/ConfigList";
import Print from "../components/Print";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',//监听"/"重定向到/login
      redirect:'/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
          component:Welcome
        },
        {
          path: '/goods_list',
          component: GoodsList
        },
        {
          path: '/config_list',
          component: ConfigList
        },
        {
          path:'/batch_print',
          component:Print
        }
      ]
    },
    {
      path:'/product_info',
      component:GoodsInfo
    },
  ]
})

//判断是否有token
router.beforeEach((to,from,next) => {
  //to：将要访问的路径 from :从哪个路径跳转来
  //next: next() 放行 next('/login')强制跳转
  if (to.path == '/login') {
    next()
  }
  const tokenStr = sessionStorage.getItem('token')
  if (to.path !='/product_info' && !tokenStr) {
    next('/login')
  }
  next()
})

export default router
