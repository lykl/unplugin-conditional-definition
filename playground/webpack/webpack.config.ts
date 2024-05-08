import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import UnpluginConditionalDefinition, {
  loader as ConditionalDefinitionLoader,
} from 'unplugin-conditional-definition/webpack'
import { DefinePlugin, type Configuration } from 'webpack'
import path from 'node:path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isDEV = process.env.NODE_ENV === 'development'

export default <Configuration>{
  mode: (process.env.NODE_ENV as any) ?? 'development',
  entry: './src/main.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      vue$: '@vue/runtime-dom',
      '@': path.resolve('src'),
    },
  },
  devtool: 'eval-source-map',
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    }),
    new VueLoaderPlugin(),
    !isDEV ? new MiniCssExtractPlugin() : null,
    UnpluginConditionalDefinition({
      env: ['LABTOP'],
      mode: 'strict',
      include: [/\.(?:sa|s?c)ss$/, /\.[jt]sx?$/, /\.vue$/],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, './index.html'),
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        resourceQuery: /raw/, // or /inline/
        type: 'asset/source',
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        exclude: /node_modules/,
        type: 'asset',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        exclude: /node_modules/,
        type: 'asset',
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader', ConditionalDefinitionLoader],
      },
      {
        test: /\.s(?:a|c)ss$/,
        exclude: /node_modules/,
        use: [
          isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { import: true } },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { import: true } },
        ],
      },
      {
        test: /\.([cm]?ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
}
