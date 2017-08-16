var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var RecurringSchema = mongoose.Schema({
	merchantID:{
		type: String,
	},
	amount:{
		type: String
	},
	orderID:{
		type: String
	},
	originalTransactionID:{
		type: String
	},
	ApiPasscode:{
		type: String
	},
	pSign:{
		type: String
	},
	datetime:{
		type: Date
	},
	chargeDate:{
		type: Date
	},
	transactionID:{
		type: String
	}
});

var recurring = module.exports = mongoose.model('Recurring', RecurringSchema);

module.exports.createRecurring = function(newRecurring, callback){
	
	newRecurring.save(function(err){
		if (err) throw err;
	});

}