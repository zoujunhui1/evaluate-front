// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$message = Message
axios.defaults.baseURL = 'http://150.109.150.224'
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
