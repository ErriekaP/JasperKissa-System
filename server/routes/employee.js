const express= require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

//main employee page
router.get('/employee/home', employeeController.mainHome);

router.get('/jkcc.png', employeeController.jkcc);

//Go to employee profile
router.get('/myemployeeprofile', employeeController.emprofile);

//edit employee profile
router.get('/editpassword/:id', employeeController.editemprofile);
router.post('/editpassword/:id', employeeController.update_emprofile);

//look at other people's employee profile
router.get('/employeeprofile/:id', employeeController.other_emprofile);

//look at own attendance records
router.get('/attendancerecord', employeeController.empattrecord);

module.exports = router;