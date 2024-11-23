const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
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
          ? './src/configuration/main.ts' // Configuration entry point
          : './src/main/main.ts',        // Main application entry point
      template: 'public/index.html',
      filename: 'index.html',
    },
  },  
})
