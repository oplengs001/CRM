var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EmployeeSchema = new mongoose.Schema({
	identifier : {
		type : String
	},
	alias : {
		type : String
	},
	type : {
		type : String
	},
	id : {
		type : String,
		unique: true
	},
	groupid : {
		type : String
	},
	description : {
		type : String
	},
	lastUpload : {
		type : String
	},
	totalTimeCollected : {
		type : String
	},
	arrived : {
		type : String
	},
	productive : {
		type : String
	},
	hourlyWage : {
		type : String
	},
	overtimeWage : {
		type : String
	}
});

var Employees = module.exports = mongoose.model('Employees', EmployeeSchema);

module.exports.createEmployees = function(newEmployees, callback){
	
	newEmployees.save(function(err){
		if (err) throw err;
	});

}