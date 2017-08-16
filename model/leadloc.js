var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;	

var LeadLogCallSchema = mongoose.Schema({
	subject : {
		type: String,
		default: 'Subject'
	},
	date_created : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	comments : {
		type: String,
		default: 'Comment'
	},
	created_by : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	priority : {
		type: String,
		default : 'None'
	},
	status : {
		type: String,
		default : 'None'
	},
	leads_id:{
		type: Schema.Types.ObjectId,
		ref: 'Leads'
	}
	// account : {
	// 	type : Schema.Types.ObjectId,
	// 	ref : 'Accounts'
	// }
});

var LeadLogCall = module.exports = mongoose.model('LeadLogCall', LeadLogCallSchema);

module.exports.createLeadLogCall = function(newleadLogCall, callback){
	
	newleadLogCall.save(function(err){
		if (err) throw err;
	});

}
