const express = require('express');
const port = 3500;
const bodyParser = require('body-parser');
const cors = require('cors');
var blogs = require('./routes/blogs.js');
var app = express();

const mysql = require('mysql');
var connection = require('./lib/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ 'msg': 'App is running' });
});

app.use('/blogs', blogs);

app.listen(port, () => {
    console.log(`App is listening at port: ${port}`);
})