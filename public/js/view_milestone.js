$(document).ready(function(){

	//data tables

	$.getJSON( '/admin/milestone/api/', function( queryResult ) {
	    console.log(queryResult);
	    var table = $('#sample_1').DataTable({
	    responsive: true,
	    autoWidth: false,
	    data: queryResult,
	    columnDefs: 
	        [
	            {
	                "targets" : [ 0 ],
	                "render" : function(data, type, row, meta) {
	                    return '<a href="/admin/milestones/task/'+ row['_id'] +'" target="_blank">'+ data +'</a>';
	                }
	            },
	            {
	                "targets" : [1],
	                "width" : "10%"
	            },
	            {
	                "targets" : [7],
	                "render" : function(data, type, row, meta){
	                   return  '<div class="btn-group">' +
	                                '<button type="button" id="deleteMilestonbtn" class="btn btn-danger btn-xs" data-id="'+ row['_id'] +'"><i class="fa fa-trash-o"></i></button>' +
	                                '<a href="#updateMilestone" data-toggle="modal" data-id="'+ row['_id'] +'" class="btn btn-primary btn-xs" id="updataMilestoneBtn">' +
	                                    '<i class="fa fa-pencil-square-o"></i>'
	                                '</a>' +
	                            '</div>'
	                }
	            },
	            {
	                "targets" : [3],
	                "render" : function(data, type, row, meta){
	                    var date = new Date(row['kick_start']);
	                    var month = date.getMonth() + 1;
	                    return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
	                }
	            },
	            {
	                "targets" : [4],
	                "render" : function(data, type, row, meta){
	                    var date = new Date(row['due_date']);
	                    var month = date.getMonth() + 1;
	                    return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
	                }
	            },
	            {
	                "targets" : [5],
	                "width" : "5%"
	            },
	            {
	                "targets" : [2],
	                "width" : "10%",
	                "render" : function(data,type,row,meta){
	                    return '<img class="img-responsive" style="width:41%;border-radius:50%;margin:0 auto" src="'+ data +'" />';
	                }
	            }

	        ],
	    columns: 
	        [
	            {
	                "data" : "milestone_name",
	                "title" : "Milestone"
	            },
	            {
	                "data" : "account.account_name",
	                "title" : "Account"
	            },
	            {
	                "data" : "created_by.path",
	                "title" : "Owner"
	            },
	            {
	                "data" : "kick_start",
	                "title" : "Kickoff"
	            },
	            {
	                "data" : "due_date",
	                "title" : "Dead Line"
	            },
	            {
	                "title" : "Project",
	                "data" : "project.project_name"
	            },
	            {
	                "title" : "Milestone Completed",
	                "data" : "MilestoneCompleted"
	            },
	            {
	                "title" : "Actions"
	            }
	        ]
	      });
	});
	
});

