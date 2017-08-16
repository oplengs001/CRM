$(document).ready(function(){
    var pathArray = window.location.pathname.split( '/' );
    var user_id = pathArray[4];
    var form1 = $('#profileInfo');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);
    var $select_account = $('#changed_account');
    var $select_account2 = $('#changed_team');
    var $select_account3 = $('#workSchedule');
    $select_account3.html('<option value="0">--- Work Schedule ---</option>');

    $('#showAccountProfile').click(function(){
        window.location.href = '/admin/user_profile/' + user_id;
    });
    $('#editAccount').click(function(){
        window.location.href = '/admin/users/show_user/' + user_id;
    });

   function populate(selector) {
       var select = $(selector);
       var hours, minutes, ampm, interval;
       for(var i = 420; i <= 1800; i += 60){
           hours = Math.floor(i / 60);
           minutes = i % 60;
           if (minutes < 10){
               minutes = '0' + minutes; // adding leading zero
           }
           ampm = 'AM';
           ampm2 = 'PM';
           hours = hours % 24;
           interval = (hours + 9) % 24;

           if(hours < 12){
            ampm = 'AM';
           }
           else{
            ampm = 'PM';
           }

           if(interval < 12){
               ampm2 = 'AM';
           }
           else{
               ampm2 = 'PM';
           }

           if (interval === 0) {
               interval = 12;
           }

           var parsedHrs = interval%12 == 0 ? 12 :interval%12;
           var parsedHrs2 = hours%12 == 0 ? 12 :hours%12; 
           var data = parsedHrs2 + ':' + minutes + ' ' + ampm + ' ' + '-' + ' ' + parsedHrs + ':' + minutes + ' ' + ampm2;
           select.append($('<option></option>')
               .attr('value', data)
               .text(data)); 
       }
   }

   populate($select_account3);


    $('#id_user').val(user_id);

    $('.date-picker').datepicker({
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true
    });

    $.getJSON( '/admin/user/merge/api/' + user_id, function( queryResult ){

        console.log(queryResult);

        var fullname = queryResult.fullname;
        var email = queryResult.email;
        var position = queryResult.position;
        var address = queryResult.address;
        var city = queryResult.city;
        var country = queryResult.country;
        var about = queryResult.about;
        var avatar = queryResult.has_avatar;
        var path = queryResult.path;
        var account = queryResult.account.account_name;
        var team = queryResult.team.team_name;
        var role = queryResult.role;
        var dateOfBirth = queryResult.dateOfBirth;
        var mobile = queryResult.mobileNumber
        var dateStarted = queryResult.dateStarted;
        var employeeStatus = queryResult.employeeStatus;
        var workSchedule = queryResult.workSchedule;
        var regulizationDate = queryResult.regulizationDate;
        var sssNumber = queryResult.sssNumber;
        var TinNumber = queryResult.TinNumber;
        var philHealthNumber = queryResult.philHealthNumber;
        var pagibig = queryResult.pagibig;
        var current_salary = queryResult.current_salary;
        var allowance = queryResult.allowance;
        var other_allowance = queryResult.other_allowance;


        //append data
        // $('#UpdateFullName').val(fullname);
        // $('#UpdateEmail').val(email);
        // $('#UpdatePosition').val(position);
        // $('#UpdateAddress').val(address);
        // $('#UpdateCity').val(city);
        // $('#UpdateCountry').val(country);
        // $('#UpdateAbout').val(about);
        // $('#dateOfBirth').val(dateOfBirth);
        // $('#mobileNumber').val(mobile);

        $('#employeeStatus').val(employeeStatus);
        $('#workSchedule').val(workSchedule);
        $('#dateStarted').val(dateStarted);
        $('#regulizationDate').val(regulizationDate);
        $('#sssNumber').val(sssNumber);
        $('#TinNumber').val(TinNumber);
        $('#philHealthNumber').val(philHealthNumber);
        $("#pagibig").val(pagibig);
        $('#current_salary').val(current_salary);
        $('#allowance').val(allowance);
        $('#other_allowance').val(other_allowance);

        $('.memberaccount').append(account);
        $('.memberteam').append(team);
        $('.memberdateStarted').append(role);

        $('.profile-usertitle .profile-usertitle-name').text(fullname);
        $('.profile-usertitle .profile-usertitle-job').text(position);

        $('#updateUserAccount').click(function(){
           
           if ( !$('#profileInfo').valid() ) {
              return false;
           } else {
              ajaxupdateuserAccount();
           }

        });

        $('#changedRoles').click(function(){
             $('#successRoles').empty().text('Updating Accounts').show().fadeOut(5000);
             var changed_roles = $('#changed_roles').val();
             var NewAccountId = $('#changed_account').val();
             var NewTeamId = $('#changed_team').val();
             
             var data = {};
             data.role = changed_roles;
             data.team = NewTeamId;
             data.account = NewAccountId;
             data.user_id = user_id;
             $.ajax({
                 url: '/admin/edit_user',
                 method: 'PUT',
                 contentType: 'application/json',
                 data: JSON.stringify(data),
                 success:function(response){
                     $('#successRoles').empty().text(response).show().fadeOut(5000);
                     location.reload();
                 },
                 error:function(response){
                     $('#errorRoles').empty().text(response).show().fadeOut(5000);
                 }
             })
        });

        function ajaxupdateuserAccount(){
           var data = {};
          data.fullname = $('#UpdateFullName').val();
          data.email = $('#UpdateEmail').val();
          data.position = $('#UpdatePosition').val();
          data.address = $('#UpdateAddress').val();
          data.city = $('#UpdateCity').val();
          data.country = $('#UpdateCountry').val();
          data.about = $('#UpdateAbout').val();
          data.dateOfBirth = $('#dateOfBirth').val();
          data.mobileNumber = $('#mobileNumber').val();
          data.user_id = user_id;

          $('#status').empty().text('updating');

          $.ajax({
              url: '/admin/accounts/update_user',
              method : 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(data),
              success:function(response){
                  console.log('success');
                  // window.location.href = '/admin/accounts/show_members/' + account_id + '/' + team_id + '/' + member_id
                  $('#status').empty().text(response);
              },
              error:function(response){
                  console.log('error');
                  $('#status').empty().text(response);
              }
          });
        }

        $('#profileInfo').validate({
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
                UpdateFullname: {
                    minlength: 2,
                    required: true
                },
                UpdateEmail: {
                    required: true,
                    email: true
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
    });
    
    $('#updateEmployeeInfo').click(function(){
        $('#status1').text('Updating....');
        var data = {};
        data.dateStarted =  $('#dateStarted').val();
        data.regulizationDate = $('#regulizationDate').val();
        data.sssNumber = $('#sssNumber').val();
        data.TinNumber =  $('#TinNumber').val();
        data.philHealthNumber = $('#philHealthNumber').val();
        data.pagibig = $("#pagibig").val();
        data.current_salary = $('#current_salary').val();
        data.allowance = $('#allowance').val();
        data.other_allowance = $('#other_allowance').val();
        data.employeeStatus = $('#employeeStatus').val();
        data.workSchedule = $('#workSchedule').val();
        data.user_id = user_id;
        $.ajax({
            url: '/admin/accounts/update_user_employee_info',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                $('#status1').empty().text(response).show().fadeOut(5000);
            },
            error:function(response){
                $('#status1').empty().text(response).show().fadeOut(5000);
            }
        })

    });

    $('#changedPasswordbtn').click(function(){


       if ( !$('#UpdatePasswordForm').valid() ) {
          return false;
       } else {
         $('#alertchanged').empty().text('Changing Password Please Wait...').show();
           App.blockUI({
               target: '#UpdatePasswordForm',
               animate: true
           });
           window.setTimeout(function() {
               App.unblockUI('#UpdatePasswordForm');
               changepasswordajax();
           }, 2000);
          
       }
    });

    function changepasswordajax(){
       var data = {};
       data.password = $('#NewUpdatePassword').val();
       data.user_id = user_id;
       $.ajax({
           url: '/admin/accounts/update_user_password',
           method : 'PUT',
           contentType: 'application/json',
           data: JSON.stringify(data),
           success:function(response){
               console.log('success');
               $('#alertchanged').empty().hide();
               $('#UpdatePasswordForm').trigger("reset");
               $('#alertpasswordsucc').empty().text(response).show().fadeOut(5000);
           },
           error:function(response){
               console.log('error');
           }
       });
    }

    $('#UpdatePasswordForm').validate({
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
            updatePassword: {
                minlength: 6,
                required: true
            },
            NewUpdatePassword: {
                required: true,
                minlength: 6,
            },
            ReNewUpdatePassword : {
             equalTo: "#NewUpdatePassword"
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

    $('#uploadForm').submit(function() {
            $(this).ajaxSubmit({

                error: function(xhr) {
                  status('Error: ' + xhr.status);
                },

                success: function(response) {
                 console.log(response);
                 location.reload();
             }
     });
       //return true;
     });

    $.getJSON( '/admin/accounts/api', function( data ) {
         $select_account.html('<option value="0">--- Select Account ---</option>');
         $select_account2.html('<option value="0">--- Select Project ---</option>');

         for (var i = 0; i < data.length; i++) { 
             var account_name = data[i].account_name;
             var account_id = data[i]._id;
             $select_account.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>');   
         }

         $('#changed_account').change(function(){
             if($(this).val() != 0){
                 $('#selectteam').show();
                 var selected = $(this).find('option:selected');
                 var selectedAccount = selected.data('id');
                 $.getJSON('/admin/campaigns/api/account/' + selectedAccount, function(accountTeam){
                      $select_account2.html('<option value="0">--- Select Account ---</option>');
                      for (var i = 0; i < accountTeam.length; i++) { 
                          var team_name = accountTeam[i].team_name;
                          var team_id = accountTeam[i]._id;
                          $select_account2.append('<option value="'+ team_id +'" data-id="'+ team_id +'">'+ team_name +'</option>');  
                      }
                 });
             } else {
                 $('#selectteam').hide();
             }
         });
    });
});