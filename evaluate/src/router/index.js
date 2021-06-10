import Vue from 'vue'
import Router from 'vue-router'
import ProductList from '../components/ProductList'
import Login from '../components/Login'
import Home from "../components/Home";
import Welcome from "../components/Welcome";

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
        }
      ]
    },
    {
      path: '/product-list',
      name: 'ProductList',
      component: ProductList
    }
  ]
})

//判断是否有token
router.beforeEach((to,from,next) => {
  //to：将要访问的路径
  //from :从哪个路径跳转来
  //next :next() 放行 next('/login')强制跳转
  if (to.path == '/login') next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) next('/login')
  next()
})

export default router
