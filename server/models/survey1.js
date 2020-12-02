const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Survey1Schema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    country: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String
    },
    terms: {
        type: String
    },
    question_1: {
        type: String
    },
    question_2: {
        type: String
    },
    question_3: {
        type: String
    },
    q3additional_message: {
        type: String
    },
    q5additional_message1: {
        type: String
    },
    q5additional_message2: {
        type: String
    },
    q5additional_message3: {
        type: String
    },
});


const Survey1Model = mongoose.model('Survey1', Survey1Schema);

module.exports = Survey1Model;