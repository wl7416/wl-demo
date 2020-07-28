module.exports = {
  // 保存的时候不去做代码的风格校验
  lintOnSave: false,
  configureWebpack: {
    // 把一些第三方包排除在外，不去打包
    // webpack的一个配置
    externals: {
      // key(包的名字):value(通过script标签引入后，暴露在全局的变量名)
      echarts: 'echarts'
    },
  },
  // 资源引入的路径前缀
  // ../上级目录   ./同级目录  /根目录
  publicPath: './'
}
