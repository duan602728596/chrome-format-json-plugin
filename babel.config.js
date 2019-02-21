/* Babel config for babel-eslint */

module.exports = function(api) {
  api.cache.never();

  return {
    presets: [
      '@babel/preset-typescript'
    ]
  };
};