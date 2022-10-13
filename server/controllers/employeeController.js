const mysql = require("mysql");

//Connection Port
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//main home page
exports.mainHome = (req,res) => {

  var sess= req.app.locals.sess;

if (sess==true) {
  // Output username
  var iscashier = req.app.locals.iscashier;

  if (iscashier == true){
    res.render("cashierhome", {layout : 'empty'});
  }else{
    res.render("employeehome", {layout : 'empty'});
  console.log("You're in the main employee page.");}
} else {
  // Not logged in
  res.render("errorlogin", {title: 'Error!', layout: 'empty'});
}
};

exports.emprofile = (req,res) => {
  var sess= req.app.locals.sess;
  var empusername = req.app.locals.empname;

if (sess==true) {
    //Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query('SELECT * FROM employee WHERE username= ?', [empusername], (err, rows)=> {
        connection.release();
  
        if(!err){
          res.render('my_employeeprofile', {rows, layout: 'empty'});
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

exports.editemprofile = (req,res)=> {  
  var sess= req.app.locals.sess;
  var empusername = req.app.locals.empname;

if (sess==true) {
    //Connect to DB
    pool.getConnection((err, connection) => {
      const type = "";
  
      connection.query('SELECT * FROM employee WHERE emp_id = ?',[req.params.id],(err,rows) => {
        // When done with the connection, release it
        connection.release();

        if(!err){
          
          res.render("edit-employeeprofile", {rows, layout: 'empty'});
         
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

exports.update_emprofile = (req,res)=> {  
  var sess= req.app.locals.sess;
  var empusername = req.app.locals.empname;
  const{password} = req.body;

if (sess==true) {   
   
  pool.getConnection((err,connection) => {
      if(err) throw err; //not connected!
      console.log('Connected as ID' + " " + connection.threadId)
      //User the connection
      connection.query('UPDATE employee SET password = ? WHERE emp_id = ? ',[password, req.params.id],(err,rows) => {
          // When done with the connection, release it
          connection.release();
    
          if(!err){

              pool.getConnection((err,connection) => {
                  if(err) throw err; //not connected!
                  console.log('Connected as ID' + " " + connection.threadId)
                  //User the connection
                  connection.query('SELECT * FROM employee WHERE emp_id = ?',[req.params.id],(err,rows) => {
                      // When done with the connection, release it
                      connection.release();
              
                      if(!err){
                          res.render('edit-employeeprofile', {rows, alert: `Password successfully updated!`, layout: 'empty'});
                      } else{
                          console.log(err);
                      }        
              
                  });
              });

          } else{
              console.log(err);
          }
  
          console.log('The data from user table: \n', rows);
  
  
      });
  });
  } else {
  // Not logged in
  res.render("errorlogin", {title: 'Error!', layout: 'empty'});
}
};

exports.other_emprofile = (req,res) => {
  var sess= req.app.locals.sess;
  var empid = req.params.id;

if (sess==true) {
    //Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query('SELECT * FROM employee WHERE emp_id= ?', [empid], (err, rows)=> {
        connection.release();
  
        if(!err){
          res.render('employeeprofile', {rows, layout: 'empty'});
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

exports.empattrecord = (req,res) => {
  var sess= req.app.locals.sess;
  var empusername = req.app.locals.empname;

if (sess==true) {
    //Connect to DB
    pool.getConnection((err, connection) => {
      const type = "";
  
      connection.query('SELECT attendanceID, employeeID, attendance_type,attendance_name, DATE_FORMAT(attendance_dt,"%M %d, %Y") as datein,TIME_FORMAT(attendance_dt, "%I:%i:%s %p") as timein,DAYNAME(attendance_dt) as DN FROM attendance_records,employee WHERE attendance_records.employeeID = employee.emp_id AND employee.username = ?', [empusername], (err, rows)=> {
        connection.release();
  
        if(!err){
          
          res.render("employee_ownattrecord", {rows, layout: 'empty'});
         
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

exports.jkcc = (req,res)=> {
  res.render('jkcc',{layout: 'empty'});
};