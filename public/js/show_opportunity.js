$(document).ready(function(){
	var pathArray = window.location.pathname.split( '/' );
	var opportunity_id = pathArray[4];
	$('.date-picker').datepicker({
	    rtl: App.isRTL(),
	    orientation: "left",
	    autoclose: true
	});
});
$(function(){

	var pathArray = window.location.pathname.split( '/' );
	var opportunity_id = pathArray[4];

	$('#oppID').val(opportunity_id);

	$.getJSON('/admin/opportunity/api/' + opportunity_id, function(results){
	      var oppurtunity_stage = results.oppurtunity_stage;
	      if ( oppurtunity_stage == '1' ) {
	        $('.QualificationActive').addClass('active');
	      } else if ( oppurtunity_stage == '2') {
	        $('.QualificationActive').removeClass('active');
	        $('.AnalysisActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','40%');
	      } else if ( oppurtunity_stage == '3' ) {
	        $('.QualificationActive').removeClass('active');
	        $('.ProposalActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','60%');
	      } else if ( oppurtunity_stage == '4' ) {
	        $('.QualificationActive').removeClass('active');
	        $('.NegotiationActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','80%');
	      } else if ( oppurtunity_stage == '5' ) {
	        $('.QualificationActive').removeClass('active');
	        $('.ClosedActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','100%');
	        $('#closedOpp').html('<i class="fa fa-check"></i> Closed Won')
	      } else if ( oppurtunity_stage == '6' ) {
	        $('.QualificationActive').removeClass('active');
	        $('.ClosedActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','100%');
	        $('#closedOpp').html('<i class="fa fa-check"></i> Closed Lost')
	      }
	});

	$('#UpdateStageBtn').click(function(){
	    var data = {};
	    data.opportunity_id = opportunity_id;
	    data.oppurtunity_stage = $('#UpdateOpporStage').val();
	    console.log(data);
	    $.ajax({
	        url: '/admin/opportunity/edit_opportunity_stages',
	        method: 'PUT',
	        contentType: 'application/json',
	        data: JSON.stringify(data),
	        success:function(response){
	            $('.closemodal').click();
	            App.blockUI({
	                target: '.profile-content',
	                boxed: true
	            });
	            window.setTimeout(function() {
	                App.unblockUI('.profile-content');
	                Command: toastr["success"](response)
	                toastr.options = {
	                  "closeButton": false,
	                  "debug": false,
	                  "newestOnTop": false,
	                  "progressBar": false,
	                  "positionClass": "toast-top-right",
	                  "preventDuplicates": false,
	                  "onclick": null,
	                  "showDuration": "300",
	                  "hideDuration": "1000",
	                  "timeOut": "5000",
	                  "extendedTimeOut": "1000",
	                  "showEasing": "swing",
	                  "hideEasing": "linear",
	                  "showMethod": "fadeIn",
	                  "hideMethod": "fadeOut"
	                }
	                location.reload();
	            }, 3000);
	        },
	        error:function(response){
	            console.log(response);
	        }
	    });
	});


	$('#btnMarkComplete').click(function(){
	    var Oppsteps = $('#stepsLeads').find('li.active #lead-data').attr('data-id');
	    var opportunity_id = $('#oppID').val();

	    if ( Oppsteps == '5' ) {
	        $('#convertmodalbutton').click();
	    } else {
	        return OppStages(Oppsteps,opportunity_id);
	    }

	});

	function OppStages(Oppsteps, opportunity_id){
	    var data = {};
	    data.opportunity_id = opportunity_id;
	    data.oppurtunity_stage = Oppsteps;
	    console.log(data);
	    $.ajax({
	        url: '/admin/opportunity/edit_opportunity_stages',
	        method: 'PUT',
	        contentType: 'application/json',
	        data: JSON.stringify(data),
	        success:function(response){
	            App.blockUI({
	                target: '.profile-content',
	                boxed: true
	            });
	            window.setTimeout(function() {
	                App.unblockUI('.profile-content');
	                Command: toastr["success"](response)
	                toastr.options = {
	                  "closeButton": false,
	                  "debug": false,
	                  "newestOnTop": false,
	                  "progressBar": false,
	                  "positionClass": "toast-top-right",
	                  "preventDuplicates": false,
	                  "onclick": null,
	                  "showDuration": "300",
	                  "hideDuration": "1000",
	                  "timeOut": "5000",
	                  "extendedTimeOut": "1000",
	                  "showEasing": "swing",
	                  "hideEasing": "linear",
	                  "showMethod": "fadeIn",
	                  "hideMethod": "fadeOut"
	                }
	                location.reload();
	            }, 3000);
	        },
	        error:function(response){
	            console.log(response);
	        }
	    });
	}

	var oppurtunity_account = '{{OppResults.oppurtunity_account._id}}';
	var oppurtunity_account_type = '{{OppResults.oppurtunity_account_type}}';
	var oppurtunity_stage = '{{OppResults.oppurtunity_stage}}';

	$('#UpdateOppAccName').val(oppurtunity_account);
	$('#UpdateOppAccType').val(oppurtunity_account_type);
	$('#UpdateOppStage').val(oppurtunity_stage);

	$('#UpdateOpp').click(function(){
	    var data = {};
	    data.opportunity_id  = opportunity_id;
	    data.oppurtunity_name = $('#UpdateOppName').val();
	    data.oppurtunity_account = $('#UpdateOppAccName').val();
	    data.oppurtunity_account_type = $('#UpdateOppAccType').val();
	    data.oppurtunity_owner = $('#UpdateOppOwnerId').val();
	    data.oppurtunity_close_date = $('#UpdateoppCloseDate').val();
	    data.oppurtunity_stage = $('#UpdateOppStage').val();
	    data.oppurtunity_probability = $('#UpdateOppProb').val();
	    data.oppurtunity_amount = $('#UpdateOppAmount').val();
	    $.ajax({
	        url: '/admin/opportunity/edit_opportunity',
	        method: 'PUT',
	        contentType: 'application/json',
	        data: JSON.stringify(data),
	        success:function(response){
	            $('.closemodal').click();
	            App.blockUI({
	                target: '.profile-content',
	                boxed: true
	            });
	            window.setTimeout(function() {
	                App.unblockUI('.profile-content');
	                Command: toastr["success"](response)
	                toastr.options = {
	                  "closeButton": false,
	                  "debug": false,
	                  "newestOnTop": false,
	                  "progressBar": false,
	                  "positionClass": "toast-top-right",
	                  "preventDuplicates": false,
	                  "onclick": null,
	                  "showDuration": "300",
	                  "hideDuration": "1000",
	                  "timeOut": "5000",
	                  "extendedTimeOut": "1000",
	                  "showEasing": "swing",
	                  "hideEasing": "linear",
	                  "showMethod": "fadeIn",
	                  "hideMethod": "fadeOut"
	                }
	                location.reload();
	            }, 3000);
	        },
	        error:function(response){
	            console.log(response);
	        }
	    });
	});
});

