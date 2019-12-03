// webpack v4
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

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
          test: /\.s[ac]ss$/i,
          // Loaders go back-to-front
          use: [
            // Loads and minifies
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader"
          ]
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
    //remove comments from JS files
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            parallel: true,
            output: {
              comments: false
            }
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ["default", { discardComments: { removeAll: true } }]
          }
        })
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css"
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: "./src/index.html",
        filename: "index.html"
      })
    ]
  };
};
