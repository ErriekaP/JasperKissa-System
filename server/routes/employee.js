const express= require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

//main employee page
router.get('/employee/home', employeeController.mainHome);

//Go to employee profile
router.get('/myemployeeprofile', employeeController.emprofile);

//look at other people's employee profile
router.get('/employeeprofile/:id', employeeController.other_emprofile);

//look at own attendance records
router.get('/attendancerecord', employeeController.empattrecord);


//view and find employee
router.get('/employeelist', employeeController.view);
router.post('/employeelist', employeeController.find);


module.exports = router;