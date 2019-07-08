import webpack from 'webpack'
import chokidar from 'chokidar'
import path from 'path'
import logger from 'Logger'
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'
import webpackConfig from '../webpack/webpack.config.dev'

const compiler = webpack(webpackConfig)

export default (app) => {
  // server-side hot-reload
  const watcher = chokidar.watch(path.resolve(__dirname, '../www'), { ignored: /server\.js/ })
  watcher.on('ready', () => {
    logger.info(`will watching at '${path.resolve(__dirname, '../www')}`)
    watcher.on('all', (event, file) => {
      logger.info(`server-side hot-reload due to: ${file}`)
      Object.keys(require.cache).forEach((id) => {
        if (/\/www\//.test(id)) {
          delete require.cache[id]
        }
      })
      delete require.cache[path.resolve(__dirname, './server.js')]
    })
  })

  const devMiddleware2 = devMiddleware(compiler, { // eslint-disable-line
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
    },
  })

  const hotMiddleware2 = hotMiddleware(compiler) // eslint-disable-line

  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
      // hotMiddleware2.publish({ action: 'reload' })
      if (cb) cb()
    })
  })
  // serve webpack bundle output
  app.use(devMiddleware2)

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware2)
}
