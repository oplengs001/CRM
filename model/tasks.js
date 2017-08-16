var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var TaskSchema = mongoose.Schema({
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
	kick_off : {
		type : Date
	},
	due_date : {
		type: Date
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
		type: Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	assigned : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

var Tasks = module.exports = mongoose.model('Tasks', TaskSchema);

module.exports.createTask = function(newTask, callback){
	
	newTask.save(function(err){
		if (err) throw err;
	});

}