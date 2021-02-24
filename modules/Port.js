

const net = require('net');

module.exports = exports = {

    probe(port, fn) {
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

    find(port, fn) {
        exports.probe(port, function (availabe) {
            if (availabe) {
                fn(port);
            }
            else {
                exports.find(port + 1, fn);
            }
        });
    },
};