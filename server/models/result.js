var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
  surveyId: { type: Schema.ObjectId, required: true, ref: 'Survey' },
  email: {
    type: String
  },
  name: {
    type: String
  },
  phone: {
    type: String
  },
  question: { type: Schema.ObjectId, required: false },
  choices: [{
    questiontitle: { type: String, required: true },
    questiontype: { type: String },
    answerText: { type: String },
  }],
});


email: "eeeee"
gender: ""
name: "Heer"
phone: "eee"
questionItem: {
  questiontype: "Short Answer",
    questiontitle: "Why are you here",
      answerText: "wfewfwef",
        options: Array(0)
}
questionnaires: (2)[{ … }, { … }]
surveyId: "5fcbef0166a6c5719bf766b2"



ResultSchema.set('timestamps', true);
module.exports = mongoose.model('result', ResultSchema);