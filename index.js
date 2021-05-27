
require('colors');

const console = require('@webpart/console');
const express = require('express');

const Host = require('./modules/Host');
const Port = require('./modules/Port');

const BEGIN_PORT = 3000; //默认的开始端口号。



//
module.exports = {
    Host,
    Port,

    /**
    * 根据指定的端口号创建一个服务器并启动它。
    * 已重载 start(done);
    * 已重载 start(opt, done);
    * @param {object} opt 可选，配置选项。
    * @param {number} opt.port 端口号。
    * @param {number} opt.beginPort 当 port 为 `auto` 时，开始搜索的端口号。
    * @param {function} done 启动服务器成功后要执行的回调函数。
    */
    start(opt, done) {
        //重载 start(done);
        if (typeof opt == 'function') {
            done = opt;
            opt = null;
        }


        let { port, beginPort, } = opt || {};

        beginPort = beginPort || BEGIN_PORT;


        //不指定或指定为 `auto`，则从指定的端口号开始，自动检测可用的端口号。
        if (!port || port == 'auto') {
            Port.next(beginPort, function (port) {
                doStart(port);
            });
            return;
        }

        //否则检测指定的端口号。
        Port.test(port, function (availabe) {
            if (availabe) {
                doStart(port);
                return;
            }

            console.log(`Error:`.bold.red, `port ${port.toString().bold.italic} has been used.`.red);
        });


        function doStart(port) {
            let app = express();
            let host = Host.get();       //有可能为空串。

            app.listen(port, () => {
                let server = { port, host, };

                done && done(app, server);
            });
        }



    },
};