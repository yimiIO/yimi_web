import httpProxy from 'http-proxy-middleware'
import logger from 'Logger'
import { forKoa as saveOperationLog } from '@xsl/utils/lib/operation-log'

export const createProxy = config => httpProxy({
  ...config,
  changeOrigin: true,
  onError: (err, req, res) => {
    logger.error(`Proxy method: ${req.method}, url: ${req.url}, err: ${err}`)
    res.end(JSON.stringify({ result: false, error: '远程服务器错误', time: Date.now() }))
  },
  onProxyRes: (proxyRes) => {
    logger.info(`Proxy method: ${proxyRes.req.method}, url: ${proxyRes.req.path} `,
      `statusCode: ${proxyRes.statusCode} statusMessage: ${proxyRes.statusMessage}`)
  },
})

export const useProxy = (matchPath, proxy) => (ctx, next) => {
  if (ctx.url.startsWith(matchPath)) {
    ctx.respond = false
    return proxy(ctx.req, ctx.res, next)
  }
  return next()
}

export const useProxyWithOperationLog = (matchPath, proxy, customHeaderFunc) => (ctx, next) => {
  // 记log
  if (ctx.url.startsWith(matchPath)) {
    ctx.respond = false
    if (customHeaderFunc) customHeaderFunc(ctx)
    saveOperationLog(ctx, logger)
    return proxy(ctx.req, ctx.res, next)
  }
  return next()
}
