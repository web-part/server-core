
require('colors');

const console = require('@webpart/console');
const express = require('express');
const openUrl = require('open');

const Host = require('./modules/Host');
const Port = require('./modules/Port');
const QR = require('./modules/QR');
const Proxy = require('./modules/Proxy');
const Static = require('./modules/Static');

const BEGIN_PORT = 3000; //默认的开始端口号。



function start({ port, qr, proxy, statics, done, open, }) {
    let app = express();
    let host = Host.get();       //有可能为空。

    //映射虚拟的静态目录。
    let dests = Static.use(app, statics);


    //代理。
    if (proxy) {
        Proxy.use(app, proxy);
    }


    function process(host, dest) {
        let url = `http://${host}:${port}${dest}`;

        if (qr) {
            QR.use(app, {
                'path': `${qr.path}${dest}`, //如 `/qr/htdocs`。
                'size': qr.size,
                'url': url, //如 `http://localhost:8001/htdocs`。
            });
        }

        console.log(`  `, url.underline.cyan);
    }


    app.listen(port, () => {
        console.log(`webpart server is running at`.bold.green);


        console.log('local:'.bold);

        dests.forEach((dest) => {
            process('localhost', dest);
        });


        if (host) {
            console.log('network:'.bold);

            dests.forEach((dest) => {
                process(host, dest);
            });
        }


        if (open === true) {
            openUrl(`http://localhost:${port}`, {});
        }


        done && done(app, {
            'port': port,
            'host': host,
            'dests': dests,
        });
    });
}


module.exports = {
    start(config, done) {
        let {
            port = 'auto',
            beginPort = BEGIN_PORT,
            open,
            qr,
            proxy,
            statics,
        } = config;


        //不指定或指定为 `auto`，则从指定的端口号开始，自动检测可用的端口号。
        if (!port || port == 'auto') {
            Port.next(beginPort, function (port) {
                next(port);
            });
            return;
        }

        //否则检测指定的端口号。
        Port.test(port, function (availabe) {
            if (availabe) {
                next(port);
                return;
            }

            console.log(`Error:`.bold.red, `port ${port.toString().bold.italic} has been used.`.red);
            console.log(`Use option '-p auto' to find an availabe port.`.blue);
        });


        function next(port) {
            start({ port, qr, proxy, statics, open, done, });
        }




    },
};