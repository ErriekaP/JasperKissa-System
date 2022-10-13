const express= require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/attendance/', attendanceController.AttendancePage);
router.post('/attendance/timein', attendanceController.TimeInOut);
router.get('/admin_attendance/', attendanceController.Admin_AttendancePage);
router.post('/admin_attendance/FindDate', attendanceController.FindDate);

router.get('/admin_absentee/', attendanceController.Admin_Absentee);
router.post('/admin_absentee/FindDate', attendanceController.Absentee_FindDate);
router.get('/admin_laterecord/', attendanceController.Admin_Late);
router.post('/admin_laterecord/FindDate', attendanceController.Late_FindDate);


router.post('/admin_attendance/', attendanceController.find_attendance);

module.exports = router;