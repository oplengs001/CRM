$(document).ready(function(){
    var pathArray = window.location.pathname.split( '/' );
    var account_id = pathArray[4];

    // init datepicker
    $('.date-picker').datepicker({
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true
    });

    $.getJSON('/admin/accounts/api/' + account_id, function(queryData){
        $('#UpdateAccountType').val(queryData.account_type);
        $('#UpdateIndustry').val(queryData.industry);
        $('#UpdateCountry').val(queryData.country);
        $('#UpdateNumberEmployees').val(queryData.number_of_employees);
        $('#UpdateDescription').val(queryData.description)
    });

    $.getJSON('/admin/user/merge/account/api/' + account_id, function(UserData){
        $updateAssigned = $('#updateassigned');
        $assigned = $('#assigned');
        $assigned.append('<option value>---------- Select User ----------</option>')
        $updateAssigned.append('<option value>---------- Select User ----------</option>')

       for (var i = 0; i < UserData.length; i++) { 
           var fullname = UserData[i].fullname;
           var user_id = UserData[i]._id;
           $assigned.append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ fullname +'</option>');   
       }

       for (var i = 0; i < UserData.length; i++) { 
           var fullname = UserData[i].fullname;
           var user_id = UserData[i]._id;
           $updateAssigned.append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ fullname +'</option>');   
       }
    });

    $.getJSON('/user/api/', function(querydata){
        var user_id = querydata._id;
        var path = querydata.path;
        // $('.todo-username').append(querydata.fullname);
        $('.todo-comment-username').append(querydata.fullname);
        // $('.todo-taskbody-user .todo-userpic').attr('src', path);
        $('#activityCrate').click(function(){
            var data = {};
            data.activity_title = $('#activity_title').val();
            data.activity_description = $('#activityDesc').val();
            data.due_date = $('#todo-taskbody-due').val();
            data.status = $('#status').val();
            data.created_by = user_id;
            data.account = account_id;
            $.ajax({
                url: '/admin/add_activity',
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

        $('#createProjectBtn').click(function(){
            var data = {};
            data.project_name = $('#project_name').val();
            data.account = account_id;
            data.created = user_id;
            $.ajax({
                url: '/admin/add_project',
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

        $('#locBtn').click(function(){
            $('.mention_sample').mentionsInput('getMentions', function(response) {
                if ( $.isEmptyObject(response) ) {
                    $('.logAcallTagUser').show();
                    $('#CommentsLAC').addClass('error');
                } else {
                    for (var i = 0; i < response.length; i++) { 
                        var assigned = response[i]._id;
                        var data = {};
                        data.subject = $('#subjectLAC').val();
                        data.comments = $('#CommentsLAC').val();
                        data.account = $('#accountIDLAC').val();
                        data.created_by = user_id;
                        data.assigned = assigned;
                        $.ajax({
                            url: '/admin/add_logcall',
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
                }
            });
        });
    });

    //get task by ID

    $('#campaignTable').on('click','#btncampaignDel', function(){
        var team_id = $(this).attr('data-id');
        $.ajax({
            url: '/admin/delete_team/' + team_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
               location.reload();
            }
        });
    });


    $('#userList').on('click', '#UserBtnDel', function(){
        var user_id = $(this).attr('data-id');
        $.ajax({
            url: '/admin/user_delete/' + user_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
               location.reload();
            }
        });
    });

    $('#taskFeedItem').on('click','#taskBtn', function(){
        var task_id = $(this).attr('data-id');
        $('#task_id').val(task_id);

        $.getJSON('/admin/tasks/merge/api/' + task_id, function(dataTask){
            $('#updatesubjectTask').val(dataTask.subject);
            $('#updatedueDateTask').val(dataTask.due_date);
            $('#updatecommentsTask').val(dataTask.comments);
            $('#updatetaskAccount').val(dataTask.account.account_name);
            $('#updatepriority').val(dataTask.priority);
            $('#updatestatus').val(dataTask.status);
            $('#updateassigned').val(dataTask.assigned._id);
        });
    });
});

$(function () {

  var pathArray = window.location.pathname.split( '/' );
  var account_id = pathArray[4];

  $('.mention_sample').mentionsInput({
    onDataRequest:function (mode, query, callback) {
      $.getJSON('/admin/user/merge/account/api/' + account_id, function(responseData) {
        responseData = _.filter(responseData, function(item) { return item.fullname.toLowerCase().indexOf(query.toLowerCase()) > -1 });
        callback.call(this, responseData);
      });
    }
  });

  $('#addteam').click(function(){
     var data = {};
     data.team_name = $('#team_name').val();
     data.account = account_id; 
     $.ajax({
         url: '/admin/campaigns/add_campaign',
         method: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(data),
         success:function(response){
             console.log(response);
             location.reload();
         },
         error:function(error){
             console.log('error');
         }
     });
  });

  $('#logEmailBtn').click(function(){
    $('.mention_sample').mentionsInput('getMentions', function(response) {
        if ( $.isEmptyObject(response) ) {
            $('.tagUser').show();
            $('#CommentsLogEmail').addClass('error');
        } else {
            for (var i = 0; i < response.length; i++) { 
               var assigned = response[i]._id;
               var data = {};
               data.subject = $('#subjectLogEmail').val();
               data.comments = $('#CommentsLogEmail').val();
               data.account = $('#accountIDLogEmail').val();
               data.assigned = assigned;
               console.log(data);
               $.ajax({
                   url: '/admin/accounts/add_log_on_email',
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
        }
    });
  });

  $('#logEmailItems').on('click','.todo-tasklist-item', function(){
    var log_email_id = $(this).attr('data-id');
    $.getJSON('/admin/accounts/api/log_email_single/' + log_email_id, function(logEmail){
        $('#showLogEmailModal').click();
        $('#logEmailID').val(logEmail._id)
        $('#updatesubjectLogEmail').val(logEmail.subject);
        $('#updateCommentsLogEmail').val(logEmail.comments);
        $('#updatePriorityLogEmail').val(logEmail.priority);
        $('#UpdateAccountLogEmail').val(logEmail.account.account_name);
        $('#UpdateAccountIDLogEmail').val(logEmail.account._id);
        $('#updateAssignedLogEmail').val(logEmail.assigned._id)
    })
  });

  $('#logEmailForm').on('dblclick','.form-control', function(){
        $(this).removeAttr('readonly');
  });

  $('#LacForm').on('dblclick','.form-control', function(){
        $(this).removeAttr('readonly');
  });

  $('#taskForm').on('dblclick','.form-control', function(){
    $(this).removeAttr('readonly');
  });

  $('#UpdateLogEmail').click(function(){
    var data = {};
    data.log_email_id = $('#logEmailID').val();
    data.subject = $('#updatesubjectLogEmail').val();
    data.comments = $('#updateCommentsLogEmail').val();
    data.priority = $('#updatePriorityLogEmail').val();
    data.status = $('#updateStatusLogEmail').val();
    data.account = $('#UpdateAccountIDLogEmail').val();
    data.assigned = $('#updateAssignedLogEmail').val();
    $.ajax({
        url: '/admin/accounts/update_log_email',
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

  $('#DeleteLogEmail').click(function(){
    var data = {};
   data.log_email_id = $('#logEmailID').val();
   $.ajax({
       url: '/admin/accounts/delete_log_email',
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

  $('#logacallitems').on('click','.todo-tasklist-item', function(){
      var log_id = $(this).attr('data-id');
     //$('#logacallId').val(log_id);
     $.getJSON('/admin/logacall/api/merge/' + log_id, function(dataLog){
          $('#ShowLACBTN').click();
          $('#logacallId').val(dataLog._id);
          $('#updateSubjectLOC').val(dataLog.subject);
          $('#updateCommentLAC').val(dataLog.comments);
          $('#updatePrioryLAC').val(dataLog.priority);
          $('#UpdateAccountLAC').val(dataLog.account.account_name);
          $('#UpdateAccountIDLAC').val(dataLog.account._id);
          $('#updateAssigendLACID').val(dataLog.assigned);
     });
  });

  $('#taskFeedItem').on('click','#showTasks', function(){
    var task_id = $(this).attr('data-id');
    $.getJSON('/admin/accounts//api/one_task/' + task_id, function(query){

        $('#showTaskModal').click();
        $('#task_id').val(query._id);
        $('#updatesubjectTask').val(query.subject);
        $('#updateKickOff').val( getDateStamp(query.kick_off) );
        $('#updatedueDateTask').val( getDateStamp(query.due_date) );
        $('#updatecommentsTask').val(query.comments);
        $('#updatepriority').val(query.priority);
        $('#updatestatus').val(query.status);
        $('#updateassigned').val(query.assigned._id);
    });
  });

  function getDateStamp(date){
      var date = new Date(date);
      var month = date.getMonth() + 1;
      var day = date.getDay();
      var year = date.getFullYear();
      var newDate = month + '/' + day + '/' + year;
      return newDate
  }

  $('#UpdateLAC').click(function(){
      var log_id = $('#logacallId').val();
      var data = {};
      data.subject = $('#updateSubjectLOC').val();
      data.comments = $('#updateCommentLAC').val();
      data.priority = $('#updatePrioryLAC').val();
      data.status = $('#updateStatusLAC').val();
      data.assigned = $('#updateAssigendLACID').val();
      data.log_id = $('#logacallId').val();
      $.ajax({
          url : '/admin/accounts/edit_Lac',
          method : 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success : function(response){
              console.log(response);
              location.reload();
          },
          error: function(response){
              console.log(response);
          }
      })
  });

  $('#editTaskBtn').click(function(){
      var task_id = $('#task_id').val();
      var data = {};      
      data.subject = $('#updatesubjectTask').val();
      data.kick_off = $('#updateKickOff').val();
      data.due_date = $('#updatedueDateTask').val();
      data.comments = $('#updatecommentsTask').val();
      data.priority = $('#updatepriority').val();
      data.status = $('#updatestatus').val();
      data.assigned = $('#updateassigned').val();
      data.task_id = task_id;
      $.ajax({
          url : '/admin/tasks/edit_task',
          method : 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success : function(response){
              console.log(response);
              location.reload();
          },
          error: function(response){
              console.log(response);
          }
      })
  });

  $('#delLogacall').click(function(){
      var log_id = $('#logacallId').val();
      $.ajax({
          url: '/admin/logAcall_delete/' + log_id,
          method: 'DELETE',
          contentType: 'application/json',
          success: function(response){
             location.reload();
          }
      });
  });

  $('#taskbtndel').click(function(){
      var task_id = $('#task_id').val();
      $.ajax({
          url: '/admin/task_delete/' + task_id,
          method: 'DELETE',
          contentType: 'application/json',
          success: function(response){
             location.reload();
          }
      });
  })

  var form1 = $('#addAccountTaskForm');
  var error1 = $('.alert-danger', form1);
  var success1 = $('.alert-success', form1);

  $('#taskBtn').click(function(){
    if ( !$('#addAccountTaskForm').valid() ) {
        return false
    } else {
        addAccountTaskFunc()
    }
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

  function addAccountTaskFunc(){
    var data = {};
    data.subject = $('#subjectTask').val();
    data.kick_off = $('#kickoffDate').val();
    data.due_date = $('#dueDateTask').val();
    data.comments = $('#commentsTask').val();
    data.account = $('#taskAccountID').val();
    data.priority = $('#priority').val();
    data.status = $('#status').val();
    data.assigned = $('#assigned').val();
    console.log(data);
    $.ajax({
        url: '/admin/tasks/add_task',
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

  $('#updataAccBtn').click(function(){
      if ( !$('#formUpdateAccountForm').valid() ) {
        return false
      } else {
        UpdateAccountFunc();
      }
  });

  function UpdateAccountFunc(){
    var data = {};
    data.account_id = account_id;
    data.account_name = $('#UpdateAccountname').val();
    data.account_owner = $('#UpdateAccountOwnerId').val();
    data.account_type = $('#UpdateAccountType').val();
    data.website_url = $('#UpdateWebsiteUrl').val();
    data.phone_number = $('#UpdatePhoneNumber').val();
    data.industry = $('#UpdateIndustry').val();
    data.number_of_employees = $('#UpdateNumberEmployees').val();
    data.address = $('#UpdateeAddress').val();
    data.city = $('#UpdateCity').val();
    data.country = $('#UpdateCountry').val();
    data.description = $('#UpdateDescription').val();
    $.ajax({
        url : '/admin/accounts/edit_account',
        method : 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success : function(response){
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
        error: function(response){
            console.log(response);
        }
    })
  }

  var form3 = $('#formUpdateAccountForm');
  var error3 = $('.alert-danger', form3);
  var success3 = $('.alert-success', form3);

  $('#formUpdateAccountForm').validate({
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
          UpdateAccountname: {
              required: true
          },
          UpdateAccountType: {
              required: true,
          },
          UpdateWebsiteUrl : {
            required: true
          },
          UpdatePhoneNumber : {
            required : true
          },
          UpdateIndustry : {
            required: true
          },
          UpdateNumberEmployees : {
            required : true
          },
          UpdateeAddress : {
            required : true
          },
          UpdateCity : {
            required : true
        },
        UpdateCountry : {
            required : true
        },
        UpdateDescription : {
            required : true
        }
      },

      invalidHandler: function (event, validator) { //display error alert on form submit              
          success3.hide();
          error3.show();
          App.scrollTo(error3, -200);
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

  var form4 = $('#sharePost');
  var error4 = $('.alert-danger', form4);
  var success4 = $('.alert-success', form4);

  $('#sharePost').click(function(){
    if ( !$('#sharePostForm').valid() ) {
      return false
    } else {
      sharePostFunc();
    }
  });

  function sharePostFunc(){
     var data = {};
     data.post = $('#postField').val();
     data.account_id = account_id;
     data.user_id = $('#userId').val();
    $.ajax({
        url: '/admin/accounts/add_post',
        method : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success:function(response){
            console.log('success');
            location.reload();
        },
        error:function(response){
            console.log('error');
            // location.reload();
            // $('#status').empty().text(response);
        }
    });
  }



  $('#sharePostForm').validate({
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
          postField: {
              required: true
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
});

$(function(){
    $('#deleteLAC').click(function(){
        var data = {};
        data.log_id = $('#logacallId').val();
        $.ajax({
            url: '/admin/accounts/delete_log_call',
            method : 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                console.log('success');
                location.reload();
            },
            error:function(response){
                console.log('error');
            }
        });
    });
});