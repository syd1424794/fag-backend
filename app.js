const express = require('express');
const port = 3500;
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
var app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fag'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

app.get('/', (req, res) => {
    res.json({ 'msg': 'App is running' })
})

app.listen(port, () => {
    console.log(`App is listening at port: ${port}`);
})