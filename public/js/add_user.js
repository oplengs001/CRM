
var $select_account = $('#UserAccount');
var  $select_account2 = $('#userAccountTeam');
//for forms
var form1 = $('#addUserForm');
var error1 = $('.alert-danger', form1);
var success1 = $('.alert-success', form1);



$.getJSON( '/admin/accounts/api', function( data ) {
     $select_account.html('<option value="0">--- Select Account ---</option>');
     for (var i = 0; i < data.length; i++) { 
         var account_name = data[i].account_name;
         var account_id = data[i]._id;
         $select_account.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>');   
     }
     $('#UserAccount').change(function(){
         if($(this).val() != 0){
             $('#selectuserteam').show();
             var selected = $(this).find('option:selected');
             var selectedAccount = selected.data('id');
             $.getJSON('/admin/campaigns/api/account/' + selectedAccount, function(accountTeam){
                  $select_account2.html('<option value="'+ null +'">--- Select Team ---</option>');
                  for (var i = 0; i < accountTeam.length; i++) { 
                      var team_name = accountTeam[i].team_name;
                      var team_id = accountTeam[i]._id;
                      $select_account2.append('<option value="'+ team_id +'" data-id="'+ team_id +'">'+ team_name +'</option>');  
                  }
             });
         } else {
             $('#selectuserteam').hide();
             console.log('false');
         }
         
     });
});

$('#addUserbtn').click(function(){

  if ( !$('#addUserForm').valid() ) {
     return false;
  } else {
     ajaxAddUser();
  }
});

function ajaxAddUser(){
  var data = {};

  data.fullname = $('#fullname').val();
  data.email = $('#email').val();
  data.position = $('#position').val();
  data.address = $('#address').val();
  data.city = $('#city').val();
  data.country = $('#country').val();
  data.username = $('#username').val();
  data.password = $('#register_password').val();
  data.rpassword = $('#rpassword').val();
  data.account = $('#UserAccount').val();
  data.team = $('#userAccountTeam').val();
  data.role = $('#role').val();
  console.log(data);

  $('#status').empty().text('Adding User');

  $.ajax({
      url: '/admin/users/add_user',
      method : 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success:function(data){
          console.log('success');
          //window.location.href = '/admin/accounts/show_members/' + account_id + '/' + team_id + '/' + member_id
          $('#status').empty().text('Added User').show();
          $('#addUserForm').trigger("reset");
      },
      error:function(data){
          console.log('error');
          $('#status').empty().text('Error on adding User');
      }
  });
}

$('#addUserForm').validate({
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
        fullname : {
          minlength:6,
          required : true
        },
        email:{
          email: true,
          required : true
        },
        username: {
            minlength: 4,
            required: true
        },
        password: {
            required: true,
            minlength: 8
        },
       rpassword: {
           equalTo: "#register_password"
       },
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