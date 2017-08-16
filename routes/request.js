//get pago execute
router.get('/execute/', ensureAuthenticated, function(req, res){
	res.render('pago_execute');
});

router.route('/execute/')
	.get(ensureAuthenticated,function(req,res){

	})
	.post(ensureAuthenticated,function(req,res){

		var merchantID = req.body.merchantID;
		var amount = req.body.amount;
		var currency = req.body.currency;
		var orderID = req.body.orderID;
		var customerEmail = req.body.customerEmail;
		var customerPhone = req.body.customerPhone;
		var customerFirstName = req.body.customerFirstName;
		var customerLastName = req.body.customerLastName;
		var customerAddress1 = req.body.customerAddress1;
		var customerAddress2 = req.body.customerAddress2;
		var customerCity = req.body.customerCity;
		var customerZipCode = req.body.customerZipCode;
		var customerStateProvince = req.body.customerStateProvince;
		var customerCountry = req.body.customerCountry;
		var customerDob = req.body.customerDob;
		var cardNumber = req.body.cardNumber;
		var cardCVV2 = req.body.cardCVV2;
		var cardExpiryDate = req.body.cardExpiryDate;
		var cardHolderName = req.body.cardHolderName;
		var saveCard = req.body.saveCard;
		var description = req.body.description;
		var ApiPasscode = 'OPgDtw!%84RW'
		var pSignConvert = ApiPasscode + merchantID + amount + currency + orderID + customerIP 
			+ customerEmail + customerPhone + customerFirstName + customerLastName + customerAddress1
			+ customerAddress2 + customerCity + customerZipCode + customerStateProvince + customerCountry 
			+ customerDob + cardNumber + cardCVV2 + cardExpiryDate + cardHolderName + saveCard + description;
		var pSign = sha1(pSignConvert);


		//var now = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

		var formdata =  
			{
				merchantID : merchantID,
				amount : amount,
				currency: currency,
				orderID : orderID,
				customerEmail : customerEmail,
				customerPhone : customerPhone,
				customerFirstName : customerFirstName,
				customerLastName : customerLastName,
				customerAddress1 : customerAddress1,
				customerAddress2 : customerAddress2,
				customerCity : customerCity,
				customerZipCode : customerZipCode,
				customerStateProvince : customerStateProvince,
				customerCountry : customerCountry,
				customerDob : customerDob,
				cardNumber : cardNumber,
				cardCVV2 : cardCVV2,
				cardExpiryDate : cardExpiryDate,
				cardHolderName : cardHolderName,
				saveCard : saveCard,
				description : description,
				pSign :  pSign
			}
		request.post('https://secure.pagoglobal.com/transaction/execute',{ form:formdata },function(err, httpResponse, body){
			res.json(body);
			// var jsonObject = JSON.parse(body);
			// var responseCode = jsonObject.responseCode;
			// var transactionID = jsonObject.transaction['transactionID'];
			// console.log(transactionID);
			//validation

			switch(responseCode){

				case 1:
					var errors = req.validationErrors();

					if (errors) {
						// res.render('register',{errors:errors});
						console.log('errors');
					} else{

						var newExecute = new Execute({

							merchantID : merchantID,
							amount : amount,
							currency: currency,
							orderID : orderID,
							customerEmail : customerEmail,
							customerPhone : customerPhone,
							customerFirstName : customerFirstName,
							customerLastName : customerLastName,
							customerAddress1 : customerAddress1,
							customerAddress2 : customerAddress2,
							customerCity : customerCity,
							customerZipCode : customerZipCode,
							customerStateProvince : customerStateProvince,
							customerCountry : customerCountry,
							customerDob : customerDob,
							cardNumber : cardNumber,
							cardCVV2 : cardCVV2,
							cardExpiryDate : cardExpiryDate,
							cardHolderName : cardHolderName,
							saveCard : saveCard,
							description : description,
							pSign :  pSign

						});

						Execute.createRecurring(newExecute, function(err,execute){
							if (err) throw err;
							console.log(execute);
						});
						req.flash('success_msg', "added a recurring payment");
					}
					break;
			}

		})
});


//get pago admin recurring
router.get('/recurring/', ensureAuthenticated, function(req, res){
	res.render('pago_recurring');
});


router.route('/recurring/')
	.get(ensureAuthenticated,function(req,res){

	})
	.post(ensureAuthenticated,function(req,res){
		var merchantID = req.body.merchantID;
		var amount = req.body.amount;
		var orderID = req.body.orderID;
		var originalTransactionID = req.body.originalTransactionID;
		var ApiPasscode = 'OPgDtw!%84RW';
		var pSignConvert = ApiPasscode + merchantID + amount + orderID + originalTransactionID;
		var pSign = sha1(pSignConvert);
		var datetime = new Date();
		var chargeDate = new Date(datetime.getTime() + 14 * 86400000 );
		//var now = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

		var formdata =  
			{
				merchantID : merchantID,
				amount : amount,
				orderID : orderID,
				originalTransactionID : originalTransactionID,
				pSign : pSign
			}
		request.post('https://secure.pagoglobal.com/transaction/recurrent',{ form:formdata },function(err, httpResponse, body){
			res.json(body);
			var jsonObject = JSON.parse(body);
			var responseCode = jsonObject.responseCode;
			var transactionID = jsonObject.transaction['transactionID'];
			console.log(transactionID);
			//validation

			switch(responseCode){

				case 1:
					var errors = req.validationErrors();

					if (errors) {
						// res.render('register',{errors:errors});
						console.log('errors');
					} else{

						var newRecurring = new Recurring({

							merchantID : merchantID,
							amount : amount,
							orderID : orderID,
							originalTransactionID : originalTransactionID,
							ApiPasscode : ApiPasscode,
							pSign : pSign,
							datetime : datetime,
							chargeDate : chargeDate,
							transactionID : transactionID

						});

						Recurring.createRecurring(newRecurring, function(err,recurring){
							if (err) throw err;
							console.log(recurring);
						});
						req.flash('success_msg', "added a recurring payment");
					}
					break;
			}

		})
});