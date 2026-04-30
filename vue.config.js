const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_PUBLIC_PATH || "/",
  devServer: {
    host: "0.0.0.0",
    allowedHosts: "all",
  },
})
