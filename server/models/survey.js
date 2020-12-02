
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var QuestionSchema = require('./question').schema;

var SurveySchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  expiry_date: { type: Date, /**default: Date.now*/ },
  user: {
    type: Schema.ObjectId,
    required: true,
    ref: 'user'
  },
  questionnaires: [QuestionSchema],
  // created_at: { type: Date, default: Date.now },
  // updated_at: { type: Date, default: Date.now }
});

SurveySchema.set('timestamps', true);

module.exports = mongoose.model('survey', SurveySchema);