const proxy = require('http-proxy-middleware');
const properties = require('properties/application-local')

module.exports = function (app) {
    const target = properties.proxypath;

    app.use(proxy(
        '/api', {
            target,
            changeOrigin: true,
        }
    ));
}