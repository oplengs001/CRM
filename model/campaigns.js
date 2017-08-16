var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var CampaignSchema = mongoose.Schema({
	campaign_name:{
		type: String,
	},
	campaign_active:{
		type: String
	},
	campaign_type:{
		type: String
	},
	campaign_status:{
		type: String
	},
	campaign_start_date:{
		type: String
	},
	campaign_end_date:{
		type: String
	},
	campaign_description:{
		type: String
	},
	campaign_owner:{
		type: String
	}
});	


var campaigns = module.exports = mongoose.model('Campaigns', CampaignSchema);

module.exports.createCampaigns = function(newCampaigns, callback){
	
	newCampaigns.save(function(err){
		if (err) throw err;
	});

}