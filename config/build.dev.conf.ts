import path from 'path'
import config from './build.server.conf'

export default {
  ...config,
  entry: {
    index: path.join(__dirname, './scripts/dev.ts'),
  },
}
