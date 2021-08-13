const path = require('path');

module.exports = {
  entry: './src/cli/index.ts',
  target: 'node10',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist/cli/'),
    filename: 'index.js',
    library: {
      name: 'snyk',
      type: 'umd',
    },
  },
  node: false, // don't mock node modules
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['packages', 'node_modules'],
  },
  externals: {
    '@deepcode/dcignore': '@deepcode/dcignore', // depends on reading .dcignore files off the disk
    'snyk-policy': 'snyk-policy', // loads its own package.json in runtime, could be solved by forcing it in webpack bundle, or by updating the snyk-policy
    'snyk-resolve-deps': 'snyk-resolve-deps', // results in an empty console.log when included in `npm-modules-parser.ts`
    'snyk-try-require': 'snyk-try-require', // results in an empty console.log when included in `protect/wizard.ts`. Caused by a "module.parent" if in the module
  },
};
