module.exports = {
  plugins: {
    // Transpile newer CSS features to the target browserslist depending on the env (stage)
    'postcss-preset-env': { stage: 1 },
  },
}
