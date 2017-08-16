var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var OppurtunitySchema = mongoose.Schema({
	oppurtunity_name:{
		type: String,
	},
	oppurtunity_account:{
		type : Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	oppurtunity_account_type:{
		type: String
	},
	oppurtunity_owner:{
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	oppurtunity_close_date:{
		type: Date
	},
	oppurtunity_stage:{
		type: String
	},
	oppurtunity_probability:{
		type: String
	},
	oppurtunity_amount:{
		type: String
	}
});	


var oppurtunity = module.exports = mongoose.model('Oppurtunity', OppurtunitySchema);

module.exports.createOppurtunity = function(newOppurtunity, callback){
	
	newOppurtunity.save(function(err){
		if (err) throw err;
	});

}