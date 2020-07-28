import Vue from 'vue'
// 导入vue-router路由插件
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 导入用户相关的封装的方法
import Auth from "@/unitls/auth";

// 导入登录组件
const Login = () => import('@/views/login')

// 导入首页
const Layout = () => import('@/views/Layout')
// 导入欢迎页面
const Welcome = () => import('@/views/Welcome')

// 导入404组件
const NotFound = () => import("@/views/404")
// 导入文件管理组件
const Article = () => import("@/views/article")
// 导入素材组件
const Image = () => import("@/views/image")
// 导入发布文章组件
const Publish = () => import("@/views/publish")
// 导入评论管理
const Comment = () => import('@/views/comment')
// 导入粉丝管理
const Fans = () => import(/* webpackChunkName: "fans" */'@/views/fans')
// 导入个人设置
const Setting = () => import('@/views/setting')



// 路由和组件的配置
const routes = [
  // 登录页面
  { path: '/login', component: Login },
  // 首页
  {
    path: '/', component: Layout,
    children: [
      // 欢迎页面
      { path: '/', component: Welcome },
      // 文件管理
      { path: '/article', component: Article },
      // 素材管理
      { path: '/image', component: Image },
      // 发布文章
      { path: '/publish', component: Publish },
      // 评论管理
      { path: '/comment', component: Comment },
      // 粉丝管理
      { path: '/fans', component: Fans },
      // 个人设置
      { path: '/setting', component: Setting },


    ]
  },
  { path: '*', component: NotFound }
]



const router = new VueRouter({
  routes
})

// 设置全局前置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !Auth.getUser().token) return next('/login')
  next()
})

// 导出路由实例
export default router