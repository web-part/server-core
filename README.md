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
    port: 'auto',       //必选，端口号。
    beginPort: 3001,    //当 port 为 `auto` 时，开始搜索的端口号。
};

const app = server.start(config, function (server) {
    console.log('server:', server);
});

```