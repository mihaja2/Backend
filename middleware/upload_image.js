var multer = require('multer');
var fs = require('fs');
module.exports.files={
    storage:function(){
        var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const { type } = req.params;
            const dir = `images/${type}/`
            fs.exists(dir, exist => {
            if (!exist) {
              return fs.mkdir(dir, error => cb(error, dir))
            }
            return cb(null, dir);
            })
          // cb(null, 'images/profiles/')
        },
        filename: function (req, file, cb) {
            const { type } = req.params;
            // cb(null, Date.now()+'_'+file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            cb(null, `${Date.now()}_${type}_${file.originalname}`)
        }
      })
      
      return storage;
},
allowedFiles:function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
        return cb(new Error('Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
    }
    cb(null, true);
}
}