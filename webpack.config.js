const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';
    
    return {
        mode: isProd ? 'production' : 'development',
        entry: {
            // Main files.
            index: './src/index.js',
        },
        devtool: isProd ? 'source-map' : 'eval-source-map',
        devServer: {
          static: {
            directory: path.join(__dirname, 'dist'),
          },
          watchFiles: ["./src/**/*"],
          open: true,
          hot: true,
          port: 8080,
          host: '127.0.0.1',
          allowedHosts: 'all',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                scriptLoading: 'defer',
                minify: isProd ? {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                } : false
            }),
            new CopyWebpackPlugin({
                patterns: [
                  { from: 'src/404.html', to: '404.html' }
                ]
              }),
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProd ? '[name].[contenthash].js' : '[name].bundle.js',
            clean: true,
        },
        module: {
            rules: [
                {
                    test:  /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        optimization: {
            minimize: isProd
        }
    };
};