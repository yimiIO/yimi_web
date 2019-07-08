import logger from 'Logger'
import { qiniu } from 'Config'
import request from 'axios'

export const getQiniuToken = () => async (ctx) => {
  try {
    const { sessionKey, zone, domain } = qiniu
    const {
      data: {
        obj: { token: uploadToken },
      },
    } = await request({
      method: 'get',
      url: `${qiniu.tokenDomain}/uploadToken`,
      params: {
        sessionKey,
        space: qiniu.bucketName,
      },
      timeout: 4500,
    })
    ctx.body = { uploadToken, zone, domain }
  } catch (e) {
    logger.error(`error in getQiniuToken, ${e.stack}`)
    ctx.body = e.message || '获取七牛上传token出错'
    ctx.status = e.status || 500
  }
}
