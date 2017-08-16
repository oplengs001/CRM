var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var LogEmailSchema = mongoose.Schema({
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
		default : 'None'
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

var LogEmail = module.exports = mongoose.model('LogEmail', LogEmailSchema);

module.exports.createLogEmail = function(newLogEmail, callback){
	
	newLogEmail.save(function(err){
		if (err) throw err;
	});
}