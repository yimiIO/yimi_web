import bunyan from 'bunyan'
import config from 'Config' // eslint-disable-line

export default bunyan.createLogger(config.logger)
