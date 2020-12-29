
const path = require('path');
const express = require('express');


// let key$dirs = {
//     '/': './server/',
//     '/htdocs': './htdocs/',
//     '/build': './build/',

//     '/test': [
//         './a/',
//         './b/',
//         './c/',
//     ],
// };

module.exports = {


    use(app, key$dirs) { 
        let cwd = process.cwd();

        //静态目录。
        let list = Object.keys(key$dirs).map((key) => {
            let dirs = key$dirs[key];

            if (typeof dirs == 'string') {
                dirs = [dirs];
            }

            if (!Array.isArray(dirs)) {
                throw new Error(`静态目录映射非法，对应的 key 为 ${key}`);
            }

            //确认 key 以 `/` 开头。
            if (!key.startsWith('/')) {
                key = '/' + key;
            }

            //多个目录可以映射到同一个虚拟目录。
            //访问静态资源文件时，express.static 中间件函数会根据目录的添加顺序查找所需的文件。
            dirs.forEach((dir) => {
                dir = path.join(cwd, dir);
                app.use(key, express.static(dir));
            });

            return key;
        });

        return list;

    },
};