$(function(){
	var selectedAccount;
	var pathArray = window.location.pathname.split( '/' );
	var opportunity_id = pathArray[4];

	$('#LeadLogEmailAccount').change(function(){
		if ($(this).data('id') != '0') {
			var selected = $(this).find('option:selected');
			selectedAccount = selected.data('id');		
		}
	});

	$('#LogEmailForm .mention_sample').mentionsInput({
		onDataRequest:function(mode,query,callback) {
			$.getJSON('/admin/user/merge/account/api/' + selectedAccount, function(responseData){
				responseData = _.filter(responseData, function(item){
					return item.fullname.toLowerCase().indexOf(query.toLowerCase()) > -1 
				});
				callback.call(this,responseData);
			});
		}
	});

	$('#logEmailBtn').click(function(){

		$('#LogEmailForm .mention_sample').mentionsInput('getMentions', function(response) {

			if ( $.isEmptyObject(response) ) {
				$('.tagUser').show();
				$('#CommentsLogEmail').addClass('error');
				$('#LeadLogEmailAccount').addClass('error');
			} else {
				for (var i = 0; i < response.length; i++) {
					var assigned = response[i]._id;
					doAjaxLogEmail(assigned);
				}
			}
		});

	});

	function doAjaxLogEmail(assigned){
		var data = {};
		data.subject = $('#subjectLogEmail').val();
		data.comments = $('#CommentsLogEmail').val();
		data.account = $('#LeadLogEmailAccount').val();
		data.assigned = assigned;
		data.oppurtunity = opportunity_id;
		console.log(data);
		$.ajax({
			url: '/admin/opportunity/add_email_log',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success : function(response){
				console.log(response);
				location.reload();
			},
			error : function(response){
				console.log(response);
			}
		});
	}
});

