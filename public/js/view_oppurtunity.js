$(document).ready(function(){
	$.getJSON( '/admin/opportunity/api', function( queryResult ) {

	  var table = $('#sample_2').DataTable( {
	    responsive: true,
	    autoWidth: false,
	    data: queryResult,
	    columnDefs: 
	        [
	            {
	                "targets" : [ 0 ],
	                "width" : "15%",
	                "render" : function(data, type, row, meta) {
	                    return '<a href="/admin/opportunity/show_opportunity/'+ row['_id'] +'" target="_blank">'+ data +'</a>';
	                }
	            },
	            {
	                "targets" : [1],
	                "width" : "10%",
	            },
	            {
	                "targets" : [2],
	                "width" : "15%",
	                "render" : function(data,type,row,meta){
	                    if ( row['oppurtunity_stage'] == '1') {
	                        return 'Qualification';
	                    } else if ( row['oppurtunity_stage'] == '2' ) {
	                        return 'Needs Analysis';
	                    } else if ( row['oppurtunity_stage'] == '3' ) {
	                        return 'Proposal';
	                    } else if ( row['oppurtunity_stage'] == '4' ) {
	                        return 'Negotiation';
	                    } else if ( row['oppurtunity_stage'] == '5' ) {
	                        return 'Closed Won';
	                    } else if ( row['oppurtunity_stage'] == '6' ) {
	                        return 'Close Lost';
	                    } else {
	                        "sample";
	                    }
	                }
	            },
	            {
	                "targets" : [3],
	                "render" : function(data,type,row,meta){
	                    var date = new Date(row['oppurtunity_close_date']);
	                    var month = date.getMonth() + 1;
	                    return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
	                }
	            },
	            {
	                "targets" : [5],
	                "render" : function(data, type, row, meta){
	                   return  '<div class="btn-group">' +
	                                '<button type="button" id="deletebtn" class="btn btn-danger" data-id="'+ row['_id'] +'">Delete</button>' +
	                                '<button type="button" data-target="#updateOppModal" data-toggle="modal" class="btn btn-primary" data-id="' + row['_id'] +' " id="UpdategetDataId">Update</button>' +
	                            '</div>'
	                }
	            }
	        ],
	    columns: 
	        [
	            {
	                "data" : "oppurtunity_name",
	                "title" : "Oppurtunity"
	            },
	            {
	                "data" : "oppurtunity_account.account_name",
	                "title" : "Account"
	            },
	            {
	                "data" : "oppurtunity_stage",
	                "title" : "Oppurtunity Stage"
	            },
	            {
	                "data" : "oppurtunity_close_date",
	                "title" : "Close Date"
	            },
	            {
	                "data" : "oppurtunity_owner.fullname",
	                "title" : "Oppurtunity Owner"
	            },
	            {
	                "title" : "Action"
	            }
	        ]
	      } );
	});
});

$(function(){
	$('.date-picker').datepicker({
	    rtl: App.isRTL(),
	    orientation: "left",
	    autoclose: true
	});
	$('#sample_2').on('click', '#UpdategetDataId', function(){
	    var opp_id = $(this).attr('data-id');
	    $.getJSON('/admin/opportunity/api/' + opp_id, function(query){
	        console.log(query);
	        $('#UpdateOppName').val(query.oppurtunity_name);
	        $('#opportunity_id').val(query._id);
	        $('#updateOppAccount').val(query.oppurtunity_account._id);
	        $('#UpdateOppAccontType').val(query.oppurtunity_account_type);
	        $('#UpdateOwnerName').val(query.oppurtunity_owner.fullname);
	        $('#UpdateOwnerId').val(query.oppurtunity_owner._id);
	        $('#UpdateCloseDate').val(convertISOTime(query.oppurtunity_close_date));
	        $('#UpdateProbability').val(query.oppurtunity_probability);
	        $('#UpdateStage').val(query.oppurtunity_stage);
	        $('#UpdateAmount').val(query.oppurtunity_amount);
	    });
	});

	function convertISOTime(newdate){

		var date = new Date(newdate);
		var month = date.getMonth() + 1;
		return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
	}


	$('#sample_2').on('click','#deletebtn',function(){
	    var opportunity_id = $(this).attr('data-id');
	    var data = {};
	    data.opportunity_id = opportunity_id;
	    $.ajax({
	        url: '/admin/opportunity/delete_opportunity',
	        method: 'DELETE',
	        contentType: 'application/json',
	        data: JSON.stringify(data),
	        success:function(response){
	            console.log(response);
	            location.reload();
	        },
	        error:function(response){
	            console.log(response);
	        }
	    });
	});
});

