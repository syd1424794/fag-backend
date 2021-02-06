const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../config/verify-token');
const {body, validationResult} = require('express-validator');
const multer = require('multer');
const path = require('path');
var fs = require('fs');
var fileType = '';
var uploadPath = '';
const uploadMainDir = 'uploads';
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var fileName = '';
const storage = multer.diskStorage({ 
    destination: function(req, file, cb) {
        if (!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')){
            fileType = 'docs';
        }
        else{
            fileType = 'images';
        }
        uploadPath = `../${uploadMainDir}/${fileType}/${currentYear}/${monthNames[currentMonth]}`;
        cb(null, path.join(__dirname, uploadPath));
    },
    filename: function (req, file, cb) {
        fileName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
        cb(null, fileName);
    }
});
  
function allowedFiles(req, file, cb) {
    // Accept images only
    if (!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')) {
        req.fileValidationError = 'Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
        return cb(new Error('Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
    }
    let dir = `./${uploadMainDir}/${fileType}/${currentYear}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        dir = dir + '/' + monthNames[currentMonth];
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
    cb(null, true);
}
  
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2MB
    },
    fileFilter: allowedFiles
});

router.post('/add-files',[verifyToken, upload.single('single_media_file')], (req, res, next) => {
    console.log('Req Media File: ', req.file);
    let mediaFile = {
        name: fileName,
        type: req.file.mimetype,
        path: `${uploadMainDir}/${fileType}/${currentYear}/${monthNames[currentMonth]}/${fileName}`,
        media_alt: req.body.media_alt
    }

    db.query('INSERT INTO media SET ?', mediaFile, (error, results, fields) => {
        if (error) {
            console.log('Media File Error :', error);
            res.send({
              "code":400,
              "failed":"error ocurred",
              "error": error
            })
          } else {
            let mediaFileData = {
              "mediaFileData": { "id": results.insertId},
              "status": "success"
            }
            console.log('Result: ', results);
            res.status(200).json(mediaFileData);
        }
    })
    
})

module.exports = router;