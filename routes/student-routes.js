const express = require('express');
const {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    sendMssg
} = require('../controllers/studentController');

const router = express.Router();
//router.get('/auth', authSlack)
router.post('/student/:id', addStudent);
router.get('/students', getAllStudents);
router.get('/student/:id', getStudent);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);
router.post('/mssg/:id', sendMssg);


module.exports = {
    routes: router
}