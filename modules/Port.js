

const net = require('net');

module.exports = exports = {

    /**
    * 检测指定的端口号是否可用。
    * @param {*} port 
    * @param {*} fn 
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
    * @param {function} fn 回调函数。 
    */
    next(port, fn) {
        exports.test(port, function (availabe) {
            if (availabe) {
                fn(port);
            }
            else {
                exports.find(port + 1, fn);
            }
        });
    },
};