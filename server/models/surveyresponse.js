var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurveyResponseSchema = new Schema({
  name: { type: String },
  email: { type: String },
  type: { type: String },
  survey: { type: Schema.ObjectId, required: true, ref: 'survey' },
  question: { type: Schema.ObjectId, required: true },
  choices: [{ type: Schema.ObjectId, required: true }]
});

SurveyResponseSchema.set('timestamps', true);
module.exports = mongoose.model('surveyresponse', SurveyResponseSchema);