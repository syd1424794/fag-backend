const express = require('express');
const port = 3500;
const bodyParser = require('body-parser');
const cors = require('cors');
var blogs = require('./routes/blogs.js');
var contacts = require('./routes/contacts.js');
var app = express();
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const mysql = require('mysql');
var connection = require('./lib/db');

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ 'msg': 'App is running' });
});

app.use('/blogs', blogs);
app.use('/contacts', contacts);

app.listen(port, () => {
    console.log(`App is listening at port: ${port}`);
});