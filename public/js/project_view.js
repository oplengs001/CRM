$(document).ready(function(){


	$.getJSON('/admin/projects/api/show_project', function(data){

		console.log(data);

		var DataComplete = 0,
		DataInActive = 0,
		DataPlanning = 0,
		DataActive = 0,
		DataDelay = 0,
		total_time = 0,
		i,
		total_time_incurred = 0;

		for( i = 0; i < data.length; i++) {
			if ( data[i].status == 'Completed' ) {
				DataComplete ++;
			} else if ( data[i].status == 'In Active' ) {
				DataInActive ++;
			} else if ( data[i].status == 'Planning' ) {
				DataPlanning ++;
			} else if ( data[i].status == 'Active') {
				DataActive ++;
			} else if ( data[i].status == 'Delay') {
				data[i].status ++;				
			}

			total_time += parseFloat(data[i].total_hours_budget);
			total_time_incurred += parseFloat(data[i].total_hours_incurred);
		}

		//google piehart

		google.charts.load("current", {packages:["corechart"]});
		     google.charts.setOnLoadCallback(drawChart);
		     function drawChart() {
		       var data = google.visualization.arrayToDataTable([
		         ['Task', 'Hours per Day'],
		         ['In Active',     DataInActive],
		         ['Planning',      DataPlanning],
		         ['Active',  DataActive],
		         ['Completed', DataComplete],
		         ['Delay',    DataDelay]
		       ]);

		       var options = {
		         title: '',
		         is3D: true,
		       };

		       var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
		       chart.draw(data, options);
		     }


		 //  ---------------------------- end google pie chart ------------------------------


		 // ------------------------- gauge chart ------------------------------------------------


		 var gaugeOptions = {

		     chart: {
		         type: 'solidgauge'
		     },

		     title: null,

		     pane: {
		         center: ['50%', '85%'],
		         size: '140%',
		         startAngle: -90,
		         endAngle: 90,
		         background: {
		             backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
		             innerRadius: '60%',
		             outerRadius: '100%',
		             shape: 'arc'
		         }
		     },

		     tooltip: {
		         enabled: false
		     },

		     // the value axis
		     yAxis: {
		         stops: [
		             [0.1, '#55BF3B'], // green
		             [0.5, '#DDDF0D'], // yellow
		             [0.9, '#DF5353'] // red
		         ],
		         lineWidth: 0,
		         minorTickInterval: null,
		         tickAmount: 2,
		         title: {
		             y: -70
		         },
		         labels: {
		             y: 16
		         }
		     },

		     plotOptions: {
		         solidgauge: {
		             dataLabels: {
		                 y: 5,
		                 borderWidth: 0,
		                 useHTML: true
		             }
		         }
		     }
		 };

		 // The speed gauge
		 var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
		     yAxis: {
		         min: 0,
		         max: total_time,
		         title: {
		             text: ''
		         }
		     },

		     credits: {
		         enabled: false
		     },

		     series: [{
		         name: 'Hours',
		         data: [80],
		         dataLabels: {
		             format: '<div style="text-align:center"><span style="font-size:25px;color:' +
		                 ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
		                    '<span style="font-size:12px;color:silver">Total Hours</span></div>'
		         },
		         tooltip: {
		             valueSuffix: ' Project Hours'
		         }
		     }]

		 }));

		 // Bring life to the dials
		     var point,
		         newVal,
		         inc;

		     if (chartSpeed) {
		         point = chartSpeed.series[0].points[0];

		         point.update(total_time_incurred);
		     }

	// ------------------------- End gauge chart ------------------------------------------------

		$.getJSON('/admin/projects/api/show_project_complete', function(query){

			//  ---------------------------- google pie chart ------------------------------
			var count = data.length;
			var complete = query.length;
			var completeProject = ( complete / count) * 100;
			
			//adding value
		    var total = 0  //set a variable that holds our total
		    var i;

			for (i = 0; i < data.length; i++) {  //loop through the array
			    total += parseFloat(data[i].total_hours_incurred);  //Do the math!
			}
			$('#TimeSpendOnProject').append(total);

			$('#PercentComplete').append(completeProject.toFixed(2) + '%');
			$('#totalProjects').append(count);
		});

	});

});