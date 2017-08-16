var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var PMTLogACallSchema = mongoose.Schema({
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
	comments : {
		type: String,
		default: 'Comment'
	},
	created_by : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	priority : {
		type: String,
		default : 'None'
	},
	task : {
		type: Schema.Types.ObjectId,
		ref : 'ProjectMilestoneTasks'
	}
});

var PMTLogCall = module.exports = mongoose.model('PMTLogCall', PMTLogACallSchema);

module.exports.createPMTLogCall = function(newPMTLogCall, callback){
	
	newPMTLogCall.save(function(err){
		if (err) throw err;
	});

}