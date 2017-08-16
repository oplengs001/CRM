var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PMTModel = require('../../model/projectmilestonetasks');

//get admin
router.get('/', ensureAuthenticated, function(req, res){
	res.render('manager/panel');
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