const router = require('express').Router();
const userUtil = require('../Utilities/user');
const mongoose = require('mongoose');
//import models
const User = require('../models/user');
const Ticket = require('../models/ticket')
//get new ticket page
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

//get tickets of logged in user, point to tickets.ejs
router.get('/LoggedInUser/',userUtil.isAuthenticated,(req,res)=>{
    let userId=req.user.id
    console.log('request user id :',userId)
    Ticket.find({'assignee.id':userId}).then((tickets)=>{
        console.log(tickets);
        res.render('tickets',{user:req.user,tickets:tickets})
    }).catch((err)=>{
        console.log(err)
    })


})

//post new ticket
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
    Ticket.findLastReferenceNumber().then(function (ticket, err) {
        console.log('find ticket ', err,ticket)
        if (ticket === null) {
            newTicket.referenceNumber = 1;
        } else {
            newTicket.referenceNumber = ticket.referenceNumber + 1;
        }
        console.log(newTicket)
        var redirectUrl='/ticket/LoggedInUser/';
        console.log(redirectUrl)
        newTicket
        .save()
        .then(function(ticket){
            res.redirect(redirectUrl)
        }
        ).catch(console.log(err))
    })
});
module.exports = router;