$(document).ready(function(){
	// init datepicker
	$('.date-picker').datepicker({
	    rtl: App.isRTL(),
	    orientation: "left",
	    autoclose: true
	});
});

$(function(){

	var pathArray = window.location.pathname.split( '/' );
	var leads_id = pathArray[4];

	var $select_account = $('#AccountLAC');
	$.getJSON( '/admin/accounts/api', function( accountData ) {
	     $select_account.html('<option>--- Select Account ---</option>');

	     for (var i = 0; i < accountData.length; i++) { 
	         var account_name = accountData[i].account_name;
	         var account_id = accountData[i]._id;
	         $select_account.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>'); 
	     }
	});

	$.getJSON('/admin/leads/api/' + leads_id, function(leadsdata){
	      var lead_status = leadsdata.lead_status;
	      var lead_name = leadsdata.fullname;
	      var lead_title = leadsdata.title;
	      var lead_id = leadsdata._id;
	      var lead_company = leadsdata.company;
	      var lead_email = leadsdata.email;
	      var lead_source = leadsdata.lead_source;
	      var lead_phonenumber = leadsdata.phone;
	      var lead_employee =  leadsdata.number_of_employees;
	      var lead_address = leadsdata.address;
	      var lead_city = leadsdata.city;
	      var lead_country = leadsdata.country;
	      var lead_industry = leadsdata.industry;
	      var lead_website = leadsdata.website;
	      var lead_notes = leadsdata.notes;

	      $('#leadID').val(lead_id);
	      if ( lead_status == '2') {
	        $('.UnqualifiedActive').removeClass('active');
	        $('.NewActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','40%');
	      } else if ( lead_status == '3' ) {
	        $('.UnqualifiedActive').removeClass('active');
	        $('.WorkingActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','60%');
	      } else if ( lead_status == '4' ) {
	        $('.UnqualifiedActive').removeClass('active');
	        $('.NurturingActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','80%');
	      } else if ( lead_status == '5' ) {
	        $('.UnqualifiedActive').removeClass('active');
	        $('.ConvertedActive').addClass('active selectorActive');
	        $('.progress-bar').css('width','100%');
	      }
	      $('.leadTitle').text(lead_title);
	      //append edit form
	      $('#UpdateLeadStatus').val(lead_status);
	      $('#UpdateLeadFullName').val(lead_name);
	      $('#UpdateLeadTitle').val(lead_title);
	      $('#UpdateLeadCompany').val(lead_company);
	      $('#UpdateLeadEmail').val(lead_email);
	      $('#UpdateLeadSource').val(lead_source);
	      $('#UpdateLeadPhoneNumber').val(lead_phonenumber);
	      $('#UpdateLeadsNumberEmployees').val(lead_employee);
	      $('#UpdateLeadAddress').val(lead_address);
	      $('#UpdateLeadCity').val(lead_city); 
	      $('#UpdateLeadCountry').val(lead_country);
	      $('#UpdateLeadIndustry').val(lead_industry);
	      $('#UpdateLeadWebsite').val(lead_website);
	      $('#updateLeadNotes').val(lead_notes)

	      $('#convertAccount').val(lead_company);
	      $('#ConertAccountLeadSouce').val(lead_source);
	      $('#ConvertLeadWebsite').val(lead_website);
	      $('#ConvertLeadEmployeeNumber').val(lead_employee);
	      $('#ConvertLeadIndustry').val(lead_industry);
	      $('#ConvertLeadPhoneNumber').val(lead_phonenumber);
	      $('#ConvertLeadAddress').val(lead_address);
	      $('#ConvertLeadCity').val(lead_city);
	      $('#ConvertLeadCountry').val(lead_country);
	});

	$('#btnMarkComplete').click(function(){
	    var leadsteps = $('#stepsLeads').find('li.active #lead-data').attr('data-id');
	    var lead_id = $('#leadID').val();
	    if ( leadsteps == '5') {
	        $('#convertmodalbutton').click();
	    } else {
	        return leadStatus(leadsteps,lead_id);
	    }
	});

	function leadStatus(leadsteps, lead_id){
	    var data = {};
	    data.lead_id = lead_id;
	    data.lead_status = leadsteps;
	    console.log(data);
	    $.ajax({
	        url: '/admin/leads/edit_status_lead',
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
	               Command: toastr["success"]("Successfull Updating Lead Status")

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
	           }, 5000);
	        },
	        error:function(response){
	            console.log(response);
	        }
	    });
	}

	$('#updateLeadBtn').click(function(){
	    var data = {};
	    var lead_id = $('#leadID').val();
	    data.lead_status = $('#UpdateLeadStatus').val();
	    data.fullname = $('#UpdateLeadFullName').val();
	    data.title = $('#UpdateLeadTitle').val();
	    data.company = $('#UpdateLeadCompany').val();
	    data.email = $('#UpdateLeadEmail').val();
	    data.lead_source = $('#UpdateLeadSource').val();
	    data.phone = $('#UpdateLeadPhoneNumber').val();
	    data.number_of_employees = $('#UpdateLeadsNumberEmployees').val();
	    data.address = $('#UpdateLeadAddress').val();
	    data.city = $('#UpdateLeadCity').val();
	    data.country = $('#UpdateLeadCountry').val();
	    data.industry = $('#UpdateLeadIndustry').val();
	    data.website = $('#UpdateLeadWebsite').val();
	    data.notes = $('#updateLeadNotes').val();
	    data.lead_id = lead_id;                    
	    $.ajax({
	        url: '/admin/leads/edit_status',
	        method: 'PUT',
	        contentType: 'application/json',
	        data: JSON.stringify(data),
	        success:function(response){
	            $('.closeModalBtn').click();
	            App.blockUI({
	                target: '.profile-content',
	                boxed: true
	            });
	            window.setTimeout(function() {
	                App.unblockUI('.profile-content');
	                Command: toastr["success"]("Successfull Updating Leads")

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
	            }, 5000);
	        },
	        error:function(response){
	            console.log(response);
	        }
	    });
	});

	$('#convertLeadBTN').click(function(){
	    $.getJSON('/admin/leads/api/' + leads_id, function(LeadData){
	    	var data = {};
	        // for(var key in LeadData){
	            data.account_name = $('#convertAccount').val();
	            data.account_owner = $('#converAccountOwnerID').val();
	            data.lead_source = $('#ConertAccountLeadSouce').val();
	            data.website_url = $('#ConvertLeadWebsite').val();
	            data.number_of_employees = $('#ConvertLeadEmployeeNumber').val();
	            data.industry = $('#ConvertLeadIndustry').val();
	            data.phone = $('#ConvertLeadPhoneNumber').val();
	            data.address = $('#ConvertLeadAddress').val();
	            data.city = $('#ConvertLeadCity').val();
	            data.country = $('#ConvertLeadCountry').val();
	            data.leads_id = leads_id;

	            data.contacts_fullname = LeadData.fullname;
	            data.contacts_email = LeadData.email;
	            data.contacts_phone = LeadData.phone;
	            data.contacts_owner = LeadData.owner._id;
	        //}
	            $.ajax({
	                url: '/admin/leads/convert_account',
	                method: 'POST',
	                contentType: 'application/json',
	                data: JSON.stringify(data),
	                success:function(response){
	                    $('.closeModalBtn').click();
	                    App.blockUI({
	                        target: '.profile-content',
	                        boxed: true
	                    });
	                    window.setTimeout(function() {
	                        App.unblockUI('.profile-content');
	                        Command: toastr["success"]("Adding Account Successfull")

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
							contactConvert(response._id);
						
	                    }, 3000);
	                },
	                error:function(response){
	                    console.log(response);
	                }
	            });
	    });
	});


	function contactConvert(accountId){
		var data = {};
		$.getJSON('/admin/leads/api/' + leads_id, function(LeadData){
			data.contacts_account_name = accountId;
			data.contacts_fullname = LeadData.fullname;
			data.contacts_email = LeadData.email;
			data.contacts_phone = LeadData.phone;
			data.contacts_owner = LeadData.owner._id;
			console.log(data);
			$.ajax({
			    url: '/admin/contacts/add_new',
			    method: 'POST',
			    contentType: 'application/json',
			    data: JSON.stringify(data),
			    success:function(response){
			        App.blockUI({
			            target: '.profile-content',
			            boxed: true
			        });
			        window.setTimeout(function() {
			            App.unblockUI('.profile-content');
			            Command: toastr["success"]("Adding Account Contact")

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
						//updateStatus();
						console.log(response)
						openOppModal(response);
			        }, 3000);
			    },
			    error:function(response){
			        console.log(response);
			    }
			});
		});
	}

	function openOppModal(response){
		 App.blockUI({
			            target: '.profile-content',
			            boxed: true
			        });
			        window.setTimeout(function() {
			            App.unblockUI('.profile-content');
			            Command: toastr["success"]("Add Details in the Oppurtunity")

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
						console.log(response);
						CreateOppurtunity(response);
			        }, 3000);
	}
	
	function CreateOppurtunity(res){
		$('#openbtnModalOpp').click();
		$.getJSON('/admin/contacts/api/' + res._id, function(response){
			$('#oppurtunity_name').val(response.contacts_account_name.account_name);
			$('#oppurtunity_accID').val(response.contacts_account_name._id);
			$('#oppurtunity_account_name').val(response.contacts_account_name.account_name);
		})
	}


	$('#logacallitems').on('click','#editleadLocModalBtn', function(){
	    var loc_id = $(this).attr('data-id');
	    $('#locId').val(loc_id);
	    $.getJSON('/admin/leads/lead_log_a_call/api/' + loc_id, function(query){
	        $('#UpdateSubjectLAC').val(query.subject);
	        $('#UpdateCommentsLAC').val(query.comments);
	        $('#updateprioritylog').val(query.priority);
	        $('#updateStatuslog').val(query.status);
	        $('#createById').val(query.created_by);
	    });
	});

	$('#sharePost').click(function(){
	    var data = {};
	    data.lead_post = leads_id;
	    data.created_by = $('#postUserCurrent').val();
	    data.post = $('#postField').val();
	    console.log(data);
	    $.ajax({
	        url: '/admin/leads/add_lead_post',
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
	});

	$('.insertPostLead').on('click','#modalPostEdit', function(){
	    var post_id = $(this).attr('data-id');
	    $.getJSON('/admin/leads/lead_post/post/api/' + post_id, function(query){
	        console.log(query);
	    });
	});
	
});

