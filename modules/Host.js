

const os = require('os');


module.exports = {
    
    /**
    * 获取本机的主机 IP 地址。
    */
    get() { 
        let name$list = os.networkInterfaces();
        let all = [];

        for (let name in name$list) {
            let list = name$list[name];
            all = [...all, ...list,];
        }

        let item = all.find(function (item, index) {
            return !item.internal &&
                item.family == 'IPv4' &&
                item.address !== '127.0.0.1';
        });

        return item ? item.address : '';

    },
};