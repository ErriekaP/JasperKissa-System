const mysql = require("mysql");

//Connection Port
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.AttendancePage = (req,res) => {

  var sess= req.app.locals.sess;

  pool.getConnection((err, connection) => {
    console.log("Attendance database is connected.");
    const type = "";

    connection.query('SELECT attendanceID, employeeID, attendance_type, DATE_FORMAT(attendance_dt,"%m-%d-%Y") as datein,TIME_FORMAT(attendance_dt, "%I:%i:%s %p") as timein FROM attendance_records', (err, rows)=> {
      connection.release();

      if(!err){
        
        if(sess==true){
        res.render("employee_attendancerecord", {rows,true: {login: true }});
        }else{
        res.render("attendancerecord", {rows,true: {login: true }});
        }
       
      } else {
        console.log(err);
      }
    
      
     });
  });
};

exports.TimeInOut = (req,res) => {

pool.getConnection((err, connection) => {
  if (err) throw err;
  const{e_ID} = req.body;
  var adminatt = false;

  if(e_ID){
    connection.connect(function(err) {
      console.log("Connected!");
      var isadmin = "SELECT position FROM employee WHERE emp_id = '"+e_ID+"'"
      connection.query(isadmin, function(err,result){
        var emp_position = JSON.stringify(result);
        var cond0 = '[{"position":"Admin"}]';
        if (emp_position === cond0){
          adminatt = true;
          console.log("This is an admin.");
        }else{
          console.log("This is an employee.")
        }
      });

      var sql = "SELECT * FROM employee WHERE emp_id = '"+e_ID+"'" // setup your query
      connection.query(sql, function (err, result) {  // pass your query
        console.log("Result: " + result);
        if (result != "" && adminatt == false) {
        // true logic
          var timeinout = "SELECT attendance_type FROM attendance_records WHERE employeeID = '"+e_ID+"' AND DATE(attendance_dt) = curdate() ORDER BY attendance_dt DESC LIMIT 1"
          connection.query(timeinout, function (err,result){
            var db_attype = JSON.stringify(result);
            var cond = '[{"attendance_type":1}]';
   
            if (db_attype === cond){
              connection.query(
                "INSERT INTO attendance_records SET employeeID = ?, attendance_type = '0',attendance_name = 'Time Out',attendance_dt = NOW()",
                [e_ID,e_ID,e_ID],
                (err, rows) => {
                  //When done with connection, release it
                  connection.release();
            
                  if (!err) {
                    res.redirect("/attendance");
                  } else {
                    console.log("Error loading the data.", rows);
                  }
                  console.log(e_ID);
                }

            );
            }else{
              connection.query(
                "INSERT INTO attendance_records SET employeeID = ?, attendance_type = '1',attendance_name = 'Time In', attendance_dt = NOW()",
                [e_ID],
                (err, rows) => {
                  //When done with connection, release it
                  connection.release();
            
                  if (!err) {
                    res.redirect("/attendance");
                  } else {
                    console.log("Error loading the data.", rows);
                  }
                  console.log(e_ID);
                }

            );
            }
          }) 
      
        }
        else
        {
        // false logic
        if(adminatt == true){
          res.render("attendancerecord", {alert: "Admins don't need to time in/out!"})
        }else{res.render("attendancerecord", {alert: "This employee code does not exist!" });}
        }
      });
      });
 
  }else{
    res.render("attendancerecord", {alert: "Please enter an employee code!" });
  }
});
};

exports.Admin_AttendancePage = (req,res) => {

  pool.getConnection((err, connection) => {
    console.log("Attendance database is connected.");
    const type = "";

    connection.query('SELECT attendanceID, employeeID, attendance_type,attendance_name, DATE_FORMAT(attendance_dt,"%M %d, %Y") as datein,TIME_FORMAT(attendance_dt, "%I:%i:%s %p") as timein,DAYNAME(attendance_dt) as DN, emp_firstname, emp_lastname FROM attendance_records,employee WHERE attendance_records.employeeID = employee.emp_id', (err, rows)=> {
      connection.release();

      if(!err){
        
        res.render("admin-attendancerecord", {rows});
       
      } else {
        console.log(err);
      }
    
      
     });
  });
};

exports.FindDate = (req,res) => {

  pool.getConnection((err,connection) => {
      if(err) throw err; //not connected!
      console.log('Connected as ID' + " " + connection.threadId)
  
      let From_searchTerm = req.body.From_SortDate;
      let To_searchTerm = req.body.To_SortDate;
  
      //User the connection
      connection.query('SELECT attendanceID, employeeID, attendance_type,attendance_name, DATE_FORMAT(attendance_dt,"%M %d, %Y") as datein,TIME_FORMAT(attendance_dt, "%I:%i:%s %p") as timein,DAYNAME(attendance_dt) as DN, emp_firstname, emp_lastname FROM attendance_records,employee WHERE attendance_records.employeeID = employee.emp_id AND  CAST(attendance_dt AS DATE) between ? and ? ORDER BY attendance_dt ', [From_searchTerm,To_searchTerm],(err,rows) => {
          // When done with the connection, release it
          connection.release();
  
          if(!err){
              res.render('admin-attendancerecord', {rows});
          } else{
              console.log(err);
          }
  
          //console.log('The data from user table: \n', rows);
          console.log("YES"+From_searchTerm);
          console.log("YES"+To_searchTerm);

      });
  });
  }

  exports.find_attendance = (req,res) => {

    pool.getConnection((err,connection) => {
        if(err) throw err; //not connected!
        console.log('Connected as ID' + " " + connection.threadId)
    
        let searchTerm = req.body.search;
    
        //User the connection
        connection.query('SELECT attendanceID, employeeID, attendance_type,attendance_name, DATE_FORMAT(attendance_dt,"%M %d, %Y") as datein,TIME_FORMAT(attendance_dt, "%I:%i:%s %p") as timein,DAYNAME(attendance_dt) as DN, emp_firstname, emp_lastname FROM attendance_records,employee WHERE attendance_records.employeeID = employee.emp_id AND (emp_firstname LIKE ? OR emp_lastname LIKE ? OR employeeID LIKE ?) ORDER BY attendance_dt ', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows) => {
            // When done with the connection, release it
            connection.release();
    
            if(!err){
                res.render('admin-attendancerecord', {rows});
            } else{
                console.log(err);
            }
    
            console.log('The data from user table: \n', rows);
    

        });
    });
    }
