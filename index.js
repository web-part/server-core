
require('colors');

const express = require('express');
const open = require('open');

const Host = require('./modules/Host');
const Port = require('./modules/Port');
const QR = require('./modules/QR');
const Proxy = require('./modules/Proxy');
const Static = require('./modules/Static');

const BEGIN_PORT = 8000;


module.exports = {


    start(config, done) {

        let {
            port = 'auto',
            beginPort = BEGIN_PORT,
            qr,
            proxy,
            statics,
        } = config;

        if (port == 'auto') {
            Port.find(beginPort, function (port) {
                start(port);
            });
        }
        else {
            Port.probe(port, function (availabe) {
                if (availabe) {
                    start(port);
                    return;
                }

                console.log(`Error:`.bold.red, `port ${port.toString().bold.italic} has been used.`.red);
                console.log(`Use option '-p auto' to find an availabe port.`.blue);

            });
        }

        function start(port) {
            let app = express();
            let host = Host.get() || 'localhost';       //有可能为空。
            let networkUrl = `http://${host}:${port}`;  //如 `http://192.168.0.100:8001`。

            //映射虚拟的静态目录。
            let dests = Static.use(app, statics);


            //代理。
            if (proxy) {
                Proxy.use(app, proxy);
            }


            app.listen(port, () => {
                console.log(`webpart server is running at`.bold.green);
                console.log('  local:'.bold, `http://localhost:${port}`.underline.cyan);
                console.log('network:'.bold, `${networkUrl}`.underline.cyan);

                //至少有一项非根目录被设置成了虚拟目录。
                if (dests.length > 0 && dests[0] != '/') {
                    console.log('statics:'.bold);
                }

                let urls = [];

                dests.forEach((dest) => {
                    if (qr) {
                        QR.use(app, {
                            'path': `${qr.path}${dest}`, //如 `/qr/htdocs`。
                            'size': qr.size,
                            'url': `${networkUrl}${dest}`, //如 `http://192.168.0.100:8001/htdocs`。
                        });
                    }

                    if (dest != '/') {
                        let url = `${networkUrl}${dest}`;
                        console.log(`  `, `${url}`.underline.cyan);

                        urls.push(url);
                    }
                });

                if (config.open) {
                    open(networkUrl, {});
                }

                done && done(app, {
                    'port': port,
                    'host': host,
                    'networkUrl': networkUrl,
                    'statics': urls,
                });
            });
        }


    },
};