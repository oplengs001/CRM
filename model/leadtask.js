var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var LeadTaskSchema = mongoose.Schema({
	subject : {
		type: String,
		default: 'Subject'
	},
	date_created : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	kickoff : {
		type : Date,
		default : function(){
			return Date.now();
		}
	},
	due_date : {
		type: Date,
		default:function(){
			return Date.now();
		}
	},
	created_by : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	status:{
		type : String,
		default: "None"
	},
	comments : {
		type: String,
		default: 'Comment'
	},
	priority : {
		type: String,
		default : 'None'
	},
	campaign : {
		type: Schema.Types.ObjectId,
		ref : 'Team'
	},
	account : {
		type : Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	assigned : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	leads : {
		type : Schema.Types.ObjectId,
		ref : 'Leads'
	}
});

var LeadTasks = module.exports = mongoose.model('LeadTasks', LeadTaskSchema);

module.exports.createLeadTask = function(newLeadTask, callback){
	
	newLeadTask.save(function(err){
		if (err) throw err;
	});

}