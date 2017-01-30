module.exports = {
  cache: {
    cacheId: "electrode",
    runtimeCaching: [{
      handler: "fastest",
      urlPattern: "\/$"
    }],
    staticFileGlobs: ['dist/**/*']
  },
  manifest: {
    background: "#FFFFFF",
    title: "electrode",
    short_name: "PWA",
    theme_color: "#FFFFFF"
  }
};
