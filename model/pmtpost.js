var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PMTPostSchema = new mongoose.Schema({
	post : {
		type: String,
		default: 'hello how are you'
	},
	dateCreated : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	created_by : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	pmt: {
		type: Schema.Types.ObjectId,
		ref: 'ProjectMilestoneTasks'
	},
	milestone : {
		type: Schema.Types.ObjectId,
		ref: 'Milestone'
	}
});

var PMTPost = module.exports = mongoose.model('PMTPost', PMTPostSchema);


module.exports.createPMTPost = function(newPMTPost, callback){
	
	newPMTPost.save(function(err,postObj){
		if (err) throw err;
		if(postObj){
			if(typeof callback == 'function'){
				callback(null, postObj._id); 
			}
		}
	});

}