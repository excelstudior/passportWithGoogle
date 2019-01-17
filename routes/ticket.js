const router = require('express').Router();
const userUtil = require('../Utilities/user');
const mongoose = require('mongoose');
//import models
const User = require('../models/user');
const Ticket = require('../models/ticket')
router.get('/', userUtil.isAuthenticated, (req, res) => {

    res.send("<p>Ticket</p><br/> <form action='/Ticket' method='post'> <button type=''submit''>send</button></form>")

});

router.post('/', userUtil.isAuthenticated, (req, res) => {
    // get ticket creator's id and username
    let userId = req.user.id;
    let userName = req.user.username;
    let createdBy = {};
    createdBy.id = userId;
    createdBy.userName = userName;
    // get contact information
    let contact = {};
    console.log(req.body.contact)
    // mock ObjectId for test
    contact.clientId = mongoose.Types.ObjectId();
    contact.name = 'test contact name';
    contact.phone = '04330888888';
    contact.email = 'aba@gmail.com';
    console.log(req.user)
    // get assignee information
    let newTicket = new Ticket({
        subject: 'Test Ticket subject',
        description: 'Test description',
        createdBy: createdBy,
        contact: contact,
        tags: null
    })

    newTicket.referenceNumber = 0
    Ticket.findLastReferenceNumber().then(function (ticket,err) {
        console.log('find ticket ',ticket)
        if (ticket === undefined) {
            newTicket.referenceNumber = 1;
        } else {
            newTicket.referenceNumber = ticket.referenceNumber + 1;
        }
        console.log(newTicket)
        newTicket
        .save()
        .then(console.log('Save!'))
        .catch(console.log(err))
    })
    //console.log(ref)
    res.send(userName)
    //res.send("<p>Ticket</p><br/> <form> <button type=''submit''>send</button></form>")
    //    res.render('profile',{user:req.user})
});
module.exports = router;