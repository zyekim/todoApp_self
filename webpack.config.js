const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {
  // options -> 개발용 제품용 구분할 수있다.
  const config = {
    // 중복되는 옵션...
    // devtool
    // - eval : 웹팩 build 시간 축소(디버깅가능), 단 파일용량 커질수 있다.
    // - cheap-module-source-map 최적화 용량 작음, (디버깅X) 시간 지연가능
    resolve: {
      // 확장자 생략가능
      extensions: ['.js', '.vue']
    },
    // 진입점 - 프로젝트가 실행되기 앞서 가장 먼저 실행되야하는 파일
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    // 결과물에 대한 설정 dist폴더 생성해 app.js에 넣겠다.
    output: {
      filename: '[name].js', // 진입점 이름이 들어가 app.js로 된다
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
          test: /\.css$/,
          use: [
            // 순서 중요
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader', // 순서 세번째로
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'assets/',
            to: ''
          }
        ]
      })
    ]
  }
  if (opts.mode === 'development') {
    // 개발용
    return merge(config, {
      // 추가 개발용 옵션
      devtool: 'eval',
      devServer: {
        open: false, // 브라우저 강제이동
        hot: true// 기본값이라 생략가능
      }
    })

    // 제품용
  } else {
    return merge(config, {
      // 추가 제품용 옵션
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
