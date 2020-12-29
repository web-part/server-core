
require('colors');

const express = require('express');
const open = require('open');

const Host = require('./modules/Host');
const QR = require('./modules/QR');
const Proxy = require('./modules/Proxy');
const Static = require('./modules/Static');




module.exports = {


    start(config, done) {
        let { port, qr, proxy, statics, } = config;

        let app = express();
        let host = Host.get();
        let networkUrl = `http://${host}:${port}`; //如 `http://192.168.0.100:8001`。

        //映射虚拟的静态目录。
        let dests = Static.use(app, statics);


        //代理。
        if (proxy) {
            Proxy.use(app, proxy);
        }


        app.listen(port, () => {
            console.log(`webpart server is running at`.bold.green);
            console.log('  local:'.bold, `http://localhost:${port}`.cyan);
            console.log('network:'.bold, `${networkUrl}`.cyan);

            //至少有一项非根目录被设置成了虚拟目录。
            if (dests.length > 0 && dests[0] != '/') {
                console.log('statics:'.bold);
            }

            dests.forEach((dest) => {
                if (qr) {
                    QR.use(app, {
                        'path': `${qr.path}${dest}`, //如 `/qr/htdocs`。
                        'size': qr.size,
                        'url': `${networkUrl}${dest}`, //如 `http://192.168.0.100:8001/htdocs`。
                    });
                }

                if (dest != '/') {
                    console.log(`  ${networkUrl}${dest}`.cyan);
                }
            });

            if (config.open) {
                open(networkUrl, {});
            }

            done && done(app);
        });



        return app;

    },
};