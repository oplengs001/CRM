var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var CampaignLogACallSchema = mongoose.Schema({
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
	campaigns : {
		type: Schema.Types.ObjectId,
		ref : 'Team'
	},
	assigned : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	}
});

var CampaignLogCall = module.exports = mongoose.model('CampaignLogCall', CampaignLogACallSchema);

module.exports.createCampaignLogCall = function(newCampaignLogCall, callback){
	
	newCampaignLogCall.save(function(err){
		if (err) throw err;
	});

}