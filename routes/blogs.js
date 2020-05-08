var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

var tableCheck = require('../lib/tableCheck');
var tableName = "blogs";

const { check, validationResult } = require('express-validator');

var tableQuery = "CREATE TABLE IF NOT EXISTS " + tableName + " (id INTEGER NOT NULL AUTO_INCREMENT, title TEXT, short_desc TEXT, category VARCHAR(255), tags TEXT, description MEDIUMTEXT, featured_img TEXT, img_thumbnail TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, is_deleted VARCHAR(20) ,PRIMARY KEY (id) )";

tableCheck(tableName, tableQuery);

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

router.post('/add',
    [
        check('title').not()
            .isEmpty()
            .withMessage('Title is required')
            .isLength({ min: 3, max: 150 })
            .withMessage('Must not be less than 3 characters or more than 150'),
        check('short_desc').not()
            .isEmpty()
            .withMessage('Short Description is required')
            .isLength({ min: 50 })
            .withMessage('Must not be less than 50 characters'),
        check('category').not()
            .isEmpty()
            .withMessage('Category is required'),
        check('description').not()
            .isEmpty()
            .withMessage('Description is required')
            .isLength({ min: 50 })
            .withMessage('Must not be less than 50 characters'),
        check('featured_image').not()
            .isEmpty()
            .withMessage('Featured Image is required')
    ],

    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors: ', errors.array());
            return res.status(422).json({ errors: errors.array() });
        }

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
    }
);

router.get('/edit/:id', function (req, res) {
    let blog_id = req.params.id;
    // console.log(blog_id);
    connection.query('SELECT * FROM blogs WHERE id = ' + blog_id, function (error, result) {
        if (error) {
            throw error
        } else {
            if (!result.length) {
                return res.json({ "status": 200, "data": {} });
            }
            res.json({ "status": 200, "data": result });
            console.log('Single Blog: ', result);
        }
    });
});

module.exports = router; 