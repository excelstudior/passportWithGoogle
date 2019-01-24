const mongoose = require('mongoose');
const utilities = require('../Utilities/constants');
//const User=require('./user')
const Schema = mongoose.Schema;
const options = {
    timestamps: true,
}
const status = utilities.ticketStatus;
const ticketSchema = new Schema({
    subject: { type: String, required: true },
    description: { type: String, require: true },
    createdBy: {
        id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        userName: String,
    },
    contact: {
        clientId: { type: Schema.Types.ObjectId },
        name: { type: String, require: true },
        phone: { type: String, require: true },
        email: { type: String, require: true }
    },
    assignee: {
        id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        userName: String,
    },
    status: { type: String, default: status.OPEN },
    referenceNumber: { type: Number, unique: true, index: true },
    tags: [{ type: String }],
    updates: [{
        user: {
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            userName:String,
        },
        content:{type:String},
        date:{type:Date }
    }],
    priority:{type:String}

}, options)

//https://stackoverflow.com/questions/19751420/mongoosejs-how-to-find-the-element-with-the-maximum-value
ticketSchema.statics.findLastReferenceNumber = function (callback) {
    return this.findOne({}).sort('-referenceNumber').exec(callback)
}

// ticketSchema.statics.findAll=function(){
//     return this.find().sort('-referenceNumber')
//  }
const Ticket = mongoose.model('ticket', ticketSchema)
module.exports = Ticket;