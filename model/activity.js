var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var AcitivitySchema = mongoose.Schema({
	status:{
		type : String,
		default: "None"
	},
	activity_title : {
		type: String,
		default: 'Subject'
	},
	date_created : {
		type: String,
		default : Date.now
	},
	due_date : {
		type: String,
		default : Date.now
	},
	created_by : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	activity_description : {
		type: String,
		default: 'Comment'
	},
	account : {
		type: Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	project : {
		type: Schema.Types.ObjectId,
		ref : 'Project'
	},
});

var Activity = module.exports = mongoose.model('Activity', AcitivitySchema);

module.exports.createActivity = function(newActivity, callback){
	
	newActivity.save(function(err){
		if (err) throw err;
	});

}