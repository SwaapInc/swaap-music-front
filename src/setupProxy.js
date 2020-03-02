//import properties from 'properties/application-local'

const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    const target = 'http://localhost:1234'; //set to http://localhost:1234 in local

    app.use(proxy(
        '/api', {
            target,
            changeOrigin: true,
        }
    ));
}