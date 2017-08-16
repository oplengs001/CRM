var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var CampaignTaskSchema = mongoose.Schema({
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
	assigned : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

var CampaignTasks = module.exports = mongoose.model('CampaignTasks', CampaignTaskSchema);

module.exports.createCampaignTask = function(newCampaignTask, callback){
	
	newCampaignTask.save(function(err){
		if (err) throw err;
	});

}