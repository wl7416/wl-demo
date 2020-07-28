// 这是一个基于vue的插件 扩展vue的功能
// 面包屑组件
import MyBread from "@/components/my-bread";
// 频道组件
import MyChannel from "@/components/my-channel";
// 发布文章封面组件
import MyImage from "@/components/my-image";
export default {
  install(Vue) {
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyChannel.name, MyChannel)
    Vue.component(MyImage.name, MyImage)
  }
}