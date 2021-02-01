module.exports = {
  module: {
    rules: [
      {
        //test: /\.css$/i,
        test: /\.s(c|a)ss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              fiber: require("fibers"),
              indentedSyntax: true
            }
          }
        ]
        //use: ['style-loader', 'css-loader'],
      }
    ]
  }
};
