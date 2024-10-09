module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Giữ lại preset này
    plugins: [
      // Không thêm "expo-router/babel" vào đây
    ],
  };
};