$(function(){

	var pathArray = window.location.pathname.split( '/' );
	var leads_id = pathArray[4];
	var selectedAccount;

	$('#LeadLogCallAccount').change(function(){
		if ($(this).data('id') != '0') {
			var selected = $(this).find('option:selected');
			selectedAccount = selected.data('id');		
		}
	})

	// $('#LogsCallForm .mention_sample').mentionsInput({
	// 	onDataRequest:function(mode,query,callback) {
	// 		$.getJSON('/admin/user/merge/account/api/' + selectedAccount, function(responseData){
	// 			responseData = _.filter(responseData, function(item){
	// 				return item.fullname.toLowerCase().indexOf(query.toLowerCase()) > -1 
	// 			});
	// 			callback.call(this,responseData);
	// 		});
	// 	}
	// });

	$('#locBtn').click(function(){
		// $('#LogsCallForm .mention_sample').mentionsInput('getMentions', function(response) {
		// 	if ( $.isEmptyObject(response) ) {
		// 		$('.tagUser').show();
		// 		$('#CommentsLAC').addClass('error');
		// 		$('#LeadLogCallAccount').addClass('error');
		// 	} else {
		// 		for (var i = 0; i < response.length; i++) {
		// 			var assigned = response[i]._id;
		// 			LogCallFUnct(assigned);
		// 		}
		// 	}
		// });
		LogCallFUnct()
	});

	function LogCallFUnct(){
		var data = {};
	    data.subject = $('#subjectLAC').val();
	    data.comments = $('#CommentsLAC').val();
	    //data.accounts = $('#LeadLogCallAccount').val();
	    data.leads_id = leads_id;
	    // data.assigned = assigned;
        $.ajax({
            url: '/admin/leads/add_logcall',
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
	var leads_id = pathArray[4];

	var form = $('#LogEmailForm');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);
	var selectedAccount;

	$('#LeadLogEmailAccount').change(function(){
		if ( $(this).data('id') != '0') {
			var selected = $(this).find('option:selected');
			selectedAccount = selected.data('id');
		}
	});

	// $('#LogEmailForm .mention_sample').mentionsInput({
	//   onDataRequest:function (mode, query, callback) {
	//     $.getJSON('/admin/user/merge/api', function(responseData) {
	//       responseData = _.filter(responseData, function(item) { return item.fullname.toLowerCase().indexOf(query.toLowerCase()) > -1 });
	//       callback.call(this, responseData);
	//     });
	//   }
	// });

	$('#logEmailBtn').click(function(){

		// $('#LogEmailForm .mention_sample').mentionsInput('getMentions', function(response) {

		// 	// if ( $.isEmptyObject(response) ) {
		// 	// 	$('.tagUser').show();
		// 	// 	$('#CommentsLogEmail').addClass('error');
		// 	// 	$('#LeadLogEmailAccount').addClass('error');
		// 	// } else {
		// 	// 	for (var i = 0; i < response.length; i++) {
		// 	// 		var assigned = response[i]._id;
		// 	// 		doAjaxFunc(assigned);
		// 	// 	}
		// 	// }

		// 	for (var i = 0; i < response.length; i++) {
		// 		var assigned = response[i]._id;
		// 		doAjaxFunc(assigned);
		// 	}
		// });

		doAjaxFunc();

	});

	function doAjaxFunc() {
		var data = {};
		data.subject = $('#subjectLogEmail').val();
		data.comments = $('#CommentsLogEmail').val();
		//data.account = $('#LeadLogEmailAccount').val();
		//data.assigned = assigned;
		data.leads = leads_id;
		$.ajax({
		    url: '/admin/leads/add_emailLog',
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
	var leads_id = pathArray[4];

	$('#LeadTaskData').on('click', '.todo-tasklist-item', function(){
		var task_id = $(this).attr('data-id');
		$.getJSON('/admin/leads/lead_task/api/' + task_id, function(response){
			$('#showTaskModal').click();
			$('#updatesubjectTask').val(response.subject);
			$('#updateKickOff').val(ConvertDate(response.kickoff));
			$('#updatedueDateTask').val(ConvertDate(response.due_date));
			$('#updatecommentsTask').val(response.comments);
			$('#updatepriority').val(response.priority);
			$('#updatestatus').val(response.status);
			$('#updateAccountTask').val(response.account);
			$('#task_id').val(response._id);
			$.getJSON('/admin/user/merge/account/api/' + response.account, function(UserData){
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

	$('#updateAccountTask').change(function(){
		if ( $(this).data('id') != '0') {
			var selected = $(this).find('option:selected');
			selectedAccount = selected.data('id');
		}
		$.getJSON('/admin/user/merge/account/api/' + selectedAccount, function(UserData){
			$('#updateassigned').html('<option value>---------- Select User ----------</option>');
			for (var i = 0; i < UserData.length; i++) { 
			    var fullname = UserData[i].fullname;
			    var user_id = UserData[i]._id;
			    $('#updateassigned').append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ fullname +'</option>');   
			}
		});
	});

})

$(function(){

	var pathArray = window.location.pathname.split( '/' );
	var leads_id = pathArray[4];

	$('#logEmailData').on('click', '.todo-tasklist-item', function(){
		var lead_log_email = $(this).attr('data-id');
		$.getJSON('/admin/leads/lead_log_email/api/' + lead_log_email, function(response){
			$('#showmodalLogEmailBtn').click();
			$('#UpdateSubjectLogEmail').val(response.subject);
			$('#UpdateCommentsLogEmail').val(response.comments);
			$('#updatepriorityLogEmail').val(response.priority);
			$('#updateStatusLogEmail').val(response.status);
			$('#updateAssignedLogEmail').val(response.assigned._id);
			$('#logEmailID').val(lead_log_email);
		});
	});

	$('#editLogEmailBtn').click(function(){
		var data = {};
		data.subject = $('#UpdateSubjectLogEmail').val();
		data.comments = $('#UpdateCommentsLogEmail').val();
		data.priority = $('#updatepriorityLogEmail').val();
		data.status = $('#updateStatusLogEmail').val();
		data.assigned = $('#updateAssignedLogEmail').val();
		data.logEmailId = $('#logEmailID').val();
		$.ajax({
		    url: '/admin/leads/edit_emaillog',
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

	$('#DelLogLogEmail').click(function(){
		var data = {}
		data.email_log_id = $('#logEmailID').val();
		$.ajax({
		    url: '/admin/leads/delete_emaillog',
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
});

$(function(){

	$('#logacallitems').on('click','.todo-tasklist-item', function(){
		var call_log_id = $(this).attr('data-id');
		$.getJSON('/admin/leads/lead_log_a_call/api/' + call_log_id, function(response){
			console.log(response);
			$('#showModalLogCallBtn').click();
			$('#UpdateSubjectLAC').val(response.subject)
			$('#UpdateCommentsLAC').val(response.comments)
			$('#updateprioritylog').val(response.priority)
			$('#updateStatuslog').val(response.status);
			$('#UpdateLogCallId').val(response._id);
		})
	})

	$('#editLeadLocBTN').click(function(){
	    var data = {};
	    data.loc_id = $('#UpdateLogCallId').val();
	    data.subject = $('#UpdateSubjectLAC').val();
	    data.comments = $('#UpdateCommentsLAC').val();
	    data.priority = $('#updateprioritylog').val();
	    data.status = $('#updateStatuslog').val();
	    console.log(data);
	    $.ajax({
	        url: '/admin/leads/edit_logcall',
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
		    url: '/admin/leads/delete_logacall',
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

$(function () {
	var pathArray = window.location.pathname.split( '/' );
	var leads_id = pathArray[4];
	var form = $('#AddOppForm');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);

	$('#addOppBtn').click(function(){
	    if ( !form.valid() ) {
	       return false;
	    } else {
			addOppFunc();					
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
		data.oppurtunity_account = $('#oppurtunity_accID').val();
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
				updateStatus();	
		    },
		    error:function(response){
		        console.log(response);
		    }
		});
	   
	}

	function updateStatus(){
	    var data = {};
	    data.lead_id = leads_id;
	    data.lead_status = '5';
	    console.log(data);
	    $.ajax({
	        url: '/admin/leads/edit_status_lead',
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
	                Command: toastr["success"]("All Done")

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
	            }, 1000);
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

	var pathArray = window.location.pathname.split( '/' );
	var leads_id = pathArray[4];

	var form1 = $('#addAccountTaskForm');
	var error1 = $('.alert-danger', form1);
	var success1 = $('.alert-success', form1);
	var selectedAccount;


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

	$('#addAccountTaskForm').validate({
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
	        success1.hide();
	        error1.show();
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

	$('#taskBtn').click(function(){
		if ( !$('#addAccountTaskForm').valid() ) {
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
	  data.leads = leads_id;
	  console.log(data);
	  $.ajax({
	      url: '/admin/leads/add_task',
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

	$('#taskForm').on('dblclick','.dblclick', function(){
		$(this).removeAttr('readonly');
	})

	$('#UpdateLogEmailForm').on('dblclick','.dblclick', function(){
		$(this).removeAttr('readonly');
	})

});

$(function(){
	$('#taskbtndel').click(function(){
		var data  = {};
		data.task_id = $('#task_id').val();
		$.ajax({
			url: '/admin/leads/delete_tasks',
			method: 'DELETE',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success : function(response) {
				location.reload();
			},
			error : function(response) {
				console.log(response)
			}
		});
	})
});

$(function(){

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
		$.ajax({
		    url: '/admin/leads/update_tasks',
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
})
