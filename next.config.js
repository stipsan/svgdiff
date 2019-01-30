const withCSS = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')

module.exports = withCSS(
  withTypescript({
    target: 'serverless',
    webpack(config, options) {
      const tsRule = config.module.rules.findIndex(loader =>
        loader.test.test('test.tsx')
      )
      // Dirty dirty dirty hack to make the zero runtime stuff work
      config.module.rules[tsRule].use = [
        config.module.rules[tsRule].use,
        {
          loader: 'linaria/loader',
          options: {
            sourceMap: process.env.NODE_ENV !== 'production'
          }
        }
      ]

      return config
    }
  })
)
