import path from 'path'

export default {
  isDev: process.env.NODE_ENV === 'development',
  inputDir: path.join(__dirname, '../', 'src'),
  outputDir: path.join(__dirname, '../', 'build'),
  useBundleAnalyzer: process.env.npm_config_analyze === 'true',
  skipOptimizations: process.env.NODE_ENV === 'development' || process.env.npm_config_raw === 'true',
}
