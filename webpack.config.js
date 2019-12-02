// webpack v4
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const dev = argv.mode === "development";
  console.log(`Build mode is: ${argv.mode}`);

  return {
    devtool: dev ? "source-map" : "none",
    devServer: {
      historyApiFallback: true,
      contentBase: path.join(__dirname, "dist"),
      compress: true
    },
    entry: ["./src/index.tsx"],
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                emitFile: dev ? true : false,
                publicPath: dev ? "./" : "https://ADDRESS_OF_CDN/",
                name: "[path][name].[ext]"
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "sass-loader"]
          })
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          // Load local fonts (unused), you should probably just load them from google though
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader"
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
      new ExtractTextPlugin({ filename: "style.css" }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: "./src/index.html",
        filename: "index.html"
      })
    ]
  };
};
