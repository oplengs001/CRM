var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CampaignPostSchema = new mongoose.Schema({
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
	campaign : {
		type: Schema.Types.ObjectId,
		ref : 'Team'
	}
});

var CampaignPost = module.exports = mongoose.model('CampaignPost', CampaignPostSchema);


module.exports.CreateCampaignPost = function(newPostCampaign, callback){
	
	newPostCampaign.save(function(err){
		if (err) throw err;
	});

}