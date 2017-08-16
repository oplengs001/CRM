"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Contacts = require('../model/contacts');

//render

//get admin contacts
router.get('/', ensureAuthenticated, userPermissionAccess,  function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('contacts/contacts',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				view_contacts : true
			}
		}
	);
});

router.get('/view/:id', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../../../assets/layouts/layout/img/logo.png";
	Contacts.find({}).populate('contacts_account_name').exec(function(err,results){
		if (err) return err;
		console.log(results);
		Contacts.findById({_id:req.params.id})
		.populate('contacts_account_name')
		.populate('contacts_owner')
		.exec(function(err,query){
			if(err) return err;
			res.render('contacts/show_contacts',  
				{
					results : results,
					query : query,
					userid : user_id, 
					userName : user_name, 
					userImgPath : path,
					logo : logo,
					active : {
						show_contacts : true
					}
				}
			);
		});
	});
});


//add contacts

router.post('/add_new', function(req, res){
	var contacts_fullname = req.body.contacts_fullname;
	var contacts_account_name = req.body.contacts_account_name;
	var contacts_title = req.body.contacts_title;
	var contacts_department = req.body.contacts_department;
	var contacts_email = req.body.contacts_email;
	var contacts_phone = req.body.contacts_phone;
	var contacts_mobile = req.body.contacts_mobile;
	var contacts_fax = req.body.contacts_fax;
	var contacts_address = req.body.contacts_address;
	var contacts_city = req.body.contacts_city;
	var contacts_country = req.body.contacts_country;
	var contacts_owner = req.body.contacts_owner;


	var errors = req.validationErrors();

	if (errors) {
		// res.render('register',{errors:errors});
		console.log('errors');
	} else {
		
		var newContacts = {

			contacts_fullname : contacts_fullname,
			contacts_account_name : contacts_account_name,
			contacts_title : contacts_title,
			contacts_department : contacts_department,
			contacts_email : contacts_email,
			contacts_phone : contacts_phone,
			contacts_mobile : contacts_mobile,
			contacts_fax : contacts_fax,
			contacts_address : contacts_address,
			contacts_city : contacts_city,
			contacts_country : contacts_country,
			contacts_owner : contacts_owner

		};

	createContactFunc(function(err,contact){
		if(err) console.log(err);
		if (contact) console.log(contact._id);
		res.send(contact);

	});

	function createContactFunc(callback){
		var someData = newContacts;
		var new_Contact = new Contacts(someData);
		new_Contact.save(function(err,contact){
			if(err) console.log(err,contact);
			if (contact) callback(null, contact);
		});
	}
		
		// Contacts.createContacts(newContacts, function(err, contacts){
		// 	if (err) throw err;
		// 	console.log(contacts);
		// });
		//req.flash('success_msg', "you are registered and can now login");
	}
});

//find all data in Contacts table

router.get('/api', function(req,res){
	Contacts.find({})
		.populate('contacts_account_name')
		.populate('contacts_owner')
		.exec()
		.then((contacts) => {
			console.log(contacts);
			res.json(contacts);
		})
		.catch((err) => {
			res.send("error occured");
		});
});

//find one data in contacts table

router.get('/api/:id' , function(req,res){
	Contacts.findOne({
		_id:req.params.id
	})
	.populate('contacts_account_name')
	.populate('contacts_owner')
	.exec()
	.then((contacts) => {
		console.log(contacts);
		res.json(contacts);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//find contacts in account table
router.get('/api/account/:account_id', function(req,res){
	Contacts.find({contacts_account_name:req.params.account_id})
			.populate('contacts_account_name')
			.populate('contacts_owner')
			.exec()
			.then((contacts) => {
				console.log(contacts);
				res.json(contacts);
			})
			.catch((err) => {
				res.send('error occured');
			})
});

//update contacts
router.put('/edit_contact', function(req,res){
	var contacts_fullname = req.body.contacts_fullname;
	var contacts_account_name = req.body.contacts_account_name;
	var contacts_title = req.body.contacts_title;
	var contacts_department = req.body.contacts_department;
	var contacts_email = req.body.contacts_email;
	var contacts_phone = req.body.contacts_phone;
	var contacts_mobile = req.body.contacts_mobile;
	var contacts_fax = req.body.contacts_fax;
	var contacts_address = req.body.contacts_address;
	var contacts_city = req.body.contacts_city;
	var contacts_country = req.body.contacts_country;
	var contacts_owner = req.body.contacts_owner;
	var contact_id = req.body.contact_id;

	Contacts.findOneAndUpdate({
		_id:contact_id
	},
		{ 
			$set: 
				{ 
					contacts_fullname : contacts_fullname,
					contacts_account_name: contacts_account_name,
					contacts_title : contacts_title,
					contacts_department : contacts_department,
					contacts_email : contacts_email,
					contacts_phone : contacts_phone,
					contacts_mobile: contacts_mobile,
					contacts_fax : contacts_fax,
					contacts_address : contacts_address,
					contacts_city : contacts_city,
					contacts_country : contacts_country,
					contacts_owner : contacts_owner
				 },

		},
		{ upsert: false	 },
		function(err, newContacts){
			if (err) {
				console.log("errors tanga");
			} else {
				console.log(newContacts);
				//res.status(204);
			}
	});
	res.send('Updated Contact');
});


//delete contacts

router.delete('/post/:id', function(req,res){
	Contacts.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((contacts) => {
		console.log(contacts);
		res.json(contacts);
	})
	.catch((err) => {
		res.send('error occured');
	});
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