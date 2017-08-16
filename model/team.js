var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TeamSchema = new mongoose.Schema({
	team_name : {
		type: String
	},
	dateCreated : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	account : {
		type : Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	campaign_owner : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	}
});

var Team = module.exports = mongoose.model('Team', TeamSchema);


module.exports.createTeam = function(newTeam, callback){
	
	newTeam.save(function(err,teamObj){
		if (err) throw err;
		if(teamObj){
			if(typeof callback == 'function'){
				callback(null, teamObj._id); 
			}
		}
	});

}