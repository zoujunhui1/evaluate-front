import Vue from 'vue'
import Router from 'vue-router'
import ProductList from '@/components/ProductList'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
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
      path: '/product-list',
      name: 'ProductList',
      component: ProductList
    }
  ]
})
