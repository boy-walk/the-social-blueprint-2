const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,

  // Better caching to prevent rebuilding everything
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  optimization: {
    ...defaultConfig.optimization,
    moduleIds: 'deterministic', // Stable module IDs
    runtimeChunk: 'single', // Extract runtime to separate file
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk for node_modules
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        // Common chunk for shared code
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },

  // Only rebuild what changed in watch mode
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, // Delay rebuild after first change (ms)
  },

  // Better performance
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};