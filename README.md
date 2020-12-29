# @webpart/server

用于开发阶段的本地 web 服务器。

## 安装
``` bash
npm install --save-dev @webpart/server
```

## 示例
``` javascript

const server = require('@webpart/server');

const config = {
    port: 8001, //端口号。
    open: true, //是否自动打开浏览器。

    //生成对应的二维码页面。
    qr: {
        path: '/qr',    //二维码页面的虚拟地址。
        size: 10,       //二维码图片的大小。
    },

    //要映射生成的静态虚拟目录。
    //支持一对多的关系，会根据目录的添加顺序查找所需的文件。
    statics: {
        '/': './server/',
        '/htdocs': './htdocs/',
        '/build': './build/',

        '/test': [ 
            './a/',
            './b/',
        ],
    },

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

const app = server.start(config, function () {
    console.log('done.');
});

```