router.put('/update_time', function(req,res){
	// var obj = {};
	// var time = req.body.time;
	var tasks = req.body.tasks;
	TimerModel.findOne({tasks:tasks}).exec(function(err,time){
		if (err) return err;
		var timeData = time.time;
		var hour = timeData.getHours();
		var min = timeData.getMinutes();
		var sec = timeData.getSeconds();

		var newCurrentTime = Date.now();
		var date = new Date(newCurrentTime);
		var hour2 = date.getHours();
		var min2 = date.getMinutes();
		var sec2 = date.getSeconds();

		var hourTime = hour2 - hour;
		// console.log('--------------------- hour ----------------------')
		// console.log(hourTime);
		// console.log('--------------------- end hour ----------------------')

		var minTime = min2 -min;
		// console.log('--------------------- min ----------------------')
		// console.log(minTime);
		// console.log('--------------------- end min ----------------------')

		var secTime = sec2 -sec;
		// console.log('--------------------- min ----------------------')
		// console.log(secTime);
		// console.log('--------------------- end min ----------------------')

		var newDateLess = hourTime + '/' + minTime + '/' + secTime;
		console.log(newDateLess);


		// var dateNow = Date.now();
		// var date = new Date(dateNow);
		// var total = date - timeData;
		// console.log(total); 
	});
});
