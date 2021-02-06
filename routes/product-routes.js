const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../config/verify-token');
const {body, validationResult} = require('express-validator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

function allowedFiles(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
      return cb(new Error('Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
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

// const productValidation = require('../validations/product_validations');

router.get('/get-all', verifyToken, (req, res, next) => {
  // res.send({data: 'all products'});
  db.query("Select * from products where is_active = ? ", 'yes', function (err, results) {
        if(err) {
            console.log("Products Fetching Error: ", err);
            res.status(400).send({status: 'failure', error: err});
        }
        else{
            res.status(200).send({status: 'success', products: results});
        }
    });
});

router.post('/add-new',[
  verifyToken,
  upload.single('image_thumbnail')
], (req,res,next) => {

  console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk :', req.files);
  console.log('ooooooooooooooooooooooooooooooooooooooooo :', req.body); 
  let products = {
    "name": req.body.name,
    "slug": req.body.slug,
    "description": req.body.description,
    "price": req.body.price,
    "discount": req.body.discount,
    "image_thumbnail": req.file.path,
    "featured_image": req.body.featured_image,
    "image_gallery": req.body.image_gallery,
    "category": req.body.category,
    "colors": req.body.colors,
    "size": req.body.size,
    "tags": req.body.tags,
    "availability": req.body.availability,
    "sold_by": req.body.sold_by,
    "meta_title": req.body.meta_title,
    "meta_keywords": req.body.meta_keywords,
    "meta_description": req.body.meta_description
  }
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    console.log('Product Validation Errors', errors);
    res.status(422).json({ errors: errors.array() });
    return;
  }

  db.query('INSERT INTO products SET ?',products, function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred",
        "error": error
      })
    } else {
      let productData = {
        "productData": { "id": results.insertId},
        "status": "success"
      }
      console.log('Result: ', results);
      res.status(200).json(productData);
    }
  });
});

module.exports = router;
