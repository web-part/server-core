# @webpart/server-core

用于开发阶段的本地 web 服务器的核心部分。

## 安装
``` bash
npm install --save-dev @webpart/server-core
```

## 示例
``` javascript

const server = require('@webpart/server-core');

let config = {
    port: 'auto', //必选，端口号。
    open: true, //可选，是否自动打开浏览器。

    //可选。
    //生成对应的二维码页面。
    qr: {
        path: '/qr',    //二维码页面的虚拟地址。
        size: 10,       //二维码图片的大小。
    },

    //可选。
    //要映射生成的静态虚拟目录。
    //支持一对多的关系，会根据目录的添加顺序查找所需的文件。
    statics: {
        '/': './',
        '/htdocs': './htdocs/',
        '/build': './build/',

        '/test': [ 
            './a/',
            './b/',
        ],
    },

    //可选。
    //代理规则。
    proxy: {
        '/api/': {
            target: 'http://your.target.com/',
            changeOrigin: true,
            pathRewrite: {
                '^/api/': '/',
            },
        },
    },
};

const app = server.start(config, function (info) {
    console.log('done.');
});

```