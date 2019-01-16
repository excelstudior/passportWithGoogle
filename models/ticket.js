const mongoose = require('mongoose');
const utilities = require('../Utilities/constants');
const Schema = mongoose.Schema;
const options = {
    timestamps: true,
}
const status = utilities.ticketStatus;
const ticketSchema = new Schema({
    subject: { type: String, required: true },
    description: { type: String, require: true },
    createdBy: {
        user: {
            id: { type: Schema.Types.ObjectId },
            name: String,
            ref: 'user',
        },
        required:true,
        index:true,
    },
    contact: {
        clientId: { type: Schema.Types.ObjectId },
        name: { type: String, require: true },
        phone: { type: String, require: true },
        email: { type: String, require: true }
    },
    assignee: {
        user: {
            id: { type: Schema.Types.ObjectId },
            name: String,
            ref: 'user',
        },
        index:true,
    },
    status: { type: String, default: status.OPEN },
    referenceNumber: { type: Number, unique: true, index: true },
    tags: [{ type: String }]

}, options)

// ticketSchema.static.findLastReferenceNumber=function(){
//https://stackoverflow.com/questions/19751420/mongoosejs-how-to-find-the-element-with-the-maximum-value
// }
const Ticket = mongoose.model('ticket', ticketSchema)
module.exports = Ticket;