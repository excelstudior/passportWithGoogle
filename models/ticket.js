const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const utilities = require('../Utilities/constants');
const User = require('./user');
const Schema = mongoose.Schema;
const options = {
    timestamps: true,
}
const ticketSchema = new Schema({
    description: { type: String, require: true },
    createdBy: {
        user: {
            id: { type: Schema.Types.ObjectId },
            name: String
        }
    }

}, options)


const Ticket = mongoose.model('ticket', ticketSchema)
module.exports = Ticket;