var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProjectSchema = new mongoose.Schema({
	project_name : {
		type: String
	},
	dateCreated : {
		type : Date,
		default:function(){
			return Date.now();
		}
	},
	created : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	account: {
		type: Schema.Types.ObjectId,
		ref: 'Accounts'
	},
	percent_complete:{
		type: String,
		default: '0'
	},
	status : {
		type: String,
		default: 'none'
	},
	kickoff:{
		type: Date,
		default: function(){
			return Date.now()
		}
	},
	deadline:{
		type: Date,
		default: function(){
			return Date.now()
		}
	},
	total_hours_budget: {
		type: String,
		default : '0'
	},
	total_hours_incurred : {
		type: String,
		default: '0'
	},
	description : {
		type: String
	}
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);


module.exports.createProject = function(newProject, callback){
	
	newProject.save(function(err){
		if (err) throw err;
	});

}