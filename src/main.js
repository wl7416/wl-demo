import Vue from 'vue'
import App from './App.vue'
// 导入饿了么ui库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入路由
import router from '@/router'
// 导入axios
// import axios from 'axios'
import axios from '@/api'
// 把axios配置为全局
Vue.prototype.$http = axios
// 导入自己封装的面包屑插件
import MyBread from '@/plugin'
Vue.use(MyBread)
// 导入上传的样式--设定为全局样式
import "@/styles/upload.less"





Vue.config.productionTip = false
// Vue.use--只要导入的是vue的插件就要有这一句代码 不然无法起效果  也有全局的意思

Vue.use(ElementUI)



new Vue({
  render: h => h(App),
  // 把路由实例挂载到vue实例上
  router
}).$mount('#app')
