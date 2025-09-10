const path = require('path');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const regexNodeModules = /[\\/]node_modules[\\/]/;
const regexNekoUI = /[\\/]neko-ui[\\/]/;

// Simple cleaning plugin that can be configured for any directory
class CleanBuildArtifactsPlugin {
  constructor(options = {}) {
    this.options = {
      directory: options.directory || '.',
      patterns: options.patterns || ['.map', '.LICENSE.txt'],
      exclude: options.exclude || [],
      specificFiles: options.specificFiles || [],
      onlyInProduction: options.onlyInProduction !== false // default true
    };
  }

  apply(compiler) {
    const isProduction = compiler.options.mode === 'production';
    
    // Skip if production-only and not in production
    if (this.options.onlyInProduction && !isProduction) {
      return;
    }

    compiler.hooks.afterEmit.tapAsync('CleanBuildArtifacts', (compilation, callback) => {
      const dir = path.join(__dirname, this.options.directory);
      
      // Clean files matching patterns
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(file => {
          // Check if file matches any pattern
          const shouldClean = this.options.patterns.some(pattern => file.endsWith(pattern));
          
          // Check if file is excluded
          const isExcluded = this.options.exclude.some(exclude => file.startsWith(exclude));
          
          if (shouldClean && !isExcluded) {
            const filePath = path.join(dir, file);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Cleaned: ${this.options.directory}/${file}`);
            }
          }
        });
        
        // Clean specific files
        this.options.specificFiles.forEach(file => {
          const filePath = path.join(dir, file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned: ${this.options.directory}/${file}`);
          }
        });
      }
      
      callback();
    });
  }
}

module.exports = function (env, options) {

  const isProduction = options.mode === 'production';
  const isAnalysis = env && env.analysis === 'true';

  const plugins = [];
  if (isAnalysis && env && env.entry === 'chatbot') {
    plugins.push(new BundleAnalyzerPlugin());
  }
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
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: __dirname + '/app/',
      chunkLoadingGlobal: 'wpJsonMwai'
    },
    cache: { type: "filesystem" },
    plugins: [
      ...baseConfig.plugins,
      // Clean app directory build artifacts
      new CleanBuildArtifactsPlugin({
        directory: 'app',
        patterns: ['.map', '.LICENSE.txt']
      }),
      // Custom plugin to copy PDF worker AFTER all builds complete
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tapAsync('CopyPdfWorker', (compilation, callback) => {
            const source = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
            const dest = path.resolve(__dirname, 'premium/pdf.worker.min.js');
            
            fs.copyFile(source, dest, (err) => {
              if (err) {
                console.error('Failed to copy PDF worker:', err);
              } else {
                console.log('Copied PDF worker to premium/pdf.worker.min.js');
              }
              callback();
            });
          });
        }
      }
    ],
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
            name: 'premium-pdfjs',
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
    },
    plugins: [
      ...baseConfig.plugins,
      // Clean app directory build artifacts (for chatbot files)
      new CleanBuildArtifactsPlugin({
        directory: 'app',
        patterns: ['.map', '.LICENSE.txt']
      })
    ]
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
    },
    plugins: [
      ...baseConfig.plugins,
      // Clean premium directory build artifacts
      new CleanBuildArtifactsPlugin({
        directory: 'premium',
        patterns: ['.map', '.LICENSE.txt'],
        exclude: ['pdf.worker'],  // Never delete PDF worker files
        specificFiles: ['pdfImport.js', 'pdfImport.js.map']  // Old files to remove
      })
    ]
  });

  // Removed pdfImportWebPack - PDF import is now lazy-loaded from admin bundle
  // This eliminates the standalone pdfImport.js (625K) and vendors chunk (670K)
  
  return [adminWebPack, formsWebPack, chatbotWebPack];
};