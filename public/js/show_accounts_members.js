 $(document).ready(function(){

    var pathArray = window.location.pathname.split( '/' );
    var account_id = pathArray[4];
    var team_id = pathArray[5];
    var member_id = pathArray[6];


    var $select_account = $('#changed_account');
    var $select_account2 = $('#changed_team');

    var form1 = $('#profileInfo');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);

    $.getJSON( '/admin/accounts/api', function( data ) {
         $select_account.html('<option value="'+ null +'">--- Select Account ---</option>');

         for (var i = 0; i < data.length; i++) { 
             var account_name = data[i].account_name;
             var account_id = data[i]._id;
             $select_account.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>');   
         }

         $('#changed_account').change(function(){
             if($(this).val() != null){
                 $('#selectteam').show();
                 var selected = $(this).find('option:selected');
                 var selectedAccount = selected.data('id');
                 $.getJSON('/admin/accounts/show_accounts/team/api/' + selectedAccount, function(accountTeam){
                      $select_account2.html('<option value="'+ null +'">--- Select Account ---</option>');
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

    $.getJSON('/admin/accounts/show_team/api/merge/' + member_id, function(queryResults){
        for (var i = 0; i < queryResults.length; i++) { 
            var account_name = queryResults[i].account.account_name;
            var team_name = queryResults[i].team.team_name;
            var dateStarted = queryResults[i].dateStarted;
            $('.memberaccount').append(account_name);
            $('.memberteam').append(team_name);
            $('.memberdateStarted').append(dateStarted);
        }

        $('#changedRoles').click(function(){
             $('#successRoles').empty().text('Updating Accounts').show().fadeOut(5000);
             var changed_roles = $('#changed_roles').val();
             var NewAccountId = $('#changed_account').val();
             var NewTeamId = $('#changed_team').val();
             var userId = $('#user_id').val();
             
             var data = {};
             data.role = changed_roles;
             data.team = NewTeamId;
             data.account = NewAccountId;
             data.user_id = userId;
             console.log(data);

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
    });

   

   $.getJSON('/admin/accounts/show_user/member/api/' + member_id, function(memberdataUsers){
        for (var i = 0; i < memberdataUsers.length; i++){

            var fullName = memberdataUsers[i].fullname;
            var email = memberdataUsers[i].email;
            var position = memberdataUsers[i].position;
            var address = memberdataUsers[i].address;
            var city = memberdataUsers[i].city;
            var country = memberdataUsers[i].country;
            var about = memberdataUsers[i].about;
            var userId = memberdataUsers[i]._id;
            var roles = memberdataUsers[i].role;
            var path = memberdataUsers[i].path;
            var avatar = memberdataUsers[i].has_avatar;
            if (avatar == 1) {
                $('.profile-userpic img').attr('src', '../../../../../' + path);
            } else {
                $('.profile-userpic img').attr('src', '../../../../../User-placeholder.png');
            }
            $('.userrole').append(roles).css('text-transform','uppercase');


            //append data in form

           $('#UpdateFullName').val(fullName);
           $('#UpdateEmail').val(email);
           $('#UpdatePosition').val(position);
           $('#UpdateAddress').val(address);
           $('#UpdateCity').val(city);
           $('#UpdateCountry').val(country);
           $('#UpdateAbout').val(about);
           $('#user_id').val(userId);
           $('#id_user').val(userId);

            $('#updateUserAccount').click(function(){
               
               if ( !$('#profileInfo').valid() ) {
                  return false;
               } else {
                  ajaxupdateuserAccount();
               }

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
              data.user_id = $('#user_id').val();

              $('#status').empty().text('updating');

              $.ajax({
                  url: '/admin/accounts/update_user',
                  method : 'PUT',
                  contentType: 'application/json',
                  data: JSON.stringify(data),
                  success:function(data){
                      console.log('success');
                      window.location.href = '/admin/accounts/show_members/' + account_id + '/' + team_id + '/' + member_id
                      $('#status').empty();
                  },
                  error:function(data){
                      console.log('error');
                      $('#status').empty().text('error');
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



        }
   });

   $.getJSON('/admin/accounts/show_member/api/member/' + member_id, function(memberdata){
        $('.profile-usertitle-name').append(memberdata.full_name);
        $('.profile-usertitle-job').append(memberdata.position);
        if (memberdata.has_account == true) {
            $('#updateAccount, #personalinfo, #avatar, #changepassword, #UpdateAccount').css('display','block');
            $('#profileForm li:nth-child(1)').addClass('active');
        } else {
            $('#createAccount').css('display','block');
            $('#tab_1_1').removeClass('active');
            $('#tab_1_5').addClass('active');
            $('#profileForm li:nth-child(5)').addClass('active');
        }
   });

   $.getJSON( '/user/api', function( data ) {
       
       $('.username.username-hide-on-mobile').append(data.fullname);
        // $select_account.html('<option>--- Select Account ---</option>');

        // for (var i = 0; i < data.length; i++) { 
        //     var account_name = data[i].account_name;
        //     $select_account.append('<option value="'+ account_name +'">'+ account_name +'</option>');   
        // }
   });

   $('#addUserAccount').click(function(){
       if ( !$('#createAccountForm').valid() ) {
          return false;
       } else {
          AddAccountUser();
       }
   });

   $('#createAccountForm').validate({
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
           username: {
               minlength: 6,
               required: true
           },
           password: {
               required: true,
               email: true
           },
           password: {
               minlength: 6,
               required: true
           },
           repassword: {
               equalTo: "#password"
           },
           fullname : {
              minlength: 6,
              required: true
           },
           email : {
              email: true,
              required : true
           },
           position : {
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

   function AddAccountUser(){
    var data = {};
    data.full_name = $('#fullname').val();
    data.email = $('#email').val();
    data.username = $('#username').val();
    data.position = $('#position').val();
    data.password = $('#password').val();
    data.account = account_id;
    data.team = team_id;
    data.member = member_id;

    $.ajax({
        url: '/admin/accounts/add_user',
        method : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success:function(data){
            console.log('success');
            window.location.href = '/admin/accounts/show_members/' + account_id + '/' + team_id + '/' + member_id
        },
        error:function(data){
            console.log('error');
        }
    });
   }

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
      data.current_password = $('#updatePassword').val();
      data.password = $('#NewUpdatePassword').val();
      data.user_id = $('#user_id').val();
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
                console.log('success');
                window.location.href = '/admin/accounts/show_members/' + account_id + '/' + team_id + '/' + member_id
            }
    });
      return true;
    });

});