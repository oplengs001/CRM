var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../model/user');

//get user profile
router.get('/', ensureAuthenticated, function(req, res){
	res.render('employee_dashboard/user_profile');
});

//edit user profile
router.get('/edit_profile', ensureAuthenticated, function(req, res){
	res.render('employee_dashboard/edit_profile');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}
module.exports = router;