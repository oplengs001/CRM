$(document).ready(function(){

    $.getJSON( '/admin/pmt/api', function( queryResult ) {
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
                        return '<a href="/admin/milestone_tasks/show_tasks/'+ row['_id'] +'" target="_blank">'+ data +'</a>';
                    }
                },
                {
                    "targets" : [1],
                    "width" : "10%"
                },
                {
                    "targets" : [2],
                    "width" : "10%",
                    "render" : function(data,type,row,meta){
                        return '<img class="img-responsive" style="width:41%;border-radius:50%;margin:0 auto" src="'+ data +'" />';
                    }
                },
                {
                    "targets" : [3],
                    "width" : "8%",
                    "render" : function(data, type, row, meta){
                        var date = new Date(row['kick_off']);
                        var month = date.getMonth() + 1;
                        return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
                    }
                },
                {
                    "targets" : [4],
                    "width" : "8%",
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
                    "targets" : [6],
                    "width" : "8%"
                },
                {
                    "targets" : [7],
                    "width" : "12%",
                    "render" : function(data, type, row, meta){
                        if (data == '1') {
                            return 'None'
                        } else if (data == '2') {
                            return 'In-Progress'
                        } else if (data == '3') {
                            return 'Changes Required For Manager'
                        } else if (data == '4') {
                            return 'Approval'
                        } else if (data == '5') {
                            return 'Completed'
                        }
                    }
                },
                {
                    "targets" : [8],
                    "render" : function(data, type, row, meta){
                       return  '<div class="btn-group">' +
                                    '<button type="button" id="taskbtndel" class="btn btn-danger btn-xs" data-id="'+ row['_id'] +'"><i class="fa fa-trash-o"></i></button>' +
                                    '<a href="#updateTaskModal" data-toggle="modal" data-id="'+ row['_id'] +'" class="btn btn-primary btn-xs" id="updateTaskBtn">' +
                                        '<i class="fa fa-pencil-square-o"></i>'
                                    '</a>' +
                                '</div>'
                    }
                },

            ],
        columns: 
            [
                {
                    "data" : "subject",
                    "title" : "Task"
                },
                {
                    "data" : "account.account_name",
                    "title" : "Account"
                },
                {
                    "data" : "assigned.path",
                    "title" : "Assigned to"
                },
                {
                    "data" : "kick_off",
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
                    "title" : "Milestone",
                    "data" : "milestone.milestone_name"
                },
                {
                    "title" : "Status",
                    "data" : "status"
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


    var $taskAccount = $('#taskAccount');
    var $assignedUser = $('#assigned');
    var $projectAssigned = $('#PMTProject');
    var $milestoneAssigned = $('#milestoneTask');

    $taskAccount.html('<option value>--- Select Account ---</option>');
    $assignedUser.html('<option value>--- Select User ---</option>');
    $projectAssigned.html('<option value>--- Select Project ---</option>');
    $milestoneAssigned.html('<option value>--- Select Milestone ---</option>');
    
    $.getJSON('/admin/accounts/api', function(accountData){
        for(var i = 0; i < accountData.length; i ++){
            var account_name = accountData[i].account_name;
            var account_id = accountData[i]._id;
            $taskAccount.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>'); 
        }
        $taskAccount.change(function(){
            var selectedAccount = $(this).find('option:selected');
            var selectedAccountID = selectedAccount.data('id');
            $.getJSON('/admin/user/merge/account/api/' + selectedAccountID, function(accountDatausers){
                $assignedUser.html('<option value="0">--- Select User ---</option>');
                for(var i = 0; i < accountDatausers.length; i++){
                    var user_id = accountDatausers[i]._id;
                    var user_name = accountDatausers[i].fullname;
                    $assignedUser.append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ user_name +'</option>'); 
                }

            });
            $.getJSON('/admin/project/api/' + selectedAccountID, function(projectData){
                $projectAssigned.html('<option value="0">--- Select Project ---</option>');
                for(var i = 0; i < projectData.length; i++){
                    var project_id = projectData[i]._id;
                    var project_name = projectData[i].project_name;
                    $projectAssigned.append('<option value="'+ project_id +'" data-id="'+ project_id +'">'+ project_name +'</option>'); 
                }
            });
        });
        $projectAssigned.change(function(){
            var selectedProject = $(this).find('option:selected');
            var selectedProjectID = selectedProject.data('id');
            $milestoneAssigned.html('<option value="0">--- Select Milestone ---</option>');
            $.getJSON('/admin/milestone/merge/project/api/' + selectedProjectID, function(milestoneData){
                for(var i = 0; i < milestoneData.length; i++){
                    var milestone_id = milestoneData[i]._id;
                    var milestone_name = milestoneData[i].milestone_name;
                    $milestoneAssigned.append('<option value="'+ milestone_id +'" data-id="'+ milestone_id +'">'+ milestone_name +'</option>'); 
                }
            });
        });
    });

    $('#sample_1').on('click','#updateTaskBtn', function(){
        var task_id = $(this).data('id');
        $.getJSON('/admin/pmt/api/' + task_id, function(taskData){
            console.log(taskData);
            for( var key in taskData ){
                var task_id = taskData[key]._id;
                var created_by_id = taskData[key].created_by._id;
                var subject = taskData[key].subject;
                var account_id = taskData[key].account._id;
                var account_name = taskData[key].account.account_name;
                var kick_off = taskData[key].kick_off;
                var due_date = taskData[key].due_date;
                var project_name = taskData[key].project.project_name;
                var project_id = taskData[key].project._id;
                var milestone_name = taskData[key].milestone.milestone_name;
                var milestone_id = taskData[key].milestone._id;
                var priority = taskData[key].priority;
                var status = taskData[key].status;
                var assigned = taskData[key].assigned._id;
                var comments = taskData[key].comments;

                var date = new Date(kick_off);
                var month = date.getMonth() + 1;
                var newKickOff =  month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear();

                var date2 = new Date(due_date);
                var month2 = date2.getMonth() + 1;
                var newdueDate =  month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear();

                var $UpdateAssignedUser = $('#updtePMTassigned');
                $UpdateAssignedUser.html('<option value>--- Select User ---</option>');
                $.getJSON('/admin/user/merge/account/api/' + account_id, function(UpdateUser){
                    for(var i = 0; i < UpdateUser.length; i++){
                        var user_id = UpdateUser[i]._id;
                        var user_name = UpdateUser[i].fullname;
                        $UpdateAssignedUser.append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ user_name +'</option>'); 
                        $('#updtePMTassigned').val(assigned);
                    }
                });

                $('#pmt_id').val(task_id);
                $('#created_by_id').val(created_by_id);
                $('#UpdatesubjectTask').val(subject);
                $('#UpdatetaskAccount').val(account_name);
                $('#UpdatetaskAccountID').val(account_id);
                $('#updatekickoff').val(newKickOff);
                $('#updatedueDateTask').val(newdueDate);
                $('#updateProjectTask').val(project_name);
                $('#updateProjectTaskID').val(project_id);
                $('#UpdatemilestoneTask').val(milestone_name);
                $('#UpdatemilestoneTaskID').val(milestone_id);
                $('#updatePMTpriority').val(priority);
                $('#updatePMTstatus').val(status);
                $('#UpdatecommentsTask').val(comments);
            }
        });
    });

    $('#add_PMT').click(function(){
        if ( !$('#addTaskForm').valid() ) {
           return false;
        } else {
            addTaskFunc()
        }
    });

    var form1 = $('#addTaskForm');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);

    $('#addTaskForm').validate({
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
            taskAccount: {
                required: true
            },
            kick_off : {
                required: true
            },
            dueDateTask: {
                required: true
            },
            PMTProject : {
                required : true
            },
            status : {
               required: true
            },
            assigned : {
               required : true
            },
            commentsTask : {
               required : true
            },
            milestoneTask : {
                required : true
            },
            priority : {
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

    function addTaskFunc(){
        var data = {};
        data.created_by = $('#createdbyPMT').val();
        data.milestone = $('#milestoneTask').val();
        data.project = $('#PMTProject').val();
        data.subject = $('#subjectTask').val();
        data.status = $('#status').val();
        data.priority = $('#priority').val();
        data.kick_off = $('#kick_off').val();
        data.due_date = $('#dueDateTask').val();
        data.comments = $('#commentsTask').val();
        data.assigned = $('#assigned').val();
        data.account = $('#taskAccount').val();
        $.ajax({
            url: '/admin/add_pmt',
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


    var form2 = $('#updateTaskForm');
    var error2 = $('.alert-danger', form2);
    var success2 = $('.alert-success', form2);

    $('#update_PMT').click(function(){
        if ( !$('#updateTaskForm').valid() ) {
           return false;
        } else {
            updatePMTFunc()
        }
    });

    $('#updateTaskForm').validate({
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
            UpdatesubjectTask: {
                required: true
            },
            updatekickoff: {
                required: true
            },
            updatedueDateTask : {
                required: true
            },
            updatePMTpriority: {
                required: true
            },
            updatePMTstatus : {
                required : true
            },
            updtePMTassigned : {
               required: true
            },
            UpdatecommentsTask : {
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

    function updatePMTFunc(){
        var data = {};
        data.assigned = $('#updtePMTassigned').val();
        data.milestone = $('#UpdatemilestoneTaskID').val();
        data.pmtID = $('#pmt_id').val();
        data.subject = $('#UpdatesubjectTask').val();
        data.account = $('#UpdatetaskAccountID').val();
        data.kick_off = $('#updatekickoff').val();
        data.due_date = $('#updatedueDateTask').val();
        data.project = $('#updateProjectTaskID').val();
        data.milestone = $('#UpdatemilestoneTaskID').val();
        data.priority = $('#updatePMTpriority').val();
        data.status = $('#updatePMTstatus').val();
        data.comments = $('#UpdatecommentsTask').val();
        console.log(data);
        $.ajax({
            url: '/admin/edit_pmt',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                ProjectCompleted(response.project);
            },
            error:function(response){
                console.log(response);
            }
        });
    }

    $('#sample_1').on('click','#taskbtndel', function(){
        var pmt_id = $(this).attr('data-id');
        $.ajax({
            url: '/admin/delete_pmt/' + pmt_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
               location.reload();
            }
        });
    });

    function ProjectCompleted(project_id){
        $.getJSON('/admin/project/taskcompleted/api/'+ project_id, function(countTaskCompled){
            var countCompleted = countTaskCompled.length;
            $.getJSON('/admin/milestone/project/pmt/api/' + project_id, function(countTotalTask){
                var countTask = countTotalTask.length;
                var totalPercent = countCompleted / countTask * 100;
                $('#percent_complete').text(totalPercent + '%');
                var data = {};
                data.percent_complete = totalPercent;
                data.project_id = project_id
                $.ajax({
                    url: '/admin/projects/edit_project_completed',
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success:function(response){
                        location.reload();
                    },
                    error:function(response){
                        //console.log(response);
                    }
                });
            });
        });
    }
});