var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductivitySchema = new mongoose.Schema({
	employee : {
		type : Schema.Types.ObjectId,
		ref : 'Employee'
	},
	date : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	office_time : {
		type: String
	},
	overtime : {
		type : String
	},
	active_time : {
		type : String
	},
	productive_time : {
		type : String
	},
	unproductive_time : {
		type : String
	},
	neutral_time : {
		type : String
	},
	idle_time : {
		type : String
	}
});

var Productivity = module.exports = mongoose.model('Productivity', ProductivitySchema);

module.exports.createProductivy = function(newProductivity, callback){
	
	newProductivity.save(function(err){
		if (err) throw err;
	});

}