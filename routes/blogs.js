var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

router.get('/all', function (req, res, next) {
    connection.query('SELECT * FROM blogs', function (error, results) {
        if (error) {
            throw error
        } else {
            if (!results.length) {
                res.json({ "status": 200, "data": {} })
            }
            res.json({ "status": 200, "data": results });
            console.log('Blogs: ', results);
        }
    });
});

router.post('/add', function (req, res, next) {

    var blog = {
        title: req.body.title,
        short_desc: req.body.short_desc,
        category: req.body.category,
        tags: req.body.tags,
        description: req.body.description,
        featured_image: req.body.featured_image,
        img_thumbnail: req.body.img_thumbnail
    }

    connection.query('INSERT INTO blogs SET ?', blog, function (error, result) {
        if (error) {
            throw error
        } else {
            res.status(200).send({ "data": result });
            console.log('Inserted Blog: ', result);
        }
    });
});

module.exports = router; 