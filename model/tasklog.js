var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskLogSchema = new mongoose.Schema({
	timeIn : {
		type : Date
	},
	timeOut : {
		type : Date,
		default : null
	},
	subject : {
		type: String
	},
	comment : {
		type: String
	},
	created_by : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	date_created : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	tasks:{
		type : Schema.Types.ObjectId,
		ref : 'ProjectMilestoneTasks'
	}
});

var TaskLog = module.exports = mongoose.model('TaskLog', TaskLogSchema);


module.exports.CreateTaskLog = function(newTaskLog, callback){
	
	newTaskLog.save(function(err){
		if (err) throw err;
	});

}