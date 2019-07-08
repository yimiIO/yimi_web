require('@babel/register')({
  plugins: [
    ['module-resolver', {
      root: ['./www'],
      // alias: {
      // // 设置常用包的别名
      //   Config: './config',
      //   Logger: './www/logger',
      // },
    }],
  ],
})

require('es6-symbol/implement')

require('./www/server')
