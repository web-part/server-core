
const qr = require('qr-image');

module.exports = {
    
    image({ url, size = 10, }) {
        let image = qr.image(url, {
            type: 'png',
            size: size,
        });

        return image;
    },


    /**
    * 
    * @param {*} app 
    * @param {*} opt 
    *   opt = {
    *       path: '/qr',
    *       size: 10,
    *       url: '',
    *   };
    */
    use(app, opt) { 
        app.get(opt.path, (req, res) => {
            let query = req.query;
            let size = Number(query.size) || opt.size || 10;

            let image = qr.image(opt.url, {
                type: 'png',
                size: size,   //默认是 5。
            });

            res.setHeader('Content-type', 'image/png');
            
            image.pipe(res);
        });
    },
};