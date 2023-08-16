/**
 * @file Jest config.
 */

import { Config } from 'jest'
import path from 'path'
import * as buildArgs from './build.args'

const config: Config = {
  bail: true,
  detectOpenHandles: true,
  globals: {
    __BUILD_ARGS__: buildArgs,
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/ui/assets/__mocks__/files.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  passWithNoTests: true,
  rootDir: path.join(__dirname, '../'),
  setupFiles: ['whatwg-fetch'],
  verbose: true,
}

export default config
