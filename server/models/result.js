var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
  survey: { type: Schema.ObjectId, required: true, ref: 'Survey' },
  question: { type: Schema.ObjectId, required: true },
  choices: [{ type: Schema.ObjectId, required: true }],
  // created_at: { type: Date, default: Date.now }
});

ResultSchema.set('timestamps', true);

module.exports = mongoose.model('result', ResultSchema);