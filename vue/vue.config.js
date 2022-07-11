// const path = require('path')
// const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    resolve: {
      alias: {
        // vue$: 'vue/dist/vue.esm.js',
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        // '@': path.resolve('src'),
      },
    },
    // plugins: [
    //   ...(
    //     (!lintOnSave && process.env.NODE_ENV === 'development') ? [] : [new StylelintPlugin({
    //       files: ['src/**/*.{vue,htm,html,css,sss,less,scss}'],
    //     })]
    //   ),
    // ],
  },
  css: {
    loaderOptions: {
      sass: {
        // Preload vuestic-ui variables and mixins for every component
      },
    },
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js',
      importWorkboxFrom: 'local',
    },
  },
}
