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
            name: String
        }
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
            name: String
        }
    },
    status: { type: String, default: status.OPEN },
    referenceNumber: { type:Number, unique: true },

}, options)

// ticketSchema.static.findLastReferenceNumber=function(){

// }
const Ticket = mongoose.model('ticket', ticketSchema)
module.exports = Ticket;