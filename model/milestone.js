var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MilestoneSchema = new mongoose.Schema({
	milestone_name : {
		type: String
	},
	kick_start : {
		type: Date
	},
	due_date : {
		type : Date
	},
	MilestoneCompleted : {
		type: String
	},	
	milestondec : {
		type: String,
		default : 'No'
	},
	dateCreated : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	project : {
		type : Schema.Types.ObjectId,
		ref : 'Project'
	},
	account: {
		type: Schema.Types.ObjectId,
		ref: 'Accounts'
	},
	created_by : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	}
});

var Milestone = module.exports = mongoose.model('Milestone', MilestoneSchema);


module.exports.createMilestone = function(newMilestone, callback){
	
	newMilestone.save(function(err,postObj){
		if (err) throw err;
		if(postObj){
			if(typeof callback == 'function'){
				callback(null, postObj._id); 
			}
		}
	});

}