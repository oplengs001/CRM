$(function(){
	// $('.reload').click(function(){
	// 	$.ajax({
	// 	    url: '/admin/work_dashboard/syncworkpuls',
	// 	    method: 'PUT',
	// 	    success:function(response){
	// 	        getProducData( response.data )
	// 	    },
	// 	    error:function(response){
	// 	        console.log('errr');
	// 	    }
	// 	});
	// });

	// function getProducData(obj){
	// 	for (var key in obj) {
	// 		$.ajax({
	// 			url: '/admin/work_dashboard/syncemployee',
	// 			method : 'PUT',
	// 			contentType: 'application/json',
	// 			data: JSON.stringify(obj[key]),
	// 			success:function(response){
	// 			    location.reload();
	// 			},
	// 			error:function(response){
	// 			    console.log(response)
	// 			}
	// 		});
	// 	}
	// }
});

$(document).ready(function(){
	
	//start datatables data

	var pathArray = window.location.pathname.split( '/' );
	var employee_id = pathArray[4];
	console.log(employee_id);

	$.getJSON( '/admin/work_dashboard/getemployeedata/' + employee_id , function( queryResult ) {
	    var table = $('#sample_1').DataTable({
	    responsive: true,
	    autoWidth: false,
	    data: queryResult,
	    columnDefs :
	        [	
	        	{
                    "targets" : [ 0 ],
                    "render" : function(data, type, row, meta) {
                        return convertDate(Date.now())
                    }
                },
	            {
	            	"targets" : [1,2,3,4,5,6],
	            	"render" : function(data,type,row,meta){
	            	 	return convertTime(data)
	            	}
	            }

	        ],
	    columns: 
	        [
	            {
	                "title" : "Date"
	            },
	            {
	                "data" : "office_time",
	                "title" : "Clock In"
	            },
	            {
	                "data" : "active_time",
	                "title" : "Clock Out"
	            },
	            {
	                "data" : "office_time",
	                "title" : "Office Time"
	            },
	            {
	                "data" : "active_time",
	                "title" : "All Activities"
	            },
	            {
	            	"data" : "active_time",
	            	"title" : "Computer Activites"
	            },
	            {
	            	"title" : "Productive",
	            	"data" : "productive_time"
	            }
	        ]
	      });
	console.log(queryResult);
	var productive = queryResult[0].productive_time;
	var unproductive =  queryResult[0].unproductive_time;
	var neutral = queryResult[0].neutral_time;
	var barOptions_stacked = {
    tooltips: {
        enabled: false
    },
    hover :{
        animationDuration:0
    },
    scales: {
        xAxes: [{
            ticks: {
                beginAtZero:true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11
            },
            scaleLabel:{
                display:false
            },
            gridLines: {
            }, 
            stacked: true
        }],
        yAxes: [{
            gridLines: {
                display:false,
                color: "#fff",
                zeroLineColor: "#fff",
                zeroLineWidth: 0
            },
            ticks: {
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11
            },
            stacked: true
        }]
    },
    legend:{
        display:true

    },
    animation: {
        onComplete: function () {
            var chartInstance = this.chart;
            var ctx = chartInstance.ctx;
            ctx.textAlign = "left";
            ctx.font = "9px Open Sans";
            ctx.fillStyle = "#fff";

            Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function (bar, index) {
                    data = dataset.data[index];
                    if(i==0){
                        ctx.fillText(convertTime(data), 50, bar._model.y+4);
                    } else {
                        ctx.fillText(convertTime(data), bar._model.x-25, bar._model.y+4);
                    }
                }),this)
            }),this);
        }
    },
    pointLabelFontFamily : "Quadon Extra Bold",
    scaleFontFamily : "Quadon Extra Bold",
};
		var ctx = document.getElementById("Chart1");
		var myChart = new Chart(ctx, {
		    type: 'horizontalBar',
		    data: {
		        labels: ["Today"],
		        datasets: [{
		        	label: "Productive",
		            data: [productive],
		            backgroundColor: "rgba(63,103,126,1)",
		            hoverBackgroundColor: "rgba(50,90,100,1)"
		        },{
		        	label: "Unproductive",
		            data: [unproductive],
		            backgroundColor: "rgba(163,103,126,1)",
		            hoverBackgroundColor: "rgba(140,85,100,1)"
		        },{
		        	label: "Neutral",
		            data: [neutral],
		            backgroundColor: "rgba(63,203,226,1)",
		            hoverBackgroundColor: "rgba(46,185,235,1)"
		        }]

		    },
		    options: barOptions_stacked,
		});

	});

	//end of datatables
})



function convertDate(data){
	var date = new Date(data);
	var month = date.getMonth() + 1;
	var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear();
	return newDateCreated
}

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
