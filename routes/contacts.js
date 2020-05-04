var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

var tableCheck = require('../lib/tableCheck');
var tableName = "contacts";
var tableQuery = "CREATE TABLE IF NOT EXISTS "+tableName+" (id INTEGER NOT NULL AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), phone VARCHAR(255), city VARCHAR(255), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, is_deleted VARCHAR(20) ,PRIMARY KEY (id) )";
tableCheck(tableName, tableQuery); 

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM contacts', function (error, results) {
        if (error) {
            throw error
        } else {
            if (!results.length) {
                res.json({ "status": 200, "data": {} })
            }
            res.json({ "status": 200, "data": results });
            console.log('Contacts: ', results);
        }
    });
});

router.post('/add', function (req, res, next) {

    var contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.city,
        is_deleted: req.body.is_deleted
    }

    connection.query('INSERT INTO contacts SET ?', contact, function (error, result) {
        if (error) {
            throw error
        } else {
            res.status(200).send({ "data": result });
            console.log('Inserted Contact: ', result);
        }
    });
});

module.exports = router; 