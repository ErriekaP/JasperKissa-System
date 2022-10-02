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

  pool.getConnection((err, connection) => {
    console.log("Attendance database is connected.");
    const type = "";

    connection.query('SELECT attendanceID, employeeID, attendance_type, DATE_FORMAT(attendance_dt,"%m-%d-%Y") as datein,TIME_FORMAT(attendance_dt, "%I:%i:%s %p") as timein FROM attendance_records', (err, rows)=> {
      connection.release();

      if(!err){
        
        res.render("attendancerecord", {rows,true: {login: true }});
       
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
                "INSERT INTO attendance_records SET employeeID = ?, attendance_type = '0', attendance_dt = NOW()",
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
            }else{
              connection.query(
                "INSERT INTO attendance_records SET employeeID = ?, attendance_type = '1', attendance_dt = NOW()",
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