var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var OppLogACallSchema = mongoose.Schema({
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
	Oppurtunity : {
		type: Schema.Types.ObjectId,
		ref : 'Team'
	},
	assigned : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	}
});

var OpportunityLogCall = module.exports = mongoose.model('OpportunityLogCall', OppLogACallSchema);

module.exports.createOpportunityLogCall = function(newOpportunityLogCall, callback){
	
	newOpportunityLogCall.save(function(err){
		if (err) throw err;
	});

}