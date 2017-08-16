"use strict";
var express = require('express');
var router = express.Router();
var request = require('request')
var request_then = require('then-request');
var async = require('async');
var EmployeeModel = require('../model/employeeProductive');
var http  = require('http');

var dataEmployee = "";

router.get('/', ensureAuthenticated, userPermissionAccess, function(req,res){

	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";

	var dateNow = Date.now();
	var date = new Date(dateNow);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear() ;
	var today = month + "/" + day + "/" + year;
	var requests = [{
	  url: 'https://api.workpuls.com/v2/employees',
      headers: {
          'auth_id' : '2fea5138-7029-4553-b3b3-bec9b5ffd254',
          'auth_secret' : '8tthNgJZ'
      }
	}, {
	  url: 'https://api.workpuls.com/v2/agents',
	  headers: {
	      'auth_id' : '2fea5138-7029-4553-b3b3-bec9b5ffd254',
	      'auth_secret' : '8tthNgJZ'
	  }
	},
	 {
	 	url: 'https://api.workpuls.com/v2/productivity?start_date='+today,
	 	headers: {
	 	    'auth_id' : '2fea5138-7029-4553-b3b3-bec9b5ffd254',
	 	    'auth_secret' : '8tthNgJZ'
	 	}
	 }];

	async.map(requests, function(obj, callback) {
	  // iterator function
	  request(obj, function(error, response, body) {
	    if (!error && response.statusCode == 200) {
	      // transform data here or pass it on
	      var body = JSON.parse(body);
	      callback(null, body);
	    } else {
	      callback(error || response.statusCode);
	    }
	  });
	}, function(err, results) {
	  if (err) {
	    res.send('error')
	  } else {

	  	function dataResults(){
	  		var data =  results[2]['data'];
	  		var total_office_time = 0;
	  		var total_ave_office_time = 0;
	  		var newhour = "";
	  		var newMin = "";

	  		for (var i = 0 ; i < data.length ; i ++) {
	  			total_office_time = total_office_time + data[i].office_time;
	  		}

	  		total_ave_office_time = (total_office_time / data.length) / 60;
	  		
	  		var hour = Math.floor(total_ave_office_time / 60);
	  		var minutes = total_ave_office_time % 60;
	  		var ParsedMin = parseInt(minutes);

	  		if ( hour.toString().length == 1 ) {
	  			newhour = "0" + hour;
	  		} 

	  		if ( ParsedMin.toString().length == 1 ) {
	  			newMin = "0";
	  		}

	  		return newhour + ":" + newMin + ParsedMin.toString();
	  	}



        res.render('workview/workview_view',  
        	{
        		userid : user_id, 
        		userName : user_name, 
        		userImgPath : path,
        		logo : logo,
        		dataResults : dataResults,
        		data : results[2],
        		active : {
        			view_leads : true
        		},
        		helpers : {
        			Employees : function(){
        				return "hello world"
        			}
        		}
        	}
        );
	  }
	});
});

router.put('/syncworkpuls', function(req,res){


	var dateNow = Date.now();
	var date = new Date(dateNow);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear() ;
	var today = month + "/" + day + "/" + year;

	var options = {
	  	url: 'https://api.workpuls.com/v2/productivity?start_date='+today,
	 	headers: {
	     	'auth_id' : '2fea5138-7029-4553-b3b3-bec9b5ffd254',
	     	'auth_secret' : '8tthNgJZ'
	 	}
	};

	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var info = JSON.parse(body);
	    res.json( productionData(info) )
	  }
	}
	 
	request(options, callback);

	function productionData(obj){
		var return_obj = new Object();
		return obj
	}
});

router.put('/syncemployee', function(req,res){
	var employee_id = req.body.employee_id;
	var date = req.body.date;
	var office_time = req.body.office_time;
	var overtime = req.body.overtime;
	var active_time = req.body.active_time;
	var productive_time = req.body.productive_time;
	var unproductive_time = req.body.unproductive_time;
	var neutral_time = req.body.neutral_time;
	var idle_time = req.body.idle_time;

	var options = {
	  	url: 'https://api.workpuls.com/v2/employees/' + employee_id,
	 	headers: {
	     	'auth_id' : '2fea5138-7029-4553-b3b3-bec9b5ffd254',
	     	'auth_secret' : '8tthNgJZ'
	 	}
	};

	function callback(error, response, employees) {
	  if (!error && response.statusCode == 200) {
	    var info = JSON.parse(employees);
		for(var key in info){
			var identifier = info[key].identifier;
			var alias = info[key].alias;
			var type = info[key].type;
			var groupid = info[key].groupid;
			var description = info[key].description;
			var lastUpload = info[key].lastUpload;
			var totalTimeCollected = info[key].totalTimeCollected;
			var arrived = info[key].arrived;
			var productive = info[key].productive;
			var hourlyWage = info[key].hourlyWage;
			var overtimeWage = info[key].overtimeWage;

			EmployeeModel.findOneAndUpdate({
				employee_id:employee_id
			},
				{ 
					$set: 
						{ 
							employee_id : employee_id,
							date : date,
							office_time : office_time,
							overtime : overtime,
							active_time : active_time,
							productive_time : productive_time,
							unproductive_time : unproductive_time,
							neutral_time : neutral_time,
							idle_time : idle_time,
							identifier : identifier,
							alias : alias,
							type : type,
							groupid : groupid,
							description : description,
							lastUpload : lastUpload,
							totalTimeCollected : totalTimeCollected,
							arrived : arrived,
							productive : productive,
							hourlyWage : hourlyWage,
							overtimeWage : overtimeWage

						 },

				},
				{ upsert: true, new : true },
				function(err, newEmployeeProd){
					if (err) {
						console.log("errors tanga");
					} else {
						res.send("success");
						//res.status(204);
					}
			});
		}
	  }
	}
	request(options, callback);
	 
});

router.get('/getemployeedata', function(req,res){
	EmployeeModel.find({})
		 .exec()
		 .then((results) => {
		 	res.json(results);
		 })
		 .catch((err) => {
		 	return err;
		 })
})

router.get('/getemployeedata/:id',function (req,res){
	EmployeeModel.find({'employee_id': req.params.id})
		 .exec()
		 .then((results) => {
		 	res.json(results);
		 })
		 .catch((err) => {
		 	return err;
		 })
})



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

function userPermissionAccess(req,res,next) {
	if ( req.user.role == 'admin') {
		console.log('User is Login');
		return next();
	} else {
		//console.log('Welcome ' + req.user.fullname);
		res.send(404,'youre not allowed');
	}
}

module.exports = router;