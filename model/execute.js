var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var ExecuteSchema = mongoose.Schema({
	merchantID:{
		type: String,
	},
	amount:{
		type: String
	},
	currency:{
		type: String
	},
	orderID:{
		type: String
	},
	customerEmail:{
		type: String
	},
	customerPhone:{
		type: String
	},
	customerFirstName:{
		type: Date
	},
	customerLastName:{
		type: Date
	},
	customerAddress1:{
		type: String
	},
	customerAddress2:{
		type: String
	},
	customerCity:{
		type: String
	},
	customerZipCode:{
		type: String
	},
	customerStateProvince:{
		type: String
	},
	customerCountry:{
		type: String
	},
	customerDob:{
		type: String
	},
	cardNumber:{
		type: String
	},
	cardCVV2:{
		type: String
	},
	cardHolderName:{
		type: String
	},
	saveCard:{
		type: String
	},
	description:{
		type: String
	},
	pSign:{
		type: String
	}
});

var execute = module.exports = mongoose.model('Execute', ExecuteSchema);

module.exports.createExecute = function(newExecute, callback){
	
	newExecute.save(function(err){
		if (err) throw err;
	});

}