var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AccountSchema = mongoose.Schema({
	account_name:{
		type: String,
		index:true
	},
	account_type:{
		type: String,
		default : 'Investor'
	},
	website_url:{
		type: String,
		default : 'website url'
	},
	description:{
		type: String,
		default : 'Description'
	},
	account_owner:{
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	phone_number:{
		type: String,
		default : 'Phone Number'
	},
	industry:{
		type: String,
		default : 'none'
	},
	address : {
		type: String,
		default : 'address'
	},
	city : {
		type: String,
		default : 'city'
	},
	country : {
		type: String,
		default : 'country'
	},
	number_of_employees : {
		type: String,
		default : 'Number of Employees'
	}

});

var accounts = module.exports = mongoose.model('Accounts', AccountSchema);

module.exports.createAccount = function(newAccount, callback){
	
	newAccount.save(function(err){
		if (err) throw err;
		var account_id = newAccount._id;
		return account_id
	});

}