$(document).on('ready', function(event) {
    $.getJSON( '/admin/accounts/api', function( queryResult ) {

      var table = $('#sample_1').DataTable( {
        responsive: true,
        autoWidth: false,
        data: queryResult,
        columnDefs: 
            [
                {
                    "targets" : [ 0 ],
                    "render" : function(data, type, row, meta) {
                        return '<a href="/admin/accounts/show_accounts/'+ row['_id'] +'">'+ data +'</a>';
                    }
                },
                {
                    "targets" : [3],
                    "render" : function(data, type, row, meta){
                       return  '<div class="btn-group">' +
                                    '<button type="button" id="deletebtn" class="btn btn-danger" data-id="'+ row['_id'] +'">Delete</button>' +
                                        '<button type="button" data-target="#editAccountModal" data-toggle="modal" id="updateGetId" data-id="'+row['_id']+'" class="btn btn-primary">Update</button>' +
                                '</div>'
                    }
                }
            ],
        columns: 
            [
                {
                    "title" : "Account Name",
                    "data" : "account_name"
                },
                {
                    "title" : "Phone Number",
                    "data" : "phone_number"
                },
                {
                    "title" : "Account Owner",
                    "data" : "account_owner.fullname"
                },
                {
                    "title" : "Action"
                }
            ]
          } );
    });
});

$(function(){

    // $('#UpdateAccount').click(function(){
    //     var data = {};
    //     data.account_name = $('#UpdateAccountname').val();
    //     data.account_id = $('#UpdateAccountId').val();
    //     // data.account_owner = $('#UpdateAccountOwnerId').val();
    //     data.account_owner = '{{userid}}';
    //     data.account_type = $('#UpdateAccountType').val();
    //     data.website_url = $('#UpdateWebsiteUrl').val();
    //     data.phone_number = $('#UpdatePhoneNumber').val();
    //     data.industry = $('#UpdateIndustry').val();
    //     data.number_of_employees = $('#UpdateNumberEmployees').val();
    //     data.address = $('#UpdateeAddress').val();
    //     data.city = $('#UpdateCity').val();
    //     data.country = $('#UpdateCountry').val();
    //     data.description = $('#UpdateDescription').val();
    //     console.log(data);
    //     $.ajax({
    //         url: '/admin/accounts/edit_account',
    //         method : 'PUT',
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

    $('#sample_1').on('click', '#deletebtn', function() {
        var account_id = $(this).attr("data-id");
        $.ajax({
            url: '/admin/accounts/post/' + account_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
                location.reload();
            }
        });
    });

    $('#sample_1').on('click','#updateGetId', function(){
        var account_id = $(this).attr('data-id');
        $.getJSON('/admin/accounts/api/' + account_id, function(query){
            console.log(query);
            //append data 
            $('#UpdateAccountname').val(query.account_name);
            $('#UpdateAccountId').val(query._id);
            $('#UpdateAccountOwner').val(query.account_owner.fullname);
            $('#UpdateAccountOwnerId').val('{{userid}}');
            $('#UpdateAccountType').val(query.account_type);
            $('#UpdateWebsiteUrl').val(query.website_url);
            $('#UpdatePhoneNumber').val(query.phone_number);
            $('#UpdateIndustry').val(query.industry);
            $('#UpdateNumberEmployees').val(query.number_of_employees);
            $('#UpdateeAddress').val(query.address);
            $('#UpdateCity').val(query.city);
            $('#UpdateCountry').val(query.country);
            $('#UpdateDescription').val(query.description);
        });
    });

    //add - validate form

    var form1 = $('#addAccountForm');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);

    $('#addAccount').click(function(){
       
       if ( !$('#addAccountForm').valid() ) {
          return false;
       } else {
          addAccountFunc();
       }

    });

    $('#addAccountForm').validate({
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
            accountname: {
                required: true
            },
            account_owner: {
                required: true
            },
            account_type : {
                required: true
            },
            website_url : {
                required: true
            },
            phone_number : {
                required : true
            },
            industry : {
                required: true
            },
            number_of_employees : {
                required : true
            },
            address : {
                required : true
            },
            city : {
                required : true
            },
            country : {
                required : true
            },
            description : {
                required: true
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

    function addAccountFunc(){
        var data = {};
        data.account_name = $('#accountname').val();
        data.account_type = $('#account_type').val();
        data.website_url = $('#website_url').val();
        data.description = $('#description').val();
        data.account_owner = $('#accountOwnerId').val();
        data.phone_number = $('#phone_number').val();
        data.industry = $('#industry').val();
        data.address = $('#address').val();
        data.city = $('#city').val();
        data.country = $('#country').val();
        data.number_of_employees = $('#number_of_employees').val();
        $.ajax({
            url: '/admin/accounts/add_new',
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

    //update - validate form

    var form2 = $('#updateAccountForm');
    var error2 = $('.alert-danger', form2);
    var success2 = $('.alert-success', form2);

    $('#UpdateAccount').click(function(){
       
       if ( !$('#updateAccountForm').valid() ) {
          return false;
       } else {
          // addAccountFunc();
          alert('true')
       }
    });

    $('#updateAccountForm').validate({
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
            UpdateAccountOwner: {
                required: true
            },
            UpdateAccountType : {
                required: true
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
                required: true
            }

        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success2.hide();
            error2.show();
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

})