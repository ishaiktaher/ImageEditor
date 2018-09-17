# ImageEditor
Fresh Prints (Image Editor)

Pre-requisites ::
Nodejs, 
Mysql (Used :: mysql-8.0.12-winx64)

<b>Steps to Open Project ::</b>

1.Before starting this project set up a mysql server and create a db "mydb" with the below credentials(refer db.js) ::
	
    host     : 'localhost',
		
    user     : 'root',
		
    password : 'password',
		
    database : 'mydb'		
		
	Execute below queries in mySql workbench ::

		CREATE DATABASE IF NOT EXISTS mydb;

		CREATE TABLE mydb.EditHistory (Time VARCHAR(255) NOT NULL DEFAULT '' PRIMARY KEY, Canvas json DEFAULT NULL)ENGINE=InnoDB DEFAULT CHARSET=latin1;

2. Now open project path in command prompt and type the below command.
 
	 npm install

	 This will install all the dependencies.

3. Start the nodejs server with the below command

		node server.js

		**If you get an AUTH mode error , Enter the below statement in mysql workbench

		ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

		else you are good to go.

4. Open chrome and navigate to http://localhost:3000

5. List of Design Requirements covered under this POC ::

	a) Project is developed on MyEAN stack. Fabric.js is used for handling modifications to canvas element.

	b) Clients can upload, rotate and scale images and text within the editor.

	c) Multiple images can be uploaded to the fabric canvas.

	d) Client can select any uploaded/added element to set it as active or to move its layer forward and backward.

	e) Clients can save their design changes on MySql DB and can retreive it any time.

	f) Clients can remove all the changes at once and can also delete a specific element.

	g) Undo/Redo option has been added .



