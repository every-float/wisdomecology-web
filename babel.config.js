module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@vue/app",
    [
      "@babel/preset-env",
      { 
        modules: false 
      }
    ]
  ];
  const plugins = [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ];

  return {
    presets,
    plugins
  };
}
