const Koa = require('koa')
const serve =  require('koa-static')
const path = require('path')

const logger = console

const app = new Koa()

// 配置静态web服务的中间件
app.use(serve(path.resolve(__dirname, '../app'), { maxage: 15 * 24 * 3600 * 1000 }))

app.on('error', (err, ctx) => {
  logger.error(`Server error: ${err.stack} \n ctx: ${JSON.stringify(ctx)}`)
})

app.listen(9000, logger.info('Server is ready for http://localhost:9000!'))

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException:', err.message)
  if (err.message.indexOf(' EADDRINUSE ') > -1) {
    process.exit()
  }
})

process.on('unhandledRejection', (err) => {
  logger.error(`unhandledRejection: ${err.message}`)
})
