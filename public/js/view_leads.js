$(document).ready(function(){

    //start datatables data

    $.getJSON( '/admin/leads/api', function( queryResult ) {
        var table = $('#sample_1').DataTable({
        responsive: true,
        autoWidth: false,
        data: queryResult,
        columnDefs :
            [
                {
                    "targets" : [ 0 ],
                    "render" : function(data, type, row, meta) {
                        return '<a href="leads/view/'+ row['_id'] +'" target="_blank">'+ data +'</a>';
                    }
                },
                {
                    "targets" : [5],
                    "render" : function(data,type,row,meta){
                        if ( row['lead_status'] == '1') {
                            return 'Unqualified'
                        } else if ( row['lead_status'] == '2' ) {
                            return 'New'
                        } else if ( row['lead_status'] == '3' ) {
                            return 'Nurturing'
                        } else if ( row['lead_status'] == '4' ) {
                            return 'Qualified'
                        } else if ( row['lead_status'] == '5' ) {
                            return 'Converted'
                        }
                    }
                },
                {
                    "targets" : [7],
                    "render" : function(data, type, row, meta){
                       return  '<div class="btn-group">' +
                                    '<button type="button" id="deletebtn" class="btn btn-danger btn-xs" data-id="'+ row['_id'] +'"><i class="fa fa-trash-o"></i></button>' +
                                    '<button type="button" data-target="#basic" data-toggle="modal" data-id="'+ row['_id'] +'" class="btn btn-primary btn-xs" id="updateBtn">' +
                                        '<i class="fa fa-pencil-square-o"></i>'
                                    '</button>' +
                                '</div>'
                    }
                }
            ],
        columns: 
            [
                {
                    "data" : "fullname",
                    "title" : "Name"
                },
                {
                    "data" : "title",
                    "title" : "Title"
                },
                {
                    "data" : "company",
                    "title" : "Company"
                },
                {
                    "data" : "phone",
                    "title" : "Phone"
                },
                {
                    "data" : "email",
                    "title" : "Email"
                },
                {
                    "title" : "Lead Status",
                    "data" : "lead_status"
                },
                {
                    "title" : "Owner",
                    "data" : "owner.fullname"
                },
                {
                    "title" : "Actions"
                }
            ]
          });
    });

    //end of datatables

});

