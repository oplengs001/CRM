var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var ContactsSchema = mongoose.Schema({
	contacts_fullname:{
		type: String,
	},
	contacts_account_name:{
		type : Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	contacts_title:{
		type: String,
		default : 'title'
	},
	contacts_department:{
		type: String,
		default : 'department'
	},
	contacts_email:{
		type: String,
		default : 'department'
	},
	contacts_phone:{
		type: String,
		default : 'phone'
	},
	contacts_mobile:{
		type: String,
		default : 'mobile'
	},
	contacts_fax:{
		type: String,
		default : 'fax'
	},
	contacts_address:{
		type: String,
		default : 'addess'
	},
	contacts_city:{
		type: String,
		default : 'city'
	},
	contacts_country:{
		type: String,
		default : 'country'
	},
	contacts_owner:{
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	date_created : {
		type : Date,
		default:function(){
			return Date.now();
		}
	}
});	


var contacts = module.exports = mongoose.model('Contacts', ContactsSchema);

module.exports.createContacts = function(newContacts, callback){
	
	newContacts.save(function(err){
		if (err) throw err;
	});

}