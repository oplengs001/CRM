var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var LeadSchema = new mongoose.Schema({
	dateCreated : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	lead_status : {
		type: String
	},
	fullname : {
		type: String
	},
	title : {
		type: String
	},
	company : {
		type : String
	},
	email: {
		type: String
	},
	lead_source : {
		type: String
	},
	industry: {
		type: String
	},
	number_of_employees : {
		type: String,
		default : '6-25'
	},
	phone: {
		type: String
	},
	address : {
		type: String
	},
	city : {
		type: String
	},
	country : {
		type: String
	},
	website : {
		type : String	
	},
	owner : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	notes : {
		type : String,
		default : 'Notes for Leads'
	}
});

var Leads = module.exports = mongoose.model('Leads', LeadSchema);

module.exports.createLead = function(newLead, callback){
	
	newLead.save(function(err){
		if (err) throw err;
	});

}