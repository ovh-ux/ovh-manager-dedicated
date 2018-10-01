const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');

const folder = './client/app';
const bundles = {};

const webpackConfig = require('@ovh-ux/manager-webpack-config');

fs.readdirSync(folder).forEach((file) => {
  const stats = fs.lstatSync(`${folder}/${file}`);
  if (file === 'components') return;
  if (stats.isDirectory()) {
    const jsFiles = glob.sync(`${folder}/${file}/**/!(*.module).js`);
    if (jsFiles.length > 0) {
      bundles[file] = jsFiles;
    }
  }
});

module.exports = (env = {}) => {
  /* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
  const { config } = webpackConfig({
    template: './client/app/index.html',
    basePath: './client/app',
    lessPath: [
      './node_modules',
    ],
    root: path.resolve(__dirname, './client/app'),
    assets: {
      files: [
        { from: path.resolve(__dirname, './node_modules/angular-i18n'), to: 'resources/angular/i18n' },
        { from: path.resolve(__dirname, './client/**/*.html'), context: 'client/app' },
        { from: path.resolve(__dirname, './client/app/images/**/*.*'), context: 'client/app' },
        { from: path.resolve(__dirname, './node_modules/@ovh-ux/ovh-utils-angular/src/**/*.html'), context: 'node_modules/@ovh-ux/ovh-utils-angular/src', to: 'components/ovh-utils-angular' },
        { from: path.resolve(__dirname, './node_modules/ovh-module-exchange/src/exchange/**/*.html'), context: 'node_modules/ovh-module-exchange/src' },
      ],
    },
  }, env);
  /* eslint-enable */

  config.plugins.push(new webpack.DefinePlugin({
    WEBPACK_ENV: {
      region: JSON.stringify(env.region),
      production: JSON.stringify(env.production),
    },
  }));

  if (env.region === 'eu' || env.region === 'ca') {
    bundles.exchange = [].concat(
      glob.sync('./node_modules/ovh-module-exchange/src/exchange/**/*.module.js'),
      glob.sync('./node_modules/ovh-module-exchange/src/exchange/**/!(*.module).js'),
    );
  }

  return merge(config, {
    entry: _.assign({
      index: './client/app/index.js',
      app: ['./client/app/app.js', './client/app/app.controller.js', './client/app/app.routes.js'],
      modules: glob.sync('./client/app/**/*.module.js'),
      components: glob.sync('./client/app/components/**/!(*.module).js'),
    }, bundles),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].bundle.js',
    },
    resolve: {
      alias: {
        jquery: path.resolve(__dirname, 'node_modules/jquery'),
      },
    },
  });
};
