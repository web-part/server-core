

const net = require('net');

module.exports = exports = {

    /**
    * 检测指定的端口号是否可用。
    * @param {number} port 要检测的端口号。
    * @param {function} fn 检测完成后要执行的回调函数。 
    *   fn(available)：
    *       available: true，表示端口号可用。
    *       available: false，表示端口号不可用。
    */
    test(port, fn) {
        let server = net.createServer();

        server.on('listening', function () {
            server.close();
            fn(true);
        });

        server.on('error', function (error) {
            if (error.code == 'EADDRINUSE') {
                fn(false);
            }
            else {
                fn(true);
            }
        });

        server.listen(port);
    },

    /**
    * 从指定的端口号开始检测是否可用，直到找到一个可用的为止。
    * @param {number} port 开始检测的端口号。 
    * @param {function} fn 检测成功后要执行的回调函数。
    *   fn(port):
    *       port: 通过检测得到的可用的端口号。
    */
    next(port, fn) {
        exports.test(port, function (availabe) {
            if (availabe) {
                fn(port);
            }
            else {
                exports.next(port + 1, fn);
            }
        });
    },
};