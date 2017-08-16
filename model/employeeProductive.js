var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EmployeeProductivitySchema = new mongoose.Schema({
	employee_id : {
		type : String,
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
	},
	identifier : {
		type : String
	},
	alias : {
		type : String
	},
	type : {
		type : String
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

var EmpProductivity = module.exports = mongoose.model('EmpProductivity', EmployeeProductivitySchema);

module.exports.createEmpProductivy = function(newEmpProductivity, callback){
	
	newEmpProductivity.save(function(err){
		if (err) throw err;
	});

}