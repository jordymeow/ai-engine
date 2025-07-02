const path = require('path');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const regexNodeModules = /[\\/]node_modules[\\/]/;
const regexNekoUI = /[\\/]neko-ui[\\/]/;

module.exports = function (env, options) {

  const isProduction = options.mode === 'production';
  const isAnalysis = env && env.analysis === 'true';

  const cleanPlugin = new CleanWebpackPlugin({
    protectWebpackAssets: false,
    cleanOnceBeforeBuildPatterns: ["!app/"],
    cleanAfterEveryBuildPatterns: ['!app', '!index.js', '!vendor.js', '!chatbot.js',
      '!forms.js', '!pdfjs.js', '*.LICENSE.txt', '*.map'],
    dangerouslyAllowCleanPatternsOutsideProject: true
  });

  const plugins = [];
  if (isProduction) {
    plugins.push(cleanPlugin);
  }
  if (isAnalysis && env && env.entry === 'chatbot') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  // Copy PDF.js worker (loaded dynamically when needed)
  plugins.push(new CopyPlugin({
    patterns: [
      { 
        from: path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
        to: path.resolve(__dirname, 'app/pdf.worker.min.js')
      }
    ]
  }));
  plugins.push({
    apply: (compiler) => {
      compiler.hooks.afterEmit.tapAsync('CleanupLicenseFiles', (compilation, callback) => {
        // Remove all LICENSE.txt files
        const licenseFiles = [
          path.join(__dirname, 'app', 'vendor.js.LICENSE.txt'),
          path.join(__dirname, 'app', 'index.js.LICENSE.txt'),
          path.join(__dirname, 'app', 'chatbot.js.LICENSE.txt'),
          path.join(__dirname, 'app', 'pdfjs.js.LICENSE.txt'),
          path.join(__dirname, 'app', 'pdf.worker.min.js.LICENSE.txt'),
          path.join(__dirname, 'premium', 'forms.js.LICENSE.txt')
        ];
        
        licenseFiles.forEach(filePath => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Removed LICENSE file:', filePath);
          }
        });
        
        callback();
      });
    }
  });
  // eslint-disable-next-line no-console
  console.log("Production: " + isProduction);

  const baseConfig = {
    context: __dirname,
    mode: isProduction ? 'production' : 'development',
    plugins: plugins,
    devtool: isProduction ? false : 'source-map',
    externals: {
      "react": "React",
      "react-dom": "ReactDOM"
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/app/',
      chunkLoadingGlobal: 'wpJsonMwai'
    },
    resolve: {
      alias: {
        '@root': path.resolve(__dirname, './app/'),
        '@app': path.resolve(__dirname, './app/js/'),
        '@premium': path.resolve(__dirname, './premium/js/'),
        '@common': path.resolve(__dirname, './common/js/'),
        '@neko-ui': path.resolve(__dirname, '../neko-ui/'),
        'styled-components': path.resolve('./node_modules/styled-components'),
      }
    },
    module: {
      rules: [{
        test: /\.js$/,
        include: [
          path.resolve(__dirname, './app/js/'),
          path.resolve(__dirname, './common/js/'),
          path.resolve(__dirname, './premium/js/'),
          path.resolve(__dirname, '../neko-ui/'),
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                targets: {
                  chrome: "90", // or "defaults", "last 2 Chrome versions", etc.
                },
                useBuiltIns: false, // 👈 disables core-js/polyfill injection
                modules: false, // for tree-shaking if needed
              }],
              "@babel/preset-react"
            ]
          }
        },
      }, {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }]
    }
  };

  const adminWebPack = Object.assign({}, baseConfig, {
    entry: {
      index: './app/js/index.js',
    },
    cache: { type: "filesystem" },
    optimization: {
      minimize: isProduction ? true : false,
      minimizer: isProduction ? [
        new (require('terser-webpack-plugin'))({
          extractComments: false, // Don't extract LICENSE comments to separate files
        })
      ] : [],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          pdfjs: {
            test: /[\\/]node_modules[\\/]pdfjs-dist[\\/]/,
            name: 'pdfjs',
            chunks: 'async',
            priority: 20
          },
          vendor: {
            test: function (module) {
              if (module.resource) {
                // Exclude PDF.js from vendor bundle to allow dynamic loading
                if (module.context.includes('pdfjs-dist')) {
                  return false;
                }
                return (module.context.match(regexNodeModules) || module.context.match(regexNekoUI));
              }
            },
            name: "vendor"
          }
        }
      }
    },
  });

  const chatbotWebPack = Object.assign({}, baseConfig, {
    entry: {
      chatbot: './app/js/chatbot.js'
    },
    //cache: { type: "memory" },
    output: {
      filename: '[name].js',
      path: __dirname + '/app/',
      chunkLoadingGlobal: 'wpJsonMwaiChatbot'
    }
  });

  const formsWebPack = Object.assign({}, baseConfig, {
    entry: {
      forms: './premium/js/forms.js'
    },
    //cache: { type: "memory" },
    output: {
      filename: '[name].js',
      path: __dirname + '/premium/',
      chunkLoadingGlobal: 'wpJsonMwaiForms'
    }
  });

  return [adminWebPack, formsWebPack, chatbotWebPack];
};