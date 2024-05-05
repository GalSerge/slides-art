const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@reducers': path.resolve(__dirname, 'src/reducers'),
      '@slides': path.resolve(__dirname, 'src/components/slides'),
      '@editor': path.resolve(__dirname, 'src/components/editor'),
      '@room': path.resolve(__dirname, 'src/components/room'),
      '@profile': path.resolve(__dirname, 'src/components/profile'),
      '@constants': path.resolve(__dirname, 'src/Constants'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  devServer: {
    port: 5000
  }
};