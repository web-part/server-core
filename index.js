
const colors = require('colors');
const express = require('express');
const open = require('open');

const Host = require('./modules/Host');
const Port = require('./modules/Port');
const QR = require('./modules/QR');
const Proxy = require('./modules/Proxy');
const Static = require('./modules/Static');

const BEGIN_PORT = 3000;



function start({ port, qr, proxy, statics, done, }) {
    let app = express();
    let host = Host.get() || 'localhost';       //有可能为空。
    let networkUrl = `http://${host}:${port}`;  //如 `http://192.168.0.100:8001`。
    let localUrl = `http://localhost:${port}`;  //如 `http://localhost:8001`。

    //映射虚拟的静态目录。
    let dests = Static.use(app, statics);


    //代理。
    if (proxy) {
        Proxy.use(app, proxy);
    }


    app.listen(port, () => {
        console.log(`webpart server is running at`.bold.green);
        console.log('  local:'.bold, `${localUrl}`.underline.cyan);
        console.log('network:'.bold, `${networkUrl}`.underline.cyan);

        //至少有一项非根目录被设置成了虚拟目录。
        if (dests.length > 0 && dests[0] != '/') {
            console.log('statics:'.bold);
        }

        let statics = [];

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

                statics.push(dest);
            }
        });

        if (config.open) {
            open(networkUrl, {});
        }

        done && done(app, {
            'port': port,
            'host': host,
            'localUrl': localUrl,
            'networkUrl': networkUrl,
            'statics': statics,
        });
    });
}


module.exports = {
    start(config, done) {
        let {
            port = 'auto',
            beginPort = BEGIN_PORT,
            qr,
            proxy,
            statics,
        } = config;

        //不指定或指定为 `auto`，则从指定的端口号开始，自动检测可用的端口号。
        if (!port || port == 'auto') {
            Port.next(beginPort, function (port) {
                start({ port, qr, proxy, statics, done, });
            });
            return;
        }

        //否则检测指定的端口号。
        Port.test(port, function (availabe) {
            if (availabe) {
                start({ port, qr, proxy, statics, done, });
                return;
            }

            console.log(`Error:`.bold.red, `port ${port.toString().bold.italic} has been used.`.red);
            console.log(`Use option '-p auto' to find an availabe port.`.blue);
        });
        


    },
};