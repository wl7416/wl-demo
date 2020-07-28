// 设置axios配置
// 导入axios
import axios from 'axios'
import auth from '@/unitls/auth'
import router from '@/router'
// 导入处理json.parse转换时js的最大整数问题
import JSONbig from 'json-bigint'


// 设置通用路径配置
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [function (data) {
  // 假设当data为null是转换会出现报错--因为无法将null转换为json对象---所以在catch中处理错误数据也就是null数据时 是什么就原封不动返回什么
  try {
    return JSONbig.parse(data);

  } catch (error) {
    data
  }
}]

// 设置发送请求时实时获取token
// 添加请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${auth.getUser().token}`
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 设置token异常或者失效时
// 添加响应拦截器
axios.interceptors.response.use(response => response, (error) => {
  if (error.response && error.request.status === 401) {
    auth.delUser()
    router.push('/login')
  }
  return Promise.reject(error);
});

// 导出axios
export default axios

