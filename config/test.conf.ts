/**
 * @file Jest config.
 */

import { Config } from 'jest'
import path from 'path'
import * as buildArgs from './build.args'

const config: Config = {
  globals: {
    __BUILD_ARGS__: buildArgs,
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/files.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  rootDir: path.join(__dirname, '../'),
}

export default config
