const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Set public path for GitHub Pages
  config.output.publicPath = '/NorthsideExpress/';

  return config;
};