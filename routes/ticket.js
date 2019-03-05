const router = require('express').Router();
const userUtil = require('../Utilities/user');
const mongoose = require('mongoose');
//import models
const User = require('../models/user');
const Ticket = require('../models/ticket')
const Util = require('../Utilities/constants')
const TicketStatus = Util.ticketStatus;
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
router.get('/LoggedInUserTickets/', userUtil.isAuthenticated, (req, res) => {
    let userId = req.user.id
    console.log('request user id :', userId)
    Ticket.find({ 'assignee.id': userId })
        .select('referenceNumber description subject priority contact status updates')
        .then((tickets) => {
            res.render('tickets', { user: req.user, tickets: tickets })
        }).catch((err) => {
            console.log(err)
        })
})
//get a ticket with id,View
router.get('/view/:ticketId', userUtil.isAuthenticated, (req, res) => {
    var ticketId = req.params.ticketId;
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
                        res.render('ticket', { user: req.user, usersMap: usersMap, ticket: ticket, mode: 'view', ticketStatus: TicketStatus })
                    }
                })
            } else {
                res.json({ message: 'No ticket found' })
            }
        })
});
//get a ticket with id,Edit
router.get('/edit/:ticketId', userUtil.isAuthenticated, (req, res) => {
    var ticketId = req.params.ticketId;
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
                        res.render('ticket', { user: req.user, usersMap: usersMap, ticket: ticket, mode: 'edit', ticketStatus: TicketStatus })
                    }
                })
            } else {

                //need to redirect to an error page
                res.json({ message: 'No ticket found' })
            }
        })
});
//test populate method
router.get('/ticketTest/', userUtil.isAuthenticated, (req, res) => {
    let userId = req.user.id
    console.log('request user id :', userId)
    Ticket.find({ 'assignee.id': userId })
        .select('referenceNumber subject priority contact status')
        .then((tickets) => {
            for (var i = 0; i < tickets.length; i++) {
                console.log(tickets[i]);
            }

        }).catch((err) => {
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
    let contact = {}
    contact.name = req.body.contactName;
    contact.email = req.body.contactEmail;
    contact.phone = req.body.contactPhone;
    if (req.body.contactId !== undefined) {
        contact.clientId = req.body.contactId;
    } else {
        contact.clientId = null;
    }
    // get priority
    let priority = req.body.priority;
    // create update log
    let update = {}
    update.user = createdBy;
    update.content = 'Ticket Created';
    update.date = Date.now();
    let updates = []
    updates.push(update);

    let newTicket = new Ticket({
        subject: req.body.subject,
        description: req.body.description,
        createdBy: createdBy,
        contact: contact,
        assignee: assignee,
        tags: null,
        priority: priority,
        updates: updates,
    })

    newTicket.referenceNumber = 0
    Ticket.findLastReferenceNumber().then(function (ticket, err) {
        console.log('find ticket ', err, ticket)
        if (ticket === null) {
            newTicket.referenceNumber = 1;
        } else {
            newTicket.referenceNumber = ticket.referenceNumber + 1;
        }
        // console.log(newTicket)
        var redirectUrl = '/ticket/LoggedInUserTickets/';
        // console.log(redirectUrl)
        newTicket
            .save()
            .then(function (ticket) {
                res.redirect(redirectUrl)
            }
            ).catch(console.log(err))
    })
});
//update a ticket
router.post('/:ticketId', userUtil.isAuthenticated, (req, res) => {
    var ticketId = req.params.ticketId;
    console.log('ticket id is ', ticketId);
    Ticket.findById(ticketId).then(function (ticket) {
        console.log('ticekt is ', ticket)
        if (ticket === null) {
            res.status(400).json({ messages: ['ticket not found'] })
        } else {
            // // create update log, need to log the original log
            let update = {}
            let userId = req.user.id
            let userName = req.user.username;
            update.user = { id: userId, userName: userName }
            // update.user.userName=userName;
            // update.user.id=userId;
            update.content = 'Ticket Updated';
            update.date = Date.now();
            // get assignee information
            let assignee = JSON.parse(req.body.assignee)
            // create contact object
            let contact = {}
            contact.name = req.body.contactName;
            contact.email = req.body.contactEmail;
            contact.phone = req.body.contactPhone;
            if (req.body.contactId !== undefined) {
                contact.clientId = req.body.contactId;
            } else {
                contact.clientId = null;
            }
            // get priority
            let priority = req.body.priority;

            ticket.assignee = assignee;
            ticket.contact = contact;
            ticket.subject = req.body.subject;
            ticket.description = req.body.description;
            ticket.priority = priority;
            ticket.status = req.body.status;
            ticket.updates.push(update);
            ticket.save().then(res.status(200).send())
                .catch(function (err) {
                    console.log(err);
                    res.status(400).json({ messages: ['something goes wrong'] })
                })
        }



    }).catch(function (err) {
        console.log(err);
    })


})
//add ticket update
router.post('/update/:ticketId', userUtil.isAuthenticated, (req, res) => {
    console.log('add update to ticket ', req.params.ticketId,req.body.update)
    var ticketId = req.params.ticketId;
    var updateContent=req.body.update;
    var userId = req.user.id
    var userName = req.user.username;
    var update={}
    update.user = { id: userId, userName: userName }
    update.content=updateContent;
    update.date=new Date();
    
    Ticket.findById(ticketId)
        .then(function (ticket) {
            if (ticket === null) {
                res.status(400).json({ messages: ['ticket not found'] })
            } else {
                var newUpdates=ticket.updates;
                newUpdates.push(update);
                console.log('update object',update);
                console.log('after update added ',newUpdates);
                ticket.updates=newUpdates;
                ticket.save()
                      .then(function(ticket){
                          console.log(ticket)
                        res.status(200).json({update:update});
                      })
                      .catch(function(err){
                          console.log(err);
                          res.status(400).json({ messages: ['Something went saving ticket'] })
                      })
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).json({ messages: ['bad request'] })
        })

})
//edit tag
router.post('/edit/tags/:ticketId', userUtil.isAuthenticated, (req, res) => {
    console.log(req.body.tags, req.params);
    var ticketId = req.params.ticketId;
    var tags = req.body.tags;

    Ticket.findById(ticketId).then(function (ticket) {
        ticket.tags = tags;
        ticket.save()
            .then(function (ticket) {
                res.status(200).send();
            }).catch(function (err) {
                console.log(err)
                res.status(400).send();
            })
    }).catch(function (err) {
        console.log(err)
        res.status(400).send();
    })

})
//edit ticket description
router.post('/description/:ticketId',userUtil.isAuthenticated,(req,res)=>{
    console.log(req.params.ticketId);
    res.status(200).send()
})
module.exports = router;