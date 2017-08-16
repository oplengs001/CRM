var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LeadPostSchema = new mongoose.Schema({
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
	lead_post : {
		type: Schema.Types.ObjectId,
		ref : 'Leads'
	}
});

var LeadPost = module.exports = mongoose.model('LeadPost', LeadPostSchema);


module.exports.CreateLeadPost = function(newPostLead, callback){
	
	newPostLead.save(function(err){
		if (err) throw err;
	});

}