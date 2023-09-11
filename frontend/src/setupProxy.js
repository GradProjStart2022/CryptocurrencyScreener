const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/users",
    createProxyMiddleware({
      // target: "http://127.0.0.1:8000",
      target: "http://app_network:8000",
      changeOrigin: true,
      headers: {
        "Connection": "keep-alive"
      },
    })
  );
};