$(function(){

	var form = $('#AddOppForm');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);

	$('#addOppBtn').click(function(){
	    if ( !form.valid() ) {
	       return false;
	    } else {
	        addOppFunc()
	    }
	});

	form.validate({
	    errorElement: 'span', //default input error message container
	    errorClass: 'help-block help-block-error', // default input error message class
	    focusInvalid: false, // do not focus the last invalid input
	    ignore: "",  // validate all fields including form hidden input
	    messages: {
	        select_multi: {
	            maxlength: jQuery.validator.format("Max {0} items allowed for selection"),
	            minlength: jQuery.validator.format("At least {0} items must be selected")
	        }
	    },
	    rules: {
	        oppurtunity_name: {
	            required: true
	        },
	        oppurtunity_account_name: {
	            required: true
	        },
	        oppurtunity_account_type : {
	            required: true
	        },
	        oppurtunity_close_date: {
	            required: true
	        },
	        oppurtunity_stage : {
	            required : true
	        },
	        oppurtunity_probability : {
	           required: true
	        },
	        oppurtunity_amount : {
	           required : true
	        }
	    },

	    invalidHandler: function (event, validator) { //display error alert on form submit              
	        success.hide();
	        error.show();
	        App.scrollTo(error, -200);
	    },

	    highlight: function (element) { // hightlight error inputs
	        $(element)
	            .closest('.form-group').addClass('has-error'); // set error class to the control group
	    },

	    unhighlight: function (element) { // revert the change done by hightlight
	        $(element)
	            .closest('.form-group').removeClass('has-error'); // set error class to the control group
	    },

	    success: function (label) {
	        label
	            .closest('.form-group').removeClass('has-error'); // set success class to the control group
	    }
	});

	function addOppFunc(){
		var data = {};
		data.oppurtunity_name = $('#oppurtunity_name').val();
		data.oppurtunity_account = $('#oppurtunity_account_name').val();
		data.oppurtunity_account_type = $('#oppurtunity_account_type').val();
		data.oppurtunity_owner = $('#oppurtunity_ownerId').val();
		data.oppurtunity_close_date = $('#oppurtunity_close_date').val();
		data.oppurtunity_stage = $('#oppurtunity_stage').val();
		data.oppurtunity_probability = $('#oppurtunity_probability').val();
		data.oppurtunity_amount = $('#oppurtunity_amount').val();
		console.log(data);
		$.ajax({
		    url: '/admin/opportunity/add_new',
		    method: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(data),
		    success:function(response){
		        console.log(response);
		        location.reload();
		    },
		    error:function(response){
		        console.log(response);
		    }
		});
	}

	$('#addOppBtn').click(function(){
	    
	});

})

$(function(){

	var form = $('#updateOppForm');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);

	$('#updateOppBtn').click(function(){
	    if ( !form.valid() ) {
	       return false;
	    } else {
	        updateOppFunc()
	    }
	});

	form.validate({
	    errorElement: 'span', //default input error message container
	    errorClass: 'help-block help-block-error', // default input error message class
	    focusInvalid: false, // do not focus the last invalid input
	    ignore: "",  // validate all fields including form hidden input
	    messages: {
	        select_multi: {
	            maxlength: jQuery.validator.format("Max {0} items allowed for selection"),
	            minlength: jQuery.validator.format("At least {0} items must be selected")
	        }
	    },
	    rules: {
	        UpdateOppName: {
	            required: true
	        },
	        updateOppAccount: {
	            required: true
	        },
	        UpdateOppAccontType : {
	            required: true
	        },
	        UpdateCloseDate: {
	            required: true
	        },
	        UpdateStage : {
	            required : true
	        },
	        UpdateProbability : {
	           required: true
	        },
	        UpdateAmount : {
	           required : true
	        }
	    },

	    invalidHandler: function (event, validator) { //display error alert on form submit              
	        success.hide();
	        error.show();
	        App.scrollTo(error, -200);
	    },

	    highlight: function (element) { // hightlight error inputs
	        $(element)
	            .closest('.form-group').addClass('has-error'); // set error class to the control group
	    },

	    unhighlight: function (element) { // revert the change done by hightlight
	        $(element)
	            .closest('.form-group').removeClass('has-error'); // set error class to the control group
	    },

	    success: function (label) {
	        label
	            .closest('.form-group').removeClass('has-error'); // set success class to the control group
	    }
	});

	function updateOppFunc(){
	    var data = {};
	    data.opportunity_id = $('#opportunity_id').val();
	    data.oppurtunity_name = $('#UpdateOppName').val();
	    data.oppurtunity_account = $('#updateOppAccount').val();
	    data.oppurtunity_account_type = $('#UpdateOppAccontType').val();
	    data.oppurtunity_owner = $('#UpdateOwnerId').val();
	    data.oppurtunity_close_date = $('#UpdateCloseDate').val();
	    data.oppurtunity_probability = $('#UpdateProbability').val();
	    data.oppurtunity_stage = $('#UpdateStage').val();
	    data.oppurtunity_amount = $('#UpdateAmount').val();
	    $.ajax({
	        url: '/admin/opportunity/edit_opportunity',
	        method: 'PUT',
	        contentType: 'application/json',
	        data: JSON.stringify(data),
	        success:function(response){
	            console.log(response);
	            location.reload();
	        },
	        error:function(response){
	            console.log(response);
	        }
	    });
	}
})