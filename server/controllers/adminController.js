const mysql = require("mysql");
const session = require('express-session');
const path = require('path');

//Connection Port
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//main home page
exports.adminHome = (req,res) => {

  var sess= req.app.locals.sess;
  var isadmin = req.app.locals.isadmin;
  let empname = req.app.locals.empname;

  if (sess==true && isadmin==true) {
		// Output username
    res.render("home" );
    console.log("You're in the main admin page."+empname);
    return empname;
	} else {
		// Not logged in
		res.render("errorlogin", {title: 'Error!', layout: 'empty'});
	}
};

//View Employees
exports.view = (req, res) => {

    var sess= req.app.locals.sess;
    var isadmin = req.app.locals.isadmin;

    if (sess==true && isadmin==true) {
      // Output username
      pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("Employee database is connected.");
    
        connection.query('SELECT * FROM employee', (err, rows)=> {
          connection.release();
    
          if(!err){
            res.render('adminmanage', {rows});
          } else {
            console.log(err);
          }
        });
      });
    } else {
      // Not logged in
      res.render("errorlogin", {title: 'Error!', layout: 'empty'});
    }
  };
  
  //Search Employees
  exports.find = (req, res) => {
  
      //Connect to DB
      pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("Searching employee.");
    
        let searchTerm = req.body.search;
  
        
        connection.query("SELECT * FROM employee WHERE emp_lastname LIKE ? OR emp_firstname LIKE ? OR emp_id LIKE ?",
        ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"], (err, rows)=> {
          connection.release();
    
          if(!err){
            res.render("adminmanage", { rows });
          } else {
            console.log(err);
          }
        }
        );
      });
  };

  //Go to add an employee
  exports.employeeform = (req, res) => {

    var sess= req.app.locals.sess;
    var isadmin = req.app.locals.isadmin;

if (sess==true && isadmin==true) {
  // Output username
  res.render("addemployee");
  console.log("Going to Add Employee page.");
} else {
  // Not logged in
  res.send('Please login to view this page!');
}
  };

  // Add new employee
exports.createEmployee = (req, res) => {
  //res.render('addemployee');

  var sess= req.app.locals.sess;
  var isadmin = req.app.locals.isadmin;

if (sess==true && isadmin==true) {
  pool.getConnection((err, connection) => {
    const { e_code, e_lastname, e_firstname, e_suffix, e_phone, e_address, e_position, e_username, e_password, e_status } = req.body;

    if (err) throw err; //not connected

    let searchTerm = req.body.search;

    // Connect Teacher
    connection.query(
      "INSERT INTO employee SET emp_id = ?, emp_lastname = ?, emp_firstname = ?, employeeSuffix = ?, phone = ?, address = ?, position = ?, username = ?, password = ?, status = ?",
      [e_code, e_lastname, e_firstname, e_suffix, e_phone, e_address, e_position, e_username, e_password, e_status],
      (err, rows) => {
        //When done with connection, release it
        connection.release();

        if (!err) {
          res.render("addemployee", { alert: "Employee added successfully!" });
        } else {
          console.log("Error loading the data.");
        }

        console.log("I added the employee to your database.");
      }
    );
  });
} else {
  // Not logged in
  res.render("errorlogin", {title: 'Error!', layout: 'empty'});
}
};

// place details to Edit teacher
exports.editEmployee = (req, res) => {
  //res.render('edit-teacher');
  var sess= req.app.locals.sess;
  var isadmin = req.app.locals.isadmin;

if (sess==true && isadmin==true) {
  // Output username
  console.log("Going to edit an employee.");

  //Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("*");

    // Connect Teacher
    connection.query(
      "SELECT * FROM employee WHERE emp_id = ?",
      [req.params.id],
      (err, rows) => {
        //When done with connection, release it
        connection.release();

        if (!err) {
          res.render("editemployee", { rows });
        } else {
          console.log("Error loading the data.");
        }

        console.log("Caught employee's details.");
      }
    );
  });
} else {
  // Not logged in
  res.render("errorlogin", {title: 'Error!', layout: 'empty'});
}
};

// Update employee details
exports.updateEmployee = (req, res) => {
  //res.render('edit-teacher');
  var sess= req.app.locals.sess;
  var isadmin = req.app.locals.isadmin;

if (sess==true && isadmin==true) {
    // Output username
    const { e_lastname, e_firstname, e_suffix, e_phone, e_address, e_position, e_username, e_password, e_status } = req.body;

    console.log("Got the employee. Going to update their details.");
  
    //Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err; //not connected
      console.log("*");
  
      // Connect Employee
      connection.query(
        "UPDATE employee SET emp_lastname = ?, emp_firstname = ?, employeeSuffix = ?, phone = ?, address = ?, position = ?, username = ?, password = ?, status = ? WHERE emp_id = ?",
        [ e_lastname, e_firstname, e_suffix, e_phone, e_address, e_position, e_username, e_password, e_status, req.params.id],
        (err, rows) => {
          //When done with connection, release it
          connection.release();
  
          if (!err) {
  
            pool.getConnection((err, connection) => {
              if (err) throw err; //not connected
  
              // Connect Employee
              connection.query(
                "SELECT * FROM employee WHERE emp_id = ?",
                [req.params.id],
                (err, rows) => {
                  //When done with connection, release it
                  connection.release();
                  if (!err) {
                    res.render("editemployee", { rows, alert: `${e_lastname} has been updated!` });
                  } else {
                    console.log("Error loading the data.");
                  }
  
                  console.log("Updating employee successful.");
                }
              );
            });
          } else {
            console.log("Error loading the data.");
          }
  
          console.log("*");
        }
      );
    });
  } else {
    // Not logged in
    res.render("errorlogin", {title: 'Error!', layout: 'empty'});
  }

};


exports.deleteEmployee = (req, res) => {
  //res.render('edit-teacher');

  var sess= req.app.locals.sess;
  var isadmin = req.app.locals.isadmin;

if (sess==true && isadmin==true){
  // Output username
  console.log("Going to delete a employee.");

  //Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("*");

    // Connect Teacher
    connection.query(
      "DELETE FROM employee WHERE emp_id = ?",
      [req.params.id],
      (err, rows) => {
        //When done with connection, release it
        connection.release();

        if (!err) {
          res.redirect('/adminhome');
        } else {
          console.log("Error loading the data.");
        }

        console.log("Employee deleted from the database.");
      }
    );
  });
} else {
  // Not logged in
  res.render("errorlogin", {title: 'Error!', layout: 'empty'});
}
};