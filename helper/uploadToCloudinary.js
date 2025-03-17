const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: 'dp7yw2fwp',
    api_key: '263261148224351',
    api_secret: 'cITpNDC5E7T7M2aOJHbHxh_NWZk' // Click 'View API Keys' above to copy your API secret
});

module.exports.uploadToCloud = function (req, res, next) {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.url;
            next();
        }
        upload(req);
    } else {
        next();
    }
}