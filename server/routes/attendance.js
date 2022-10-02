const express= require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/attendance/', attendanceController.AttendancePage);
router.post('/attendance/timein', attendanceController.TimeInOut);
router.get('/admin_attendance/', attendanceController.Admin_AttendancePage);
router.post('/admin_attendance/FindDate', attendanceController.FindDate);
router.post('/admin_attendance/', attendanceController.find_attendance);

module.exports = router;