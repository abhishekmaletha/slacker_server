'use strict';
require('dotenv').config()
const firebase = require('../db');
const Student = require('../models/student');
const firestore = firebase.firestore();
const axios = require('axios');

const sendMssg = async (req, res, next) => {
    try {
        const id = req.params.id;
        const student = await firestore.collection('students').doc(id);
        const data = await student.get();
        if (!data.exists) {
            res.status(404).send('Student with the given ID not found');
        } else {
            // console.log(data.data().webhook);
            // res.send(data.data().config.url);
            axios.post(`${data.data().webhook}`, {
                text: 'join to attend',
                "attachments": [
                    {
                        "text": "click to open in browser",
                        "actions": [
                            {
                                "name": "daily meet",
                                "text": "Chess",
                                "type": "button",
                                "url": "https://meet.google.com/cka-sqrx-gyn",
                            },
                        ]
                    }]
            }).then(function (response) {
                console.log('mssg send successfully');
                res.end('send!', response);
            })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    catch (error) {
        console.log(error);
    }
}

const addStudent = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = req.body;
        await firestore.collection('students').doc(id).set(data);
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
                    doc.data().webhook,
                    doc.data().accessToken
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

// builder pattern
// const sessionurl = "flipkart.com";
async function updateSessionURL(sessionURL, requestor_email, zendeskDomain, apiToken, email_address) {
    console.log("inside update function");
    // convert combination of email and token to Base-64 
    // email_address/token:api_token
    const combinationSecret = email_address + `/token:` + apiToken;
    const combinationSecretBase_64 = Buffer.from(combinationSecret).toString('base64');
    const zendeskDomainUrl = `https://` + zendeskDomain + `.zendesk.com/api/v2/users/search.json?query=` + requestor_email;
    const configHeaders = {
        "content-type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${combinationSecretBase_64}`,
    };
    await axios.get(zendeskDomainUrl, {
        headers: configHeaders
    }).then(function async(response) {
        console.log(response.data.users[0].id);
        const end_urer_id = response.data.users[0].id;
        const update_zendesk_url = `https://` + zendeskDomain + `.zendesk.com/api/v2/users/` + end_urer_id;
        axios.put(update_zendesk_url, {
            "user": { "user_fields": { "contxt_live_session": sessionURL } }
        },
            {
                headers: configHeaders
            }).then(function (response) {
                console.log("session url updated sucessfully ", response.data)
            }).catch(function (error) {
                console.log(error);
            })
    }).catch(function (error) {
        console.log(error);
    });
}
const addTicket = async (req, res, next) => {
    console.log("add ticket invoked");
    try {
        console.log(req.body)
        const requestor_email = req.body.requestor_email;
        const api_token = "wsJNwMsgwEOaqxe0wuVhHldIXFHQ4g0hY3rQ6ebK";
        const sessionURL = "www.google.com";
        const domain = "maletha";
        const email_address = "abhishek@contxt.io";
        try {
            await updateSessionURL(sessionURL, requestor_email, domain, api_token, email_address);
            // console.log("end user is ", end_user_id);
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
const newMessageDrift = async (req, res, next) => {
    try {
        const accessTokenDrift = "VkQ0QdazVuz5GLDX5VIG5bMMo3InPuBp";
        console.log("drift message", req.body.data);
        console.log("drift message", req.body.data.author.id);
        updateSessionUrlDrift(req.body.data.author.id, "googleYahoo.com", accessTokenDrift)
        res.send('api working fine');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
async function updateSessionUrlDrift(contactId, sessionURL, accessToken) {
    const url = `https://driftapi.com/contacts/${contactId}`
    const configHeaders = {
        "Authorization": `Bearer ${accessToken}`,
    };
    axios({
        method: 'patch',
        url: url,
        data: {
            "attributes": { "contxt_live_session": `${sessionURL}` }
        },
        headers: configHeaders
    }).then(function (response) {
        console.log("session url in drift, updated sucessfully ", response.data);

    }).catch(function (error) {
        console.log(error);
    })
}
//intercom
const newMessageIntercom = async (req, res, next) => {
    // token dG9rOjFkYTkxYjQ2X2E1NTBfNDQ3ZV9iNWZmXzYwZGNjNmNjZTkwMzoxOjA=
    try {
        console.log("intercom message", req.body.data.item.id);
        const conversationId = req.body.data.item.id;
        const sessionURL = "hola.com";
        const accessToken = "dG9rOjY4NjFhMmQ5X2VlZWVfNGVkN185MmViX2ZiZDYwYjI2MzQxMjoxOjA=";
        updateSessionUrlInterCom(conversationId, sessionURL, accessToken)
        res.send('api working fine');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

async function updateSessionUrlInterCom(conversationId, sessionURL, accessToken) {
    const configHeaders = {
        "Authorization": `Bearer ${accessToken}`,
    };
    const retriveConversationUrl = `https://api.intercom.io/conversations/${conversationId}`;
    const authourID = await axios({
        method: 'get',
        url: retriveConversationUrl,
        headers: configHeaders
    }).then(function (response) {
        console.log("conversation detials are ", response.data.source.author.id);
        return response.data.source.author.id;

    }).catch(function (error) {
        console.log("field already present");
    })
    //create attribute if not present
    const createIntercomContxtAttribute = "https://api.intercom.io/data_attributes";
    await axios({
        method: 'post',
        url: createIntercomContxtAttribute,
        data: {
            "name": "contxt_live_session",
            "description": "live session url",
            "data_type": "string",
            "model": "contact"
        },
        headers: configHeaders
    }).then(function (response) {
        console.log("attribute created ", response.data);

    }).catch(function (error) {
        console.log(error);
    }).finally(function () {
        //update link with session url
        const updateIntercomSessionurl = `https://api.intercom.io/contacts/${authourID}`
        axios({
            method: 'put',
            url: updateIntercomSessionurl,
            data: {
                "custom_attributes": {
                    "contxt_live_session": `${sessionURL}`
                }
            },
            headers: configHeaders
        }).then(function (response) {
            console.log("session url in drift, updated sucessfully ", response.data);

        }).catch(function (error) {
            console.log(error);
        })
    });

}
const newTicketZoho = async (req, res, next) => {
    try {
        console.log(res.body);
        res.status(200).send("successful");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
const checkTicketZoho = async (req, res, next) => {
    try {
        res.status(200).send('got it!');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    //authSlack,
    addStudent,
    checkTicketZoho,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    sendMssg,
    addTicket,
    newMessageDrift,
    newMessageIntercom,
    newTicketZoho
}