var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var LogACallSchema = mongoose.Schema({
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
		type : String,
		default : 'None',
	},
	account : {
		type: Schema.Types.ObjectId,
		ref : 'Accounts'
	},
	assigned : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	}
});

var LogCall = module.exports = mongoose.model('LogCall', LogACallSchema);

module.exports.createLogCall = function(newLogCall, callback){
	
	newLogCall.save(function(err){
		if (err) throw err;
	});

}