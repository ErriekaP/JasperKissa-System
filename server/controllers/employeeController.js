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

//View Employees
exports.view = (req, res) => {

  var sess= req.app.locals.sess;

if (sess==true) {
    //Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Employee database is connected.");
  
      connection.query('SELECT * FROM employee', (err, rows)=> {
        connection.release();
  
        if(!err){
          res.render('employeelist', {rows,true: {login: true }});
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

    var sess= req.app.locals.sess;

if (sess==true) {
  
    //Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Searching employee.");
  
      let searchTerm = req.body.search;

      
      connection.query("SELECT * FROM employee WHERE lastname LIKE ? OR firstname LIKE ? OR emp_id LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"], (err, rows)=> {
        connection.release();
  
        if(!err){
          res.render("employeelist", { rows });
        } else {
          console.log(err);
        }
      }
      );
    });
} else {
  // Not logged in
  res.render("errorlogin", {title: 'Error!', layout: 'empty'});
}
};