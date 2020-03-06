//import properties from 'properties/application-local'

const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    const target = 'https://swaap-music-back.herokuapp.com';
    //const target = 'http://localhost:1234';

    app.use(proxy(
        '/api', {
            target,
            changeOrigin: true,
        }
    ));
}