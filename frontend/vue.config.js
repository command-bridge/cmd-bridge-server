const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Alias for the "src" directory
        '@components': path.resolve(__dirname, 'src/main/components'),
        '@layouts': path.resolve(__dirname, 'src/main/layouts'),
        '@stores': path.resolve(__dirname, 'src/main/stores'),
        '@plugins': path.resolve(__dirname, 'src/main/plugins'),
      },
    },
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@use "vuetify/styles" as *;`,
      },
    },
  },
  pages: {
    index: {
      entry:
        process.env.VUE_APP_CONFIGURATION_MODE === 'true'
          ? './src/configuration/main.ts'
          : './src/main/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .end();
  },
});
