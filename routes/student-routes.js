const express = require('express');
const {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    sendMssg,
    addTicket,
    newMessageDrift,
    newMessageIntercom,
    newTicketZoho,
    checkTicketZoho
} = require('../controllers/studentController');

const router = express.Router();
//router.get('/auth', authSlack)
router.post('/student/:id', addStudent);
router.get('/students', getAllStudents);
router.get('/student/:id', getStudent);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);
router.post('/mssg/:id', sendMssg);
router.post('/ticket-created', addTicket);
router.post('/newDriftMessage', newMessageDrift)
router.post('/newIntercomMessage', newMessageIntercom);
router.post('/newZohoMessage', newTicketZoho);
router.get('/newZohoMessage', checkTicketZoho)

module.exports = {
    routes: router
}