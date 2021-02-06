// file-name: app-middlewares/tweets.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const verifyToken = require('../config/verify-token');

router.post('/auth', (req, res) => {
  console.log('Req Data: ', req.body);
  let email= req.body.email;
  let password = req.body.password;
  db.query('SELECT * FROM user WHERE email = ?',[email], function (error, results) {
    if (error) {
      res.status(400).send({"status": "fail", "error": error});
    }else{
      if(results.length > 0){
        const comparision = bcrypt.compareSync(password, results[0].password)
        if(comparision){
          let token = jwt.sign({email}, keys.accessKey, { expiresIn: 1800 });
          console.log('Access Token: ', token);
          res.send({
            "statusCode": 200,
            "status": "success",
            "msg":"login sucessfull",
            "token": 'Bearer '+token,
            "tokenExpiryTime": 1800
          }) 
        }
        else{
          res.send({
              "statusCode": 206,
              "status": "failure",
              "msg":"Email and password does not match"
          })
        }
      }
      else{
        res.send({
          "statusCode": 204,
          "status": "failure",
          "msg":"Email does not exist"
        });
      }
    }
  });

});

router.post('/register',verifyToken ,(req, res) => {
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);
  var users={
    "name": req.body.name,
    "email":req.body.email,
    "phone": req.body.phone,
    "password":encryptedPassword
   }

  db.query('INSERT INTO user SET ?',users, function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    } else {
      let userData = {
        "userData": { "id": results.insertId,
                      "email": req.body.email,
                      "name": req.body.name
                    },
        "status": "success"
      }
      console.log('Result: ', results);
      res.status(200).json(userData);
    }
  });
})

module.exports = router;