$(function(){

    //update leads
    $('#sample_1').on('click', '#updateBtn', function(){
        var lead_id = $(this).attr('data-id');
        $.getJSON('/admin/leads/api/' + lead_id, function(leadData){
                var lead_status = leadData.lead_status;
                var lead_owner = leadData.owner.fullname;
                var lead_owner_id = leadData._id;
                var lead_fullname = leadData.fullname;
                var lead_email = leadData.email;
                var lead_website = leadData.website;
                var lead_title = leadData.title;
                var lead_company = leadData.company;
                var lead_source = leadData.lead_source;
                var lead_industry = leadData.industry;
                var lead_phone = leadData.phone;
                var lead_employee = leadData.number_of_employees;
                var lead_address = leadData.address;
                var lead_city = leadData.city;
                var lead_country = leadData.country;
                var lead_id = leadData._id;
                var lead_notes = leadData.notes;

                $('#UpdateLeadStatus').val(lead_status);
                $('#UpdateLeadOwner').val(lead_owner);
                $('#UpdateLeadOwnerID').val(lead_owner_id)
                $('#UpdateLeadFullName').val(lead_fullname);
                $('#UpdateLeadEmail').val(lead_email);
                $('#UpdateLeadWebsite').val(lead_website);
                $('#UpdateLeadTitle').val(lead_title);
                $('#UpdateLeadCompany').val(lead_company);
                $('#UpdateLeadSource').val(lead_source);
                $('#UpdateLeadIndustry').val(lead_industry);
                $('#UpdateLeadPhoneNumber').val(lead_phone);
                $('#UpdateLeadsNumberEmployees').val(lead_employee);
                $('#UpdateLeadAddress').val(lead_address);
                $('#UpdateLeadCity').val(lead_city);
                $('#UpdateLeadCountry').val(lead_country);
                $('#lead_id').val(lead_id);
                $('#UpdateLeadNotes').val(lead_notes);
        });
    });

    //update form

    $('#UpdateLeadSubmit').click(function(){
        var data = {};
        data.lead_id = $('#lead_id').val();
        data.lead_status = $('#UpdateLeadStatus').val();
        data.owner = $('#UpdateLeadOwnerID').val();
        data.fullname = $('#UpdateLeadFullName').val();
        data.email = $('#UpdateLeadEmail').val();
        data.website = $('#UpdateLeadWebsite').val();
        data.title = $('#UpdateLeadTitle').val();
        data.company = $('#UpdateLeadCompany').val();
        data.lead_source = $('#UpdateLeadSource').val();
        data.industry = $('#UpdateLeadIndustry').val();
        data.phone = $('#UpdateLeadPhoneNumber').val();
        data.number_of_employees = $('#UpdateLeadsNumberEmployees').val();
        data.address = $('#UpdateLeadAddress').val();
        data.city = $('#UpdateLeadCity').val();
        data.country = $('#UpdateLeadCountry').val();
        data.notes = $('#UpdateLeadNotes').val();
        console.log(data);
        $.ajax({
            url: '/admin/leads/edit_status',
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
    });

    //delete leads

    $('#sample_1').on('click','#deletebtn', function(){
        var lead_id = $(this).attr('data-id');
        $.ajax({
            url: '/admin/leads/delete_lead/' + lead_id,
            method : 'DELETE',
            contentType: 'application/json',
            success : function(response){
                window.location.href = '/admin/leads';
            }
        });
    });

    $('#convertLeadBTN').click(function(){
        var data = {};
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

        $.ajax({
            url: '/admin/leads/convert_account',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                $('.closeModalBtn').click();
                App.blockUI({
                    target: '.portlet-body',
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


    function contactConvert(AccountId){
        var data = {};
        console.log(AccountId);
        data.contacts_account_name = AccountId;
        data.contacts_fullname = $('#LeadFullName').val();
        data.contacts_email = $('#LeadEmail').val();
        data.contacts_phone = $('#LeadPhoneNumber').val();
        data.contacts_owner = $('#LeadOwnerID').val();
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
                    location.reload();
                }, 3000);
            },
            error:function(response){
                console.log(response);
            }
        });
    }

    var form1 = $('#addLeadsForm');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);


    $('#createLeadBtn').click(function(){
        if ( !$('#addLeadsForm').valid() ) {
          return false
        } else {
          createLeadFunction();
        }
    });

    $('#addLeadsForm').validate({
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
            LeadStatus: {
                required: true
            },
            LeadFullName : {
                required : true
            },
            LeadEmail : {
                required : true
            },
            LeadWebsite : {
                required : true
            },
            LeadTitle : {
                required : true
            },
            LeadCompany : {
                required : true
            },
            LeadSource : {
                required : true
            },
            LeadIndustry : {
                required : true
            },
            LeadPhoneNumber : {
                required : true
            },
            LeadsNumberEmployees : {
                required : true
            },
            LeadAddress : {
                required : true
            },
            LeadCity : {
                required : true
            },
            LeadCountry : {
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


    function createLeadFunction(){
        var data = {};
        data.lead_status = $('#LeadStatus').val();
        data.owner = $('#LeadOwnerID').val();
        data.fullname = $('#LeadFullName').val();
        data.title = $('#LeadTitle').val();
        data.company = $('#LeadCompany').val();
        data.email = $('#LeadEmail').val();
        data.lead_source = $('#LeadSource').val();
        data.address = $('#LeadAddress').val();
        data.city = $('#LeadCity').val();
        data.industry = $('#LeadIndustry').val();
        data.country = $('#LeadCountry').val();
        data.phone = $('#LeadPhoneNumber').val();
        data.website = $('#LeadWebsite').val();
        data.notes = $('#leadsNotes').val();
        data.number_of_employees = $('#LeadsNumberEmployees').val();

        $.ajax({
            url: '/admin/leads/add_lead',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                console.log(response);
                // location.reload();
            },
            error:function(response){
                console.log(response);
            }
        });

        if ( $('#LeadStatus').val() == '5' ) {
            convertLead(data);
        } else {
            location.reload();
        }
    }

    function convertLead(data){
        $('#closeAddLeadModal').click();
        $('#openConertLead').click();


        //account
        var lead_company = data.company,
        lead_source = data.lead_source,
        lead_website = data.website,
        lead_employee = data.number_of_employees,
        lead_industry = data.industry,
        lead_phonenumber = data.phone,
        lead_address = data.address,
        lead_city = data.city
        lead_country = data.country;

        //account data

        $('#convertAccount').val(lead_company);
        $('#ConertAccountLeadSouce').val(lead_source);
        $('#ConvertLeadWebsite').val(lead_website);
        $('#ConvertLeadEmployeeNumber').val(lead_employee);
        $('#ConvertLeadIndustry').val(lead_industry);
        $('#ConvertLeadPhoneNumber').val(lead_phonenumber);
        $('#ConvertLeadAddress').val(lead_address);
        $('#ConvertLeadCity').val(lead_city);
        $('#ConvertLeadCountry').val(lead_country);

    }
});