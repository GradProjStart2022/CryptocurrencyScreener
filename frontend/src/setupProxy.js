const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/users",
    createProxyMiddleware({
      // target: "http://127.0.0.1:8000",
      target: "http://back-web:8000",
      changeOrigin: true,
      headers: {
        "Connection": "keep-alive"
      },
    })
  );
};
