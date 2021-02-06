const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

router.use(function (req, res, next) {
    var token = req.headers['authorization'];
    let newToken = token?.split(' ');
    token = newToken[newToken?.length - 1];
    console.log(token);
    if (token) {
        jwt.verify(token, keys.accessKey, function (err, decoded) {
        if (err) {
            let errordata = {
                message: err.message,
                expiredAt: err.expiredAt
            };
            console.log(errordata);
            return res.status(401).json({
                message: 'Unauthorized Access'
            });
        }
        req.decoded = decoded;
        console.log(decoded);
        next();
    });
    } else {
        return res.status(403).json({
            message: 'Forbidden Access'
        });
    }
});

module.exports = router;
