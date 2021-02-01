const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  crossorigin: "anonymous",
  integrity: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/variables.sass"`
      },
      scss: {
        prependData: `@import "~@/variables.scss";`
      },
      // pass Less.js Options to less-loader
      less: {
        globalVars: {
          primary: "#fff"
        }
      }
    }
  },
  chainWebpack: config => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("stylus").oneOf(type))
    );
  }
};

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/styles/imports.styl")]
    });
}
