
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var hbs = require('hbs');
var path = require('path');
var helpers = require('./server/components/hbshelpers');
const session = require('express-session');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



//Helpers
hbs.registerPartials(path.join(__dirname,'views/partials'),(err)=>{});
/*for(let helper in helpers){
    hbs.registerHelper(helper, helpers[helper]);
}*/


//Parsing middleware
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//Parse application/json
app.use(bodyParser.json());

//Static Files
app.use("/public",express.static('public'));

//Template Engine
app.engine('hbs',exphbs.engine( {extname: 'hbs'} ));
app.set('view engine','hbs');

app.use(express.static(path.join(__dirname, 'static')));


//Connection Pool

const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

//Connect to DB
pool.getConnection((err,connection) => {
    if(err) throw err; //not connected!
    console.log('Connected as ID' + " " + connection.threadId)
});


const routes = require('./server/routes/user');
app.use('/', routes);
const posroutes = require('./server/routes/PosSystem');
app.use('/', posroutes);

var sess;
var empname;
var isadmin;
const employeeroutes = require('./server/routes/employee');
app.use('/', employeeroutes);
const adminroutes = require('./server/routes/admin');
app.use('/', adminroutes);
const attendanceroutes = require('./server/routes/attendance');
app.use('/', attendanceroutes);



const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'inventorymanagement'
});


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'static')));


app.get('/attendance', function(request, response){
	response.render("attendancerecord");
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM employee WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				app.locals.empname = request.session.username;

				connection.connect(function(err) {
					console.log("Connected!");
					var sql = "SELECT * FROM employee WHERE username = '"+username+"' AND password = '"+password+"' AND position = 'Admin'" // setup your query
					connection.query(sql, function (err, result) {  // pass your query
					  console.log("Result: " + result);
					  if (result != "") {
						// true logic
						app.locals.isadmin = true;
						response.redirect('/adminhome');
						console.log(request.session);
						app.locals.sess= request.session.loggedin;
					  }
					  else
					  {
						// false logic
						app.locals.isadmin = false;
						app.locals.sess= request.session.loggedin;
						var iscashier= "SELECT position FROM employee WHERE username = '"+username+"'"
						connection.query(iscashier, function(err,result){
						  var emp_position = JSON.stringify(result);
						  var cond0 = '[{"position":"Cashier"}]';
						  if (emp_position === cond0){
							console.log("This is a cashier.");
							response.redirect('/OrderTransaction');
						  }else{
							console.log("This is an employee.");
							response.redirect('/employee/home');
						  }
						});
					  }
					});
				  });

				// Redirect to home page
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/logout',function(req, res){
	req.session.destroy(function(){
		app.locals.sess= false;
	  res.redirect('/');
	  console.log("out.");
	});
  }); 


app.listen(port, () => console.log(`Listening on port ${port}`));


    