var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var ProjectMilestoneTasksSchema = mongoose.Schema({
	date_created : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	created_by : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	milestone : { //done
		type: Schema.Types.ObjectId,
		ref : 'Milestone'
	},
	project : { //done
		type: Schema.Types.ObjectId,
		ref : 'Project'
	},
	subject : { //done
		type: String,
		default: 'Subject'
	},
	status:{ //done
		type : String,
		default: "None"
	},
	priority : { //done
		type: String,
		default : 'None'
	},
	kick_off : {
		type : Date,
		default: function(){
			return Date.now();
		}
	},
	due_date : { //done
		type: Date,
		default:function(){
			return Date.now();
		}
	},
	completed : {
		type: Number,
		default : 0
	},
	comments : { //done
		type: String,
		default: 'Comment'
	},
	assigned : { //done
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	account : { //done
		type: Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	rate : {
		type: String,
		default : '0'
	}
});
	
	

var ProjectMilestoneTasks = module.exports = mongoose.model('ProjectMilestoneTasks', ProjectMilestoneTasksSchema);

module.exports.createPMT = function(newPMT, callback){
	
	newPMT.save(function(err){
		if (err) throw err;
	});

}