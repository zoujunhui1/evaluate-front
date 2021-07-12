// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, {Message, MessageBox} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
import print from 'print-js'

import 'print-js/dist/print.css';

Vue.prototype.$print = print;

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
axios.defaults.baseURL = 'http://81.71.91.145:8080'
// axios.defaults.baseURL = 'http://localhost:8080'
axios.interceptors.request.use(config=>{
  //每次获取token放到header里
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http= axios


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
