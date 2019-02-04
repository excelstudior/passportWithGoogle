const router = require('express').Router();
const userUtil = require('../Utilities/user');
const mongoose = require('mongoose');
//import models
const User = require('../models/user');
const Ticket = require('../models/ticket')
const Util=require('../Utilities/constants')
const TicketStatus=Util.ticketStatus;
//get new ticket page
router.get('/newTicket', userUtil.isAuthenticated, (req, res) => {
    User.find().then((users) => {
        console.log(users)
        if (users) {
            console.log(users)
            let usersMap = users.map((user) => {
                let userObj = { id: user._id, userName: user.username }
                return { value: JSON.stringify(userObj), name: user.username }
            })
            console.log(usersMap)
            res.render('newTicket', { user: req.user, usersMap: usersMap })
        } 
    })
});

//get tickets of logged in user, point to tickets.ejs
router.get('/LoggedInUserTickets/',userUtil.isAuthenticated,(req,res)=>{
    let userId=req.user.id
    console.log('request user id :',userId)
    Ticket.find({'assignee.id':userId})
    .select('referenceNumber description subject priority contact status')
    .then((tickets)=>{
        console.log(tickets);
        res.render('tickets',{user:req.user,tickets:tickets})
    }).catch((err)=>{
        console.log(err)
    })


})
//get a ticket with id,View
router.get('/view/:ticketId', userUtil.isAuthenticated, (req, res) => {
    var ticketId=req.params.ticketId;
    Ticket.findById(ticketId)
    .then((ticket) => {
        console.log(ticket)
        if (ticket) {
            User.find().then((users) => {
                if (users) {
                    let usersMap = users.map((user) => {
                        let userObj = { id: user._id, userName: user.username }
                        return { value: JSON.stringify(userObj), name: user.username }
                    })
                    console.log(usersMap)
                    res.render('ticket', { user: req.user, usersMap: usersMap,ticket:ticket,mode:'view',ticketStatus:TicketStatus })
                } 
            })
        } else {
           res.json({message:'No ticket found'})
        }
    })
});
//get a ticket with id,Edit
router.get('/edit/:ticketId', userUtil.isAuthenticated, (req, res) => {
    var ticketId=req.params.ticketId;
    Ticket.findById(ticketId)
    .then((ticket) => {
        console.log(ticket)
        if (ticket) {
            User.find().then((users) => {
                if (users) {
                    let usersMap = users.map((user) => {
                        let userObj = { id: user._id, userName: user.username }
                        return { value: JSON.stringify(userObj), name: user.username }
                    })
                    console.log(usersMap)
                    res.render('ticket', { user: req.user, usersMap: usersMap,ticket:ticket,mode:'edit',ticketStatus:TicketStatus })
                } 
            })
        } else {
           res.json({message:'No ticket found'})
        }
    })
});
//test populate method
router.get('/ticketTest/',userUtil.isAuthenticated,(req,res)=>{
    let userId=req.user.id
    console.log('request user id :',userId)
    Ticket.find({'assignee.id':userId})
    .select('referenceNumber subject priority contact status')
    .then((tickets)=>{
        for (var i=0;i<tickets.length;i++){
            console.log(tickets[i]);
        }
        
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
       // console.log(newTicket)
        var redirectUrl='/ticket/LoggedInUserTickets/';
       // console.log(redirectUrl)
        newTicket
        .save()
        .then(function(ticket){
            res.redirect(redirectUrl)
        }
        ).catch(console.log(err))
    })
});
module.exports = router;