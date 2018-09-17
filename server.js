var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
var url = require('url');
var mysql = require('mysql');
var isTableExist ;
var bodyParser = require('body-parser');
app.use(bodyParser.json({// support json encoded bodies
    limit: "50mb"
}));
app.use(bodyParser.urlencoded({// support encoded bodies
    limit: "50mb",
    extended: true,
    parameterLimit: 100000
}));
var resultObt;//Variable to Store Result
var db = require('./db');


/*To Serve get request/Saved Designs to client*/
app.get('/fetchFromDb', function(req, res) {

	db.query('SELECT * FROM EditHistory', function(err, results, fields) 
	{
        if (err) 
		{
			res.send('Error');
            console.log(err)
		}
		else{
				   resultObt = results;
				   res.send(resultObt);
			}
     
    });

});

/*To Save Post_request/Designs from client*/
app.post('/saveHistory', function(req, res) {
    
    var request = req.body;
    var time, canvas;
    var insert_data = [];
    for (i = 0; i < request.length; i++) {
        time = request[i]['time'];
        canvas = request[i]['canvas'];
        insert_data.push([time, canvas]);
    }
    
    var insertQuery = 'insert into EditHistory (Time,Canvas) values ?';

    db.query(insertQuery, [insert_data], function(err) {
        if (err) {
            res.send('Error');
            console.log(err)
        } else {
            res.send('Success');
            console.log("Successfully saved.");
            

        }
    });

});
  

function createTable(){
	var sql = "CREATE TABLE EditHistory (Time VARCHAR(255) NOT NULL DEFAULT '' PRIMARY KEY, Canvas json DEFAULT NULL)ENGINE=InnoDB DEFAULT CHARSET=latin1 ";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
}


