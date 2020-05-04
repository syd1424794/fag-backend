var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

var tableCheck = require('../lib/tableCheck');
var tableName = "blogs";
var tableQuery = "CREATE TABLE IF NOT EXISTS "+tableName+" (id INTEGER NOT NULL AUTO_INCREMENT, title TEXT, short_desc TEXT, category VARCHAR(255), tags TEXT, description MEDIUMTEXT, featured_img TEXT, img_thumbnail TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, is_deleted VARCHAR(20) ,PRIMARY KEY (id) )";
tableCheck(tableName, tableQuery); 

router.get('/', function (req, res, next) {
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