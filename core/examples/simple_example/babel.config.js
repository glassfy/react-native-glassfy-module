module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-glassfy-module': '../../src/index',
        },
      },
    ],
  ],
};
