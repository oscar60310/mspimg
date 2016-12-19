var fs = require('fs');
var shortid = require('shortid');
var azure = require('azure-storage');
const maxSize = 4000000; // 4MB
function web(req, res) {
    var size = req.get('content-length');
    if (size > maxSize) {
        return res.end('too large');
    }
    var id = shortid.generate();
    var st = req.pipe(fs.createWriteStream('./temp/' + id));
    st.on('finish', function () {
        try {
            var blobService = azure.createBlobService(process.env.blobname, process.env.blobkey);
            blobService.createBlockBlobFromLocalFile('image', id, './temp/' + id, { contentSettings: { contentType: 'image/jpeg' } }, function (error, result, response) {
                fs.unlinkSync('./temp/' + id);
                if (!error) {
                    res.end('https://' + process.env.blobname + '.blob.core.windows.net/image/' + id);
                }
                else
                    res.end('error');
            });
        }
        catch (err) {
            console.log(err);
            res.sendStatus(401);
        }
    });

}
module.exports = {
    web: web
};