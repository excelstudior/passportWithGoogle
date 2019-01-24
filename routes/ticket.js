const router = require('express').Router();
const userUtil = require('../Utilities/user');
const mongoose = require('mongoose');
//import models
const User = require('../models/user');
const Ticket = require('../models/ticket')
router.get('/', userUtil.isAuthenticated, (req, res) => {
    User.find().then((users) => {
        console.log(users)
        if (users) {
            console.log(users)
            let usersMap = users.map((user) => {
                let userObj = { id: user._id, userName: user.username }
                return { value: JSON.stringify(userObj), name: user.username }
            })
            console.log(usersMap)
            res.render('ticket', { user: req.user, usersMap: usersMap })
        } else {
            res.render('ticket', { user: req.user, usersMap: usersMap })
        }
    })
    //res.render('ticket',{user:req.user})
    // res.send("<p>Ticket</p><br/> <form action='/Ticket' method='post'> <button type=''submit''>send</button></form>")

});

router.post('/', userUtil.isAuthenticated, (req, res) => {
    let userId = req.user.id;
    let userName = req.user.username;
    let createdBy = {};
    createdBy.id = userId;
    createdBy.userName = userName;

    // get assignee information
    let assignee = JSON.parse(req.body.assignee)
    // create contact object
    let contact={} 
    contact.name= req.body.contactName;
    contact.email= req.body.contactEmail;
    contact.phone= req.body.contactPhone;
    if (req.body.contactId!==undefined){
        contact.clientId=req.body.contactId;
    } else {
        contact.clientId=null;
    }
    // get priority
    let priority = req.body.priority;
    // create update log
    let update={}
    update.user=createdBy;
    update.content='Tickte Created';
    update.date=Date.now();
    let updates=[]
    updates.push(update);

    let newTicket = new Ticket({
        subject: req.body.subject,
        description: req.body.description,
        createdBy: createdBy,
        contact: contact,
        assignee:assignee,
        tags: null,
        priority: priority,
        updates:updates,
    })

    newTicket.referenceNumber = 0
    Ticket.findLastReferenceNumber().then(function (err, ticket) {
        console.log('find ticket ', err,ticket)
        if (ticket === undefined) {
            newTicket.referenceNumber = 1;
        } else {
            newTicket.referenceNumber = ticket.referenceNumber + 1;
        }
        console.log(newTicket)
       // res.send(newTicket)
        newTicket
        .save()
        .then(function(ticket){res.send(ticket)})
        .catch(console.log(err))
    })
    // res.send(userName)
});
module.exports = router;