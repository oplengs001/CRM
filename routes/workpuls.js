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

	  						
			  	var times = timeResults(results);
				var officeTime = times[0];
				var activeTime = times[1];
				var productiveTime = times[2];
				var unproductiveTime = times[3];
				var protime = times[4];


        res.render('workview/workview_view',  
        	{
        		userid : user_id, 
        		userName : user_name, 
        		userImgPath : path,
        		logo : logo,
        		officeTime : officeTime,
        		activeTime : activeTime,
        		productiveTime : productiveTime,
        		unproductiveTime : unproductiveTime,
        		protime : protime,
        		data : results[2],
        		active : {
        			work_view : true
        		}
        	}
        );
	  }
	});
});

router.get('/employee/:employee_id', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../../../assets/layouts/layout/img/logo.png";
	var numbersample = 5;
	EmployeeModel.find({'employee_id': req.params.employee_id})
		.exec()
		.then((employee) => {
				var times = empResults(employee);
				var officeTime = times[0];
				var activeTime = times[1];
				var productiveTime = times[2];
				var unproductiveTime = times[3];
			res.render('workview/show_employee',
				{	
					userid : user_id, 
					userName : user_name, 
					userImgPath : path,
					logo : logo,
					numbersample : numbersample,
					officeTime : officeTime,
					activeTime: activeTime,
					productiveTime : productiveTime,
        			unproductiveTime : unproductiveTime,
        			helpers : {
        				getEmployeeData : function(){
        					for (var key in employee ){
        						var alias = employee[key].alias;
        						return alias
        					}
        				},
        				getEmployeeIdentifier : function(){
        					for (var key in employee ){
        						var identifier = employee[key].identifier;
        						return identifier
        					}
        				}
        			}

				},
			); // end of render
		})
		.catch((err) => {
			res.json('err')
		})
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

//------------------------------------------------------------------------GEOFFREY

function empResults(empData){
		
		var len = 1;
		var office_time_hour = getAverage_hour(empData[0].office_time,len), office_time_minutes = getAverage_min(empData[0].office_time,len);
		var active_time_hour = getAverage_hour(empData[0].active_time,len), active_time_minutes = getAverage_min(empData[0].active_time,len);
		var productive_time_hour = getAverage_hour(empData[0].productive_time,len),productive_time_minutes = getAverage_min(empData[0].productive_time,len);
		var unproductive_time_hour = getAverage_hour(empData[0].unproductive_time,len),unproductive_time_minutes = getAverage_min(empData[0].unproductive_time,len);
		// declaration of variables for the array
		var office_time = office_time_hour + ":" + office_time_minutes;
		var active_time = active_time_hour + ":" + active_time_minutes;
		var productive_time =	productive_time_hour+ ":" +  productive_time_minutes;
		var unproductive_time =	unproductive_time_hour+ ":"  + unproductive_time_minutes;
		// returning array
		return [office_time,active_time,productive_time,unproductive_time];

}

function timeResults(results){
		var data =  results[2]['data'];
		//declration total times
		var total_office_time = 0,total_active_time = 0,total_productive_time =0,total_unproductive_time =0;
		//declaration of average times
		var total_ave_office_time = 0,total_ave_active_time = 0 , total_ave_productive_time = 0 ,total_ave_unproductive_time = 0;
		var len = data.length;
		//looping to get total of datas	
		for (var i = 0 ; i < len ; i ++) {
			total_office_time = total_office_time + data[i].office_time;
			total_active_time =	total_active_time + data[i].active_time;
			total_productive_time = total_productive_time + data[i].productive_time;
			total_unproductive_time = total_unproductive_time + data[i].unproductive_time;
		}
		var pro_of_active_time = get_pTime(total_productive_time,total_active_time);
		// getting average of times
		var office_time_hour = getAverage_hour(total_office_time,len), office_time_minutes = getAverage_min(total_office_time,len);
		var active_time_hour = getAverage_hour(total_active_time,len), active_time_minutes = getAverage_min(total_active_time,len);
		var productive_time_hour = getAverage_hour(total_productive_time,len),productive_time_minutes = getAverage_min(total_productive_time,len);
		var unproductive_time_hour = getAverage_hour(total_unproductive_time,len), unproductive_time_minutes = getAverage_min(total_unproductive_time,len);
		// declaration of variables for the array
		var office_time = office_time_hour + ":" + office_time_minutes;
		var active_time = active_time_hour + ":" + active_time_minutes;
		var productive_time =	productive_time_hour+ ":" +  productive_time_minutes;
		var unproductive_time =	unproductive_time_hour+ ":"  + unproductive_time_minutes;
		// returning array
		return [office_time,active_time,productive_time,unproductive_time,pro_of_active_time];
}

function get_pTime(ptime, atime){
	var value = (ptime/atime) * 100;
	value = value.toFixed(2);
	return value;
}
function getAverage_hour(total,count){
	var return_value = "";
	var average = 0,total_ave = 0;
		average = (total/count) / 60 ;
	 	total_ave = Math.floor(average/60);
	 	return_value = addZero_hour(total_ave.toString());
	return  return_value
}
function getAverage_min(total,count){

	var return_value = "";
	var average = 0,total_ave = 0;		
		average = (total/count) / 60 ;
	 	total_ave = parseInt(average % 60);
		return_value = addZero_min(total_ave.toString());
	return return_value;
}
function addZero_hour(hour_time){
	var return_value ="";
	if(hour_time.length == 1){
		return_value = "0" + hour_time;
	} else {
		return_value = hour_time;
	}
		return return_value;
	}

function addZero_min(time){
    var return_value ="";
	if(time.length == 1){
		return_value = "0" + time;
	} else {
		return_value = time;
	}
		return return_value;	
}

//----------------------------------------
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
