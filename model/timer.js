var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskTimeSchema = new mongoose.Schema({
	timeIn : {
		type : Date
	},
	timeOut : {
		type: Date
	},
	total_time : {
		type: String,
		default : 0
	},
	tasks:{
		type : Schema.Types.ObjectId,
		ref : 'ProjectMilestoneTasks'
	}
});

var Time = module.exports = mongoose.model('Time', TaskTimeSchema);


module.exports.CreateTime = function(newTime, callback){
	
	newTime.save(function(err){
		if (err) throw err;
	});

}