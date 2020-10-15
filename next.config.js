const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  webpack(config, options) {
    const tsRule = config.module.rules.findIndex((loader) =>
      loader.test.test('test.tsx')
    )
    console.log(config.module.rules[tsRule].use)
    // Dirty dirty dirty hack to make the zero runtime stuff work
    config.module.rules[tsRule].use = [
      ...[].concat(config.module.rules[tsRule].use),
      {
        loader: 'linaria/loader',
        options: {
          sourceMap: process.env.NODE_ENV !== 'production',
        },
      },
    ]

    return config
  },
})
