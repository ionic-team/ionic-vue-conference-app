module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.plugins.delete('preload')
  //   config.plugins.delete('hmr');
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.hotReload = false;
        return options;
      });
  
  }
};
