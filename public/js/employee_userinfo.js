$(document).ready(function(){

    var pathArray = window.location.pathname.split( '/' );
    var user_id = pathArray[3];

    $.getJSON('/user/api', function(datausers){
        console.log(datausers);
        var path = datausers.path;
        $('.profile-usertitle-name').append(datausers.fullname);
        $('.profile-usertitle-job').append(datausers.position);
        $('.profile-campaign').append(datausers.team.team_name);
        $('.profile-desc-title').append('About ' + datausers.fullname);
        $('.profile-desc-text').append(datausers.about);
        $('.profile-account').append(datausers.account.account_name);
        $('.fullnameinfo').append(datausers.fullname);
        $('.positionInfo').append(datausers.position)
        $('.accountInfo').append(datausers.account.account_name);
        $('.employeeStatusInfo').append(datausers.employeeStatus);
        $('.workScheduleinfo').append(datausers.workSchedule);
        $('.numberInfo').append(datausers.mobileNumber);
        $('.addressInfo').append(datausers.address);
        $('.usernameInfo').append(datausers.username);
        $('.employeeNumberinfo').append(datausers.employee_id);
        $('.teamInfo').append(datausers.team.team_name);
        $('.roleInfo').append(datausers.role);
        $('.dobinfo').append(datausers.dateOfBirth);
        $('.dateStartedInfo').append(datausers.dateStarted);
        $('.regulizationDateinfo').append(datausers.regulizationDate);
        $('.currentSalaryInfo').append(datausers.current_salary);
        $('.allowanceInfo').append(datausers.allowance);
        $('.otherAllowanceInfo').append(datausers.other_allowance);
        $('.sssInfo').append(datausers.sssNumber);
        $('.tinInfo').append(datausers.TinNumber);
        $('.philhealthInfo').append(datausers.philHealthNumber);
        $('.pagibigInfo').append(datausers.pagibig);
        $('.profile-userpic img').attr('src', '../../../../../' + path);
    });

    $('#editAccount').click(function(){
        window.location.href = '/home/profile/edit_profile';
    });

var chart;

var chartData = [
        {
            "month": 'Jan',
            "percentage": 95,
            "color" : '#E91E63',
        }, {
            "month": 'Feb',
            "percentage": 88,
            "color" : '#9C27B0',
        }, {
            "month": 'Mar',
            "percentage": 85,
            "color" : '#673AB7',
        }, {
            "month": 'Apr',
            "percentage": 90,
            "color" : '#2196F3',
        }, {
            "month": 'May',
            "percentage": 93,
            "color" : '#4CAF50',
        }, {
            "month": 'Jun',
            "percentage": 85,
            "color" : '#8BC34A',
        },{
            "month": 'July',
            "percentage": 87,
            "color" : '#CDDC39',
        },{
            "month": 'Aug',
            "percentage": 96,
            "color" : '#F44336',
        },{
            "month": 'Sept',
            "percentage": 92,
            "color" : '#009688',
        },{
            "month": 'Oct',
            "percentage": 90,
            "color" : '#FFC107',
        },{
            "month": 'Nov',
            "percentage": 88,
            "color" : '#795548',
        },{
            "month": 'Dec',
            "percentage": 85,
            "color" : '#3F51B5',
        }];


AmCharts.ready(function() {
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "month";
    chart.startDuration = 1;

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.labelRotation = 90;
    categoryAxis.gridPosition = "start";

    // value
    // in case you don't want to change default settings of value axis,
    // you don't need to create it, as one value axis is created automatically.
    // GRAPH
    var graph = new AmCharts.AmGraph();
    graph.valueField = 'percentage';
    graph.colorField = "color"
    graph.balloonText = "[[category]]: [[value]]";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.8;
    chart.addGraph(graph);
    
    chart.addListener("clickGraphItem", function (event) {
        // let's look if the clicked graph item had any subdata to drill-down into
        if (event.item.dataContext.subdata != undefined) {
            // wow it has!
            // let's set that as chart's dataProvider
            event.chart.dataProvider = event.item.dataContext.subdata;
            event.chart.validateData();
        }
    });

    chart.write("chart_1");
});

var chart = AmCharts.makeChart("chart_2", {
    "type": "serial",
    "theme": "light",
    "pathToImages": App.getGlobalPluginsPath() + "amcharts/amcharts/images/",
    "autoMargins": false,
    "marginLeft": 30,
    "marginRight": 8,
    "marginTop": 10,
    "marginBottom": 26,

    "fontFamily": 'Open Sans',            
    "color":    '#888',
    
    "dataProvider": [{
        "month": "Jan",
        "income": 90,
        "engagement": 80,
        "color" : "#151515"
    }, {
        "month": "Feb",
        "income": 80,
        "engagement": 75
    }, {
        "month": "Mar",
        "income": 99,
        "engagement": 88
    }, {
        "month": "Apr",
        "income": 86,
        "engagement": 70
    }, {
        "month": "May",
        "income": 95,
        "engagement": 95,
    }, {
        "month": "June",
        "income": 97,
        "engagement": 75,
    },
    {
        "month": "July",
        "income": 92,
        "engagement": 85,
    },
    {
        "month": "Aug",
        "income": 96,
        "engagement": 91,
    },
    {
        "month": "Sept",
        "income": 88,
        "engagement": 70,
    },
    {
        "month": "Oct",
        "income": 90,
        "engagement": 75,
    },
    {
        "month": "Nov",
        "income": 85,
        "engagement": 83,
    },
    {
        "month": "Dec",
        "income": 96,
        "engagement": 88,
    }
    ],
    "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
    }],
    "startDuration": 1,
    "graphs": [{
        "alphaField": "alpha",
        "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
        "dashLengthField": "dashLengthColumn",
        "fillAlphas": 1,
        "title": "Income",
        "type": "column",
        "valueField": "income"
    }, {
        "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
        "bullet": "round",
        "dashLengthField": "dashLengthLine",
        "lineThickness": 3,
        "bulletSize": 7,
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "useLineColorForBulletBorder": true,
        "bulletBorderThickness": 3,
        "fillAlphas": 0,
        "lineAlpha": 1,
        "title": "Engagement",
        "valueField": "engagement"
    }],
    "categoryField": "month",
    "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "tickLength": 0
    }
});

$('#chart_2').closest('.portlet').find('.fullscreen').click(function() {
    chart.invalidateSize();
});
});