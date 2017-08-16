$(document).ready(function(){

	//data tables

	$.getJSON( '/admin/project/merge/api', function( queryResult ) {
	    var table = $('#sample_1').DataTable({
	    responsive: true,
	    autoWidth: false,
	    data: queryResult,
	    columnDefs: 
	        [
	            {
	                "targets" : [ 0 ],
	                "render" : function(data, type, row, meta) {
	                    return '<a href="projects/'+ row['_id'] +'">'+ data +'</a>';
	                }
	            },
	            {
	                "targets" : [1],
	                "width" : "10%"
	            },
	            {
	                "targets" : [7],
	                "width" : "10%",
	                "render" : function(data,type,row,meta){
	                    var project_id = row['_id'];
	                    var newData = Math.trunc(data);
	                    if ( data <= 50) {
	                        return '<div class="text-center">'+'<span class="todo-tasklist-badge badge badge-roundless label-danger">'+ 
	                            newData +'%</span>&nbsp;'+'</div>';
	                    } else if ( data >= 51 ) {
	                        return '<div class="text-center"><span class="todo-tasklist-badge badge badge-roundless label-success text-center">'+ 
	                            newData +'%</span>&nbsp;</div>';
	                    }
	                }
	            },
	            {
	                "targets" : [8],
	                "render" : function(data, type, row, meta){
	                   return  '<div class="btn-group">' +
	                                '<button type="button" id="deletebtn" class="btn btn-danger btn-xs" data-id="'+ row['_id'] +'"><i class="fa fa-trash-o"></i></button>' +
	                                '<a href="#basic" data-toggle="modal" data-id="'+ row['_id'] +'" class="btn btn-primary btn-xs" id="updateProjectBTN">' +
	                                    '<i class="fa fa-pencil-square-o"></i>'
	                                '</a>' +
	                            '</div>'
	                }
	            },
	            {
	                "targets" : [3],
	                "render" : function(data, type, row, meta){
	                    var date = new Date(row['kickoff']);
	                    var month = date.getMonth() + 1;
	                    return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
	                }
	            },
	            {
	                "targets" : [4],
	                "render" : function(data, type, row, meta){
	                    var date = new Date(row['deadline']);
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
	                "data" : "project_name",
	                "title" : "Project"
	            },
	            {
	                "data" : "account.account_name",
	                "title" : "Account"
	            },
	            {
	                "data" : "created.path",
	                "title" : "Owner"
	            },
	            {
	                "data" : "kickoff",
	                "title" : "Kickoff"
	            },
	            {
	                "data" : "deadline",
	                "title" : "Dead Line"
	            },
	            {
	                "title" : "Hours Budget",
	                "data" : "total_hours_budget"
	            },
	            {
	                "title" : "Hours Incurred",
	                "data" : "total_hours_incurred"
	            },
	            {
	                "title" : "Completed",
	                "data" : "percent_complete"
	            },
	            {
	                "title" : "Actions"
	            }
	        ]
	      });
	}); //end of $getjson

});

$(function(){

	$('.date-picker').datepicker({
	    rtl: App.isRTL(),
	    orientation: "left",
	    autoclose: true
	});


	var $addAccount = $('#account');
	$addAccount.html('<option value>--- Select Account ---</option>');
	$.getJSON('/user/api', function(CurrentUserData){
	    $('#user_id').val(CurrentUserData._id);
	    $('#owner').val(CurrentUserData.fullname);
	    $.getJSON('/admin/accounts/api', function(account_data){
	        console.log(account_data);
	        for (var i = 0; i < account_data.length; i++) { 
	            var account_name = account_data[i].account_name;
	            var account_id = account_data[i]._id;
	            $addAccount.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>');   
	        }
	    });
	});

	var form4 = $('#addProjectForm');
	var error4 = $('.alert-danger', form4);
	var success4 = $('.alert-success', form4);


	$('#createPostBtn').click(function(){
	  if ( !$('#addProjectForm').valid() ) {
	    return false
	  } else {
	  	//alert('true')
	    addProjectFunc();
	  }
	});

	function addProjectFunc(){
		var data = {};
		data.project_name = $('#project_name').val();
		data.status = $('#status').val();
		//data.predecessorProject = $('#predecessorProject').val();
		data.kickoff = $('#projectkickoff').val();
		data.deadline = $('#projectDeadline').val();
		data.account = $('#account').val();
		data.created = $('#user_id').val();
		data.description = $('#project_desc').val();
		data.total_hours_budget = $('#total_hours_budget').val();
		
		$.ajax({
		    url: '/admin/projects/add_project',
		    method: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(data),
		    success:function(response){
		       console.log(response)
		        location.reload();
		    },
		    error:function(response){
		        console.log(response);
		    }
		})
	}

	$('#addProjectForm').validate({
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
	        project_name: {
	            required: true
	        },
	        status : {
	        	required : true
	        },
	        projectkickoff : {
	        	required : true
	        },
	        projectDeadline : {
	        	required : true
	        },
	        account : {
	        	required : true
	        },
	        owner : {
	        	required : true
	        },
	        total_hours_budget : {
	        	required : true
	        },
	         project_desc : {
	         	required : true
	         }
	    },

	    invalidHandler: function (event, validator) { //display error alert on form submit              
	        success4.hide();
	        error4.show();
	        App.scrollTo(error4, -200);
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


	$('#sample_1').on('click','#updateProjectBTN', function(){
	    var project_id =  $(this).attr('data-id');
	    $('#project_id').val(project_id);
	    var $account = $('#UpdateAccount');
	    var $addAccount = $('#account');
	    $account.html('<option value>--- Select Account ---</option>');
	    $.getJSON('/admin/accounts/api', function(account_data){
	        console.log(account_data);
	        for (var i = 0; i < account_data.length; i++) { 
	            var account_name = account_data[i].account_name;
	            var account_id = account_data[i]._id;
	            $account.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>');   
	        }
	    });
	    $.getJSON('/admin/project/merge/api/' + project_id, function(projectData){
	        console.log(projectData);
	        var project_name = projectData.project_name;
	        var project_status = projectData.status;
	        var project_account = projectData.account._id;
	        var project_owner = projectData.created.fullname;
	        var project_ownerID = projectData.created._id;
	        var project_description = projectData.description;
	        var project_kickoff = projectData.kickoff;
	        var project_deadline = projectData.deadline;
	        var project_total_hours_budget = projectData.total_hours_budget;

	        $('#updateProjectName').val(project_name);
	        $('#updateStatus').val(project_status);
	        $('#UpdateAccount').val(project_account);
	        $('#UpdateOwner').val(project_owner)
	        $('#UpdateOwnerID').val(project_ownerID);
	        $('#UpdateProjectDesc').val(project_description);
	        $('#UpdateProjectkickoff').val(project_kickoff);
	        $('#UpdateProjectDeadline').val(project_deadline);
	        $('#UpdateTotal_hours_budget').val(project_total_hours_budget);
	        //$('#UpdatePredecessorProject').val();
	    });
	});

	$('#updateProject').click(function(){
		if ( !$('#UpdateProjectForm').valid() ) {
		  return false
		} else {
		  updateProjectFunc();
		}
	});

	var form1 = $('#addProjectForm');
	var error1 = $('.alert-danger', form1);
	var success1 = $('.alert-success', form1);


	$('#UpdateProjectForm').validate({
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
	        updateProjectName: {
	            required: true
	        },
	        UpdateTotal_hours_budget : {
	        	required : true
	        },
	        UpdateProjectkickoff : {
	        	required : true
	        },
	        UpdateProjectDeadline : {
	        	required : true
	        },
	        updateStatus : {
	        	required : true
	        },
	        UpdateAccount : {
	        	required : true
	        },
	        UpdateProjectDesc : {
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

	function updateProjectFunc(){
		var data = {};
		data.project_name = $('#updateProjectName').val();
		data.created = $('#UpdateOwnerID').val();
		data.account = $('#UpdateAccount').val();
		data.status = $('#updateStatus').val();
		data.description = $('#UpdateProjectDesc').val();
		data.project_id = $('#project_id').val();
		data.kickoff = $('#UpdateProjectkickoff').val();
		data.deadline = $('#UpdateProjectDeadline').val();
		data.total_hours_budget = $('#UpdateTotal_hours_budget').val();
		console.log(data);
		$.ajax({
		    url: '/admin/projects/edit_project',
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

	$('#sample_1').on('click', '#deletebtn', function(){
	    var project_id = $(this).attr('data-id');
	    $.ajax({
	        url: '/admin/projects/delete_project/' + project_id,
	        method: 'DELETE',
	        contentType: 'application/json',
	        success: function(response){
	           location.reload();
	        }
	    });
	});

})