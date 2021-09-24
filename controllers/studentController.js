'use strict';
require('dotenv').config()
const firebase = require('../db');
const Student = require('../models/student');
const firestore = firebase.firestore();
const axios = require('axios');

const authSlack = async (req, res, next) => {
    try {
        const code = req.query.code;
        console.log(code);
        var api_data = {};
        const clientID = `${process.env.SLACK_CLIENT_ID}`;
        const clientSECRET = `${process.env.SLACK_CLIENT_SECRET}`;
        console.log(code)
        console.log(clientID)
        console.log(clientSECRET)

        axios.post('https://slack.com/api/oauth.v2.access', new URLSearchParams({
            code,
            client_id: clientID,
            client_secret: clientSECRET,

        }).toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((res) => {
            console.log(res.data)
            api_data = res.data;
            // webhook_url = res.data.incoming_webhook.url;
            // console.log(webhook_url);
        }).catch((e) => {
            console.log(e);
        });
        res.send(api_data);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addStudent = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('students').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllStudents = async (req, res, next) => {
    try {
        const students = await firestore.collection('students');
        const data = await students.get();
        const studentsArray = [];
        if (data.empty) {
            res.status(404).send('No student record found');
        } else {
            data.forEach(doc => {
                const student = new Student(
                    doc.id,
                    doc.data().name,
                    doc.data().age,
                    doc.data().college
                );
                studentsArray.push(student);
            });
            res.send(studentsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const student = await firestore.collection('students').doc(id);
        const data = await student.get();
        if (!data.exists) {
            res.status(404).send('Student with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student = await firestore.collection('students').doc(id);
        await student.update(data);
        res.send('Student record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('students').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    authSlack,
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
}