$(function(){
	$('#logEmailData').on('click', '.todo-tasklist-item', function(){
		var lead_log_email = $(this).attr('data-id');
		$.getJSON('/admin/opportunity/api/single/logemail/' + lead_log_email, function(response){
			$('#showmodalLogEmailBtn').click();
			$('#UpdateSubjectLogEmail').val(response.subject);
			$('#UpdateCommentsLogEmail').val(response.comments);
			$('#updatepriorityLogEmail').val(response.priority);
			$('#updateStatusLogEmail').val(response.status);
			$('#updateAssignedLogEmail').val(response.assigned._id);
			$('#logEmailID').val(lead_log_email);
		});
	});

	$('#DelLogLogEmail').click(function(){
		var data = {};
		data.email_log_id = $('#logEmailID').val();
		$.ajax({
			url: '/admin/opportunity/delete_emaillog',
			method: 'DELETE',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success : function(response){
				console.log(response);
				location.reload();
			},
			error : function(response){
				console.log(response);
			}
		});
	});
});

$(function(){
	$('#editLogEmailBtn').click(function(){
		var data = {};
		data.subject = $('#UpdateSubjectLogEmail').val();
		data.comments = $('#UpdateCommentsLogEmail').val();
		data.priority = $('#updatepriorityLogEmail').val();
		data.status = $('#updateStatusLogEmail').val();
		data.assigned = $('#updateAssignedLogEmail').val();
		data.logEmailId = $('#logEmailID').val();
		//console.log(data);
		$.ajax({
		    url: '/admin/opportunity/edit_emaillog',
		    method : 'PUT',
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
	$('#UpdateLogEmailForm').on('dblclick','.dblclick', function(){
		$(this).removeAttr('readonly');
	})
	$('#taskForm').on('dblclick','.dblclick', function(){
		$(this).removeAttr('readonly');
	})
})

$(function(){
	var selectedAccount;
	var pathArray = window.location.pathname.split( '/' );
	var opportunity_id = pathArray[4];

	$('#LeadLogCallAccount').change(function(){
		if ($(this).data('id') != '0') {
			var selected = $(this).find('option:selected');
			selectedAccount = selected.data('id');
		}
	})
});

$(function(){
	var selectedAccount;
	var pathArray = window.location.pathname.split( '/' );
	var opportunity_id = pathArray[4];

	$('#LeadLogCallAccount').change(function(){
		if ($(this).data('id') != '0') {
			var selected = $(this).find('option:selected');
			selectedAccount = selected.data('id');
		}
	})

	$('#LogsCallForm .mention_sample').mentionsInput({
		onDataRequest:function(mode,query,callback) {
			$.getJSON('/admin/user/merge/account/api/' + selectedAccount, function(responseData){
				responseData = _.filter(responseData, function(item){
					return item.fullname.toLowerCase().indexOf(query.toLowerCase()) > -1 
				});
				callback.call(this,responseData);
			});
		}
	});

	$('#locBtn').click(function(){
		$('#LogsCallForm .mention_sample').mentionsInput('getMentions', function(response) {
			if ( $.isEmptyObject(response) ) {
				$('.tagUser').show();
				$('#CommentsLAC').addClass('error');
				$('#LeadLogCallAccount').addClass('error');
			} else {
				for (var i = 0; i < response.length; i++) {
					var assigned = response[i]._id;
					LogCallFUnct(assigned);
				}
			}
		});
	});

		function LogCallFUnct(assigned){
			var data = {};
		    data.subject = $('#subjectLAC').val();
		    data.comments = $('#CommentsLAC').val();
		    data.accounts = $('#LeadLogCallAccount').val();
		    data.opportunity_id = opportunity_id;
		    data.assigned = assigned;
		    console.log(data);
	        $.ajax({
	            url: '/admin/opportunity/add_logcall',
	            method : 'POST',
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

$(function(){

	$('#log_a_call_feed').on('click','.todo-tasklist-item', function(){
		var call_log_id = $(this).attr('data-id');
		$.getJSON('/admin/opportunity/api/single/logcall/' + call_log_id, function(response){
			console.log(response);
			$('#showModalLogCallBtn').click();
			$('#UpdateSubjectLAC').val(response.subject)
			$('#UpdateCommentsLAC').val(response.comments)
			$('#updateprioritylog').val(response.priority)
			$('#updateStatuslog').val(response.status);
			$('#UpdateLogCallId').val(response._id);
		})
	});

	$('#editLeadLocBTN').click(function(){
	    var data = {};
	    data.opp_id = $('#UpdateLogCallId').val();
	    data.subject = $('#UpdateSubjectLAC').val();
	    data.comments = $('#UpdateCommentsLAC').val();
	    data.priority = $('#updateprioritylog').val();
	    data.status = $('#updateStatuslog').val();
	    $.ajax({
	        url: '/admin/opportunity/edit_logcall',
	        method : 'PUT',
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

	$('#leadDelBtn').click(function(){
		var data = {};
		data.loc_id = $('#UpdateLogCallId').val();
		$.ajax({
		    url: '/admin/opportunity/delete_log_call',
		    method : 'DELETE',
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

})

$(function(){

	var pathArray = window.location.pathname.split( '/' );
	var opportunity_id = pathArray[4];
	var form = $('#addAccountTaskForm');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);
	var selectedAccount;

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
	        subjectTask: {
	            required: true
	        },
	        kickoffDate: {
	            required: true,
	        },
	        dueDateTask : {
	          required: true
	        },
	        commentsTask : {
	          required : true
	        },
	        priority : {
	          required: true
	        },
	        status : {
	          required : true
	        },
	        assigned : {
	          required : true
	        },
	        taskAccount : {
	        	required : true
	        }
	    },

	    invalidHandler: function (event, validator) { //display error alert on form submit              
	        success.hide();
	        error.show();
	        //App.scrollTo(error1, 0);
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

	$('#taskAccount').change(function(){
		if ( $(this).data('id') != '0') {
			var selected = $(this).find('option:selected');
			selectedAccount = selected.data('id');
		}
		$.getJSON('/admin/user/merge/account/api/' + selectedAccount, function(UserData){
			$('#assigned').html('<option value>---------- Select User ----------</option>');
			for (var i = 0; i < UserData.length; i++) { 
			    var fullname = UserData[i].fullname;
			    var user_id = UserData[i]._id;
			    $('#assigned').append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ fullname +'</option>');   
			}
		});
	});

	$('#taskBtn').click(function(){
		if ( !form.valid() ) {
		    return false
		} else {
		    addAccountTaskFunc()
		}
	});

	function addAccountTaskFunc(){
	  var data = {};
	  data.subject = $('#subjectTask').val();
	  data.kick_off = $('#kickoffDate').val();
	  data.due_date = $('#dueDateTask').val();
	  data.comments = $('#commentsTask').val();
	  data.account = $('#taskAccount').val();
	  data.priority = $('#priority').val();
	  data.status = $('#status').val();
	  data.assigned = $('#assigned').val();
	  data.account = $('#taskAccount').val();
	  data.opportunity = opportunity_id;
	  $.ajax({
	      url: '/admin/opportunity/add_task',
	      method : 'POST',
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

$(function(){
	var pathArray = window.location.pathname.split( '/' );
	var opportunity_id = pathArray[4];

	$('#LeadTaskData').on('click', '.todo-tasklist-item', function(){
		var task_id = $(this).attr('data-id');
		$.getJSON('/admin/opportunity/api/one_task/' + task_id, function(response){
			$('#showTaskModal').click();
			$('#updatesubjectTask').val(response.subject);
			$('#updateKickOff').val(ConvertDate(response.kickoff));
			$('#updatedueDateTask').val(ConvertDate(response.due_date));
			$('#updatecommentsTask').val(response.comments);
			$('#updatepriority').val(response.priority);
			$('#updatestatus').val(response.status);
			$('#updateAccountTask').val(response.account._id);
			$('#task_id').val(response._id);
			$.getJSON('/admin/user/merge/account/api/' + response.account._id, function(UserData){
				$('#updateassigned').html('<option value>---------- Select User ----------</option>');
				for (var i = 0; i < UserData.length; i++) { 
				    var fullname = UserData[i].fullname;
				    var user_id = UserData[i]._id;
				    $('#updateassigned').append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ fullname +'</option>');
				    $('#updateassigned').val(response.assigned._id); 
				}
			});
		})

		function ConvertDate(date) {
			var date = new Date(date);
			var month = date.getMonth() + 1;
			return month + "/" + date.getDate() + "/" + date.getFullYear();
		}
	});

	$('#editTaskBtn').click(function(){
		var data = {};
		data.task_id = $('#task_id').val();
		data.subject = $('#updatesubjectTask').val();
		data.account = $('#updateAccountTask').val();
		data.kick_off = $('#updateKickOff').val();
		data.due_date = $('#updatedueDateTask').val();
		data.comments = $('#updatecommentsTask').val();
		data.priority = $('#updatepriority').val();
		data.status = $('#updatestatus').val();
		data.assigned = $('#updateassigned').val();
		data .opportunity = opportunity_id;
		$.ajax({
		    url: '/admin/opportunity/update_tasks',
		    method : 'PUT',
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

	$('#taskbtndel').click(function(){
		var data = {};
		data.task_id = $('#task_id').val();
		$.ajax({
			url: '/admin/opportunity/delete_task',
			method: 'DELETE',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success : function(response){
				console.log(response);
				location.reload();
			},
			error : function(response){
				console.log(response);
			}
		});
	});

});