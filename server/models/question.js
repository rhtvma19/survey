/*Project: Survey Studio - A Survey Management Web Application
Course: COMP229-F2020-Web Application development
Sec:007
Group 4: Coding Carvers
Team Members: 
Ashish Shokeen: 301128027
Chandrika Rathna Karur: 301163364
Supriya Kanda:301166350
Susan Finley :301157303
Manjit Kaur :301134995
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    questiontitle: { type: String, required: true },
    questiontype: { type: String },
    options: [
        {
            optiontext: { type: String, required: true }
        }
    ]
});
// module.exports=mongoose.model('Question',questionSchema);
// module.exports.schema=questionSchema;

QuestionSchema.set('timestamps', true);
module.exports.schema = QuestionSchema;
const QuestionModel = mongoose.model('question', QuestionSchema);
module.exports = QuestionModel;