$(function(){
	$('.reload').click(function(){
		$.ajax({
		    url: '/admin/work_dashboard/syncworkpuls',
		    method: 'PUT',
		    success:function(response){
		        getProducData( response.data )
		    },
		    error:function(response){
		        console.log('errr');
		    }
		});
	});

	function getProducData(obj){
		for (var key in obj) {
			$.ajax({
				url: '/admin/work_dashboard/syncemployee',
				method : 'PUT',
				contentType: 'application/json',
				data: JSON.stringify(obj[key]),
				success:function(response){
				    location.reload();
				},
				error:function(response){
				    console.log(response)
				}
			});
		}
	}
});

$(function(){
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);

		function drawChart() {

			$.ajax({
				'url' : '/admin/work_dashboard/getemployeedata',
				'dataType' : 'json',
				success : function(res){

					var dataProductivity = 0,
					dataUnProductivity = 0,
					dataNeutral = 0,
					dataActive = 0;

					for(var key in res){
						var productive_time = parseInt( res[key].productive_time ); 
						dataProductivity = productive_time ++;

						var unproductive_time = parseInt( res[key].unproductive_time );
						dataUnProductivity = unproductive_time ++;

						var neutral_time = parseInt( res[key].neutral_time );
						dataNeutral = neutral_time ++;

						var active_time = parseInt( res[key].active_time );
						dataActive = active_time ++;

					}

					google.charts.load("current", {packages:["corechart"]});
					     google.charts.setOnLoadCallback(drawChart);
					     function drawChart() {
					       var data = google.visualization.arrayToDataTable([
					         ['Task', 'Activity'],
					         ['Productivity',     dataProductivity],
					         ['Unproductivity',      dataUnProductivity],
					         ['Neutral',  dataNeutral],
					         ['Active',  dataActive]
					       ]);

					       var options = {
					         title: '',
					         is3D: true,
					       };

					       var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
					       chart.draw(data, options);
					     }



				} // end of ajax
			})
		}
});

$(function(){



	       google.charts.load('current', {'packages':['corechart']});
	       google.charts.setOnLoadCallback(drawVisualization);



	       function drawVisualization() {
	         // Some raw data (not necessarily accurate)
	       //   var jsonData = google.visualization.arrayToDataTable([
	       //    ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
	       //    ['2004/05',  165,      938,         522,             998,           450,      614.6],
	       //    ['2005/06',  135,      1120,        599,             1268,          288,      682],
	       //    ['2006/07',  157,      1167,        587,             807,           397,      623],
	       //    ['2007/08',  139,      1110,        615,             968,           215,      609.4],
	       //    ['2008/09',  136,      691,         629,             1026,          366,      569.6]
	       // ]);

	       $.ajax({
	       	'url' : '/admin/work_dashboard/getemployeedata',
	       	'dataType' : 'json',
	       	success : function(response) {
	       		var data = "";
	       		var employee_name = "";
	       		var data = new google.visualization.DataTable();
	       		data.addColumn('string', 'Task');
	       		data.addColumn('number', 'Hours per Day');
	       		for (var key in response) {
	       			var ParseActive = parseInt( response[key].active_time );
	       			var active_time = (ParseActive / 60) / 60;
	       			data.addRows([
	       			  [ response[key].alias, active_time]
	       			]);
	       		}

	       		var options = {
	       		  title : '',
	       		  vAxis: {
	       		  	viewWindow: {
	  	              max : 12,
	  	              min : 0
	  	            },
	       		  	title: 'Hours'
	       		  },
	       		  hAxis: {title: 'Day'},
	       		  seriesType: 'bars',
	       		  series: {5: {type: 'line'}}
	       		};

	       		var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
	       		chart.draw(data, options);
	       	}
	       });
	   }
});


$(document).ready(function(){
	
	//start datatables data

	$.getJSON( '/admin/work_dashboard/getemployeedata', function( queryResult ) {
	    var table = $('#sample_1').DataTable({
	    responsive: true,
	    autoWidth: false,
	    data: queryResult,
	    columnDefs :
	        [	
	        	{
                    "targets" : [ 0 ],
                    "render" : function(data, type, row, meta) {
                        return '<a href="/admin/work_dashboard/employee/'+ row['employee_id'] +'" target="_blank">'+ data +'</a>';
                    }
                },
	            {
	            	"targets" : [1,2,3,4],
	            	"render" : function(data,type,row,meta){
	            	 	return convertTime(data)
	            	}
	            }

	        ],
	    columns: 
	        [
	            {
	                "data" : "alias",
	                "title" : "Name"
	            },
	            {
	                "data" : "office_time",
	                "title" : "Office Time"
	            },
	            {
	                "data" : "active_time",
	                "title" : "Active"
	            },
	            {
	                "data" : "productive_time",
	                "title" : "Productive"
	            },
	            {
	                "data" : "unproductive_time",
	                "title" : "Unproductive"
	            }
	        ]
	      });
	});

	//end of datatables
})

function convertTime(sec){
	var m = 0;
	var zeroH = "",zeroM = "";
	var h = Math.floor(sec/60) / 60;
	var temp_m = sec % 60;
	var m = parseInt(temp_m).toString();
	var hour = parseInt(h)
	hour = hour.toString();
	if (m.length == 1) {
		zeroM = "0";
	}
	if (hour.length == 1){
		zeroH = "0"
	}
	return zeroH + hour+ ":" + zeroM+ m  +" h"
}
// function convertTime(seconds){
// 	var data = (seconds / 60) / 60;
// 	var total_ave = parseInt(data % 60);
// 	console.log(total_ave)
// 	// data = parseInt(data % 60);
// 	// data = data.toString();
// 	// console.log(data)
// 	// // data = addZero_hour(data[0])+ ":" +addZero_min(data[1]) +" h";
// 	return  data;
// }
