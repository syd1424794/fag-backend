var connection = require('../lib/db');

var tableCheck = function (tableName, tableQuery) {
    var tableCheck = "SELECT * FROM information_schema.tables WHERE table_schema = '"+connection.config.database+"' AND table_name = '"+tableName+"' LIMIT 1;";
    connection.query(tableCheck, function (error, result) {
        if (!!error) {
            console.log(error);
        }
        else if (result.length > 0) {
            console.log('Table already exists');
            // console.log(result.length);
        }
        else {
            console.log('Creating Table...');
            // console.log(result.length);
            connection.query(tableQuery, function (error) {
                if (!!error) {
                    console.log(error);
                }
                else {
                    console.log(tableName+" Table Created");
                }
            });
        }
    });
}

module.exports = tableCheck;