var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var FeedTaskSchema = mongoose.Schema({
	feedback : {
		type: String,
		default: 'no feedback'
	},
	date_created : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	project : {
		type: Schema.Types.ObjectId,
		ref: 'Project'
	},
	task : {
		type: Schema.Types.ObjectId,
		ref: 'ProjectMilestoneTasks'
	},
	milestone : {
		type: Schema.Types.ObjectId,
		ref : 'Milestone'
	},
	assigned : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	},
	created_by : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	}
});

var FeedTask = module.exports = mongoose.model('FeedTask', FeedTaskSchema);

module.exports.createFeedTask = function(newFeedTask, callback){
	
	newFeedTask.save(function(err){
		if (err) throw err;
	});

}