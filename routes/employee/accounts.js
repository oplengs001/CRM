var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//get account
router.get('/', ensureAuthenticated, function(req, res){
	res.render('employee_dashboard/accounts');
});

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