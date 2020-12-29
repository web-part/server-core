

const { createProxyMiddleware, } = require('http-proxy-middleware');
const $Object = require('@definejs/object');

module.exports = {

    use(app, rules) { 
        if ($Object.isPlain(rules)) {
            $Object.each(rules, (path, rule) => {
                let p = createProxyMiddleware(rule);
                app.use(path, p);
            });
        }

    },

};