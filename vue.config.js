const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_PUBLIC_PATH || "/",
  configureWebpack: {
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          charts: {
            test: /[\\/]node_modules[\\/](apexcharts|vue3-apexcharts|chart\.js|vue-chartjs)[\\/]/,
            name: "vendor-charts",
            priority: 30,
          },
          excel: {
            test: /[\\/]node_modules[\\/](xlsx)[\\/]/,
            name: "vendor-excel",
            priority: 25,
          },
          realtime: {
            test: /[\\/]node_modules[\\/](socket\.io-client)[\\/]/,
            name: "vendor-realtime",
            priority: 20,
          },
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
    config.plugins.delete("preload");
  },
  devServer: {
    host: "0.0.0.0",
    allowedHosts: "all",
  },
})
