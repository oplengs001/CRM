"use strict";
var express = require('express');
var router = express.Router();

var Admin = require('../model/admin');

//get homepage
router.get('/landingpage', function(req, res){
	res.render('landingpage');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;