$(function(){

	$('.date-picker').datepicker({
	    rtl: App.isRTL(),
	    orientation: "left",
	    autoclose: true
	});

	$('#sample_1').on('click', '#updataMilestoneBtn', function(){
	    var milestone_id = $(this).attr('data-id');
	    $.getJSON('/admin/milestone/merge/data/api/' + milestone_id, function(milestoneData){
	        var milestone_id = milestoneData._id;
	        var milestone_name = milestoneData.milestone_name;
	        var account_id = milestoneData.account._id;
	        var account_name = milestoneData.account.account_name;
	        var kick_start = milestoneData.kick_start;
	        var due_date = milestoneData.due_date;
	        var MilestoneCompleted = milestoneData.MilestoneCompleted;
	        var project_id = milestoneData.project._id;
	        var project_name = milestoneData.project.project_name;
	        var milestondec = milestoneData.milestondec;
	        var created_by_id = milestoneData.created_by._id;
	        var created_by = milestoneData.created_by.fullname;
	        var milestondec = milestoneData.milestondec;

	        var date = new Date(kick_start);
	        var month = date.getMonth() + 1;
	         var newKickStart = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear();

	         var date2 = new Date(due_date);
	         var month2 = date2.getMonth() + 1;
	          var newDueDate = month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear();

	        //append value
	        $('.milestoneID').val(milestone_id);
	        $('#UpdateMilestone_name').val(milestone_name);
	        $('#UpdateMilestoneAccountName').val(account_name);
	        $('#UpdateMilestoneAccountNameID').val(account_id);
	        $('#Updatekick_start').val(newKickStart);
	        $('#update_due_date').val(newDueDate);
	        if ( MilestoneCompleted == 'Yes') {
	            $('#UpdateMilestoneCompletedYes').attr('checked','true');
	        } else {
	            $('#UpdateMilestoneCompletedNo').attr('checked', 'true');
	        }
	        $('#UpdateProjectNameID').val(project_id);
	        $('#UpdateProjectName').val(project_name);
	        $('#updateMilestoneOwnerID').val(created_by_id);
	        $('#updateMilestoneOwner').val(created_by);
	        $('#Updatemilestondec').val(milestondec);

	    });
	});

	var form1 = $('#updateMilestoneForm');
	var error1 = $('.alert-danger', form1);
	var success1 = $('.alert-success', form1);

	$('#edtiMilestone').click(function(){
	  if ( !$('#updateMilestoneForm').valid() ) {
	      return false
	  } else {
	  		alert('true');
	      //createMilestoneFunc()
	  }
	});

	$('#updateMilestoneForm').validate({
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
	        UpdateMilestone_name: {
	            required: true
	        },
	        Updatekick_start: {
	            required: true,
	        },
	        update_due_date : {
	          required: true
	        },
	        Updatemilestondec : {
	          required : true
	        }
	    },

	    invalidHandler: function (event, validator) { //display error alert on form submit              
	        success1.hide();
	        error1.show();
	        App.scrollTo(error1, -200);
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

	// $('#edtiMilestone').click(function(){
	//     var data = {};
	//     data.milestone_id = $('.milestoneID').val();
	//     data.milestone_name = $('#UpdateMilestone_name').val();
	//     data.kick_start = $('#Updatekick_start').val();
	//     data.due_date = $('#update_due_date').val();
	//     data.MilestoneCompleted = $('input[name=UpdateMilestoneCompleted]:checked', '#UpdateMilestoneCompleted').val();
	//     data.milestondec = $('#Updatemilestondec').val();
	//     data.project = $('#UpdateProjectNameID').val();
	//     data.account = $('#UpdateMilestoneAccountNameID').val();
	//     data.created_by = $('#updateMilestoneOwnerID').val();
	//     $.ajax({
	//         url: '/admin/edit_milestone',
	//         method: 'PUT',
	//         contentType: 'application/json',
	//         data: JSON.stringify(data),
	//         success:function(response){
	//             console.log(response);
	//             location.reload();
	//         },
	//         error:function(response){
	//             console.log(response);
	//         }
	//     });
	// });

	$('#sample_1').on('click', '#deleteMilestonbtn',function(){
	    var milestone_id = $(this).attr('data-id');
	    $.ajax({
	        url: '/admin/delete_milestone/' + milestone_id,
	        method: 'DELETE',
	        contentType: 'application/json',
	        success: function(response){
	           location.reload();
	        }
	    });
	});

	var $account = $('#MilestoneAccountName');
	var $project = $('#ProjectName');
	$account.html('<option value>--- Select Account ---</option>');
	$project.html('<option value>--- Select Project ---</option>');
	$.getJSON('/admin/accounts/api', function(account_data){
	    console.log(account_data);
	    for (var i = 0; i < account_data.length; i++) { 
	        var account_name = account_data[i].account_name;
	        var account_id = account_data[i]._id;
	        $account.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>');   
	    }
	    $('#MilestoneAccountName').change(function(){
	       var selected = $(this).find('option:selected');
	       var selectedAccount = selected.data('id');
	       $.getJSON('/admin/project/api/' + selectedAccount, function(projectAccount){
	            $project.html('<option value="0">--- Select Project ---</option>');
	            for (var i = 0; i < projectAccount.length; i++) { 
	                var project_name = projectAccount[i].project_name;
	                var project_id = projectAccount[i]._id;
	                $project.append('<option value="'+ project_id +'" data-id="'+ project_id +'">'+ project_name +'</option>');  
	            }
	       });
	    });
	});


	var form = $('#createMilestoneForm');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);

	$('#CreateMilestoneBtn').click(function(){
	  if ( !$('#createMilestoneForm').valid() ) {
	      return false
	  } else {
	      createMilestoneFunc()
	  }
	});

	$('#createMilestoneForm').validate({
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
	        milestone_name: {
	            required: true
	        },
	        MilestoneAccountName: {
	            required: true,
	        },
	        kick_start : {
	          required: true
	        },
	        due_date : {
	          required : true
	        },
	        ProjectName : {
	          required: true
	        },
	        milestondec : {
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

	function createMilestoneFunc(){
		var data = {};
		data.account = $('#MilestoneAccountName').val();
		data.project = $('#ProjectName').val();
		data.milestone_name = $('#milestone_name').val();
		data.kick_start = $('#kick_start').val();
		data.due_date = $('#due_date').val();
		data.MilestoneCompleted = $('input[name=MilestoneCompleted]:checked', '#MilestoneCompleted').val();
		data.milestondec = $('#milestondec').val();
		console.log(data);
		$.ajax({
		    url: '/admin/milestones/add_milestone',
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
});