$(document).on('ready', function(event) {


    $('.date-picker').datepicker({
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true
    });

    $(".ionSlider").ionRangeSlider({
        min: 0,
        max: 100
    });

    var pathArray = window.location.pathname.split( '/' );
    var project_id = pathArray[3];

    // find milestone by project ID

    $.getJSON('/admin/milestone/merge/project/api/' + project_id, function(projectData){
        $('#milestoneTask').append('<option value>-Select Milestone-</option>');
        $('#updatemilestoneTask').append('<option value="0">-Select Milestone-</option>');
        for (var i = 0; i < projectData.length; i++) { 
            var milestone_name = projectData[i].milestone_name;
            var milestone_id = projectData[i]._id;
            $('#milestoneTask').append('<option value="'+ milestone_id +'" data-id="'+ milestone_id +'">'+ milestone_name +'</option>'); 
        }

        for(var i = 0 ; i < projectData.length; i++){
            var milestone_name = projectData[i].milestone_name;
            var milestone_id = projectData[i]._id;
            $('#updatemilestoneTask').append('<option value="'+ milestone_id +'" data-id="'+ milestone_id +'">'+ milestone_name +'</option>'); 
        }

        var htmlText = '';
        for(var key in projectData){

            var date = new Date(projectData[key].dateCreated);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            dt = date.getDate();
            hour = date.getHours();
            min = date.getMinutes();
            sec = date.getSeconds();
            if (dt < 10) {
              dt = '0' + dt;
            }
            if (month < 10) {
              month = '0' + month;
            }

            htmlText += '<tr>';
            htmlText += '<td class="highlight">';
            htmlText += '<a href="javascript:;" >'+ projectData[key].milestone_name +' </a>';
            htmlText += '</td>';
            htmlText += '<td>'+ month + '/' + dt + '/' + year +'</td>';
            htmlText += '<td>'+projectData[key].account.account_name+' </td>';
            htmlText += '<td>';
            htmlText += '<a href="javascript:;" class="btn btn-outline btn-circle btn-sm purple">';
            htmlText += '<i class="fa fa-edit"></i> Edit </a>';
            htmlText += '<button id="UserBtnDel" data-id="'+ projectData[key]._id +'" class="btn btn-outline btn-circle btn-sm red">';
            htmlText += '<i class="fa fa-trash"></i> Delete </button>';
            htmlText += '</td>';
            htmlText += '</tr>';
        }
        $('#MilestoneList').append(htmlText);


    });
    $.getJSON('/admin/projects/api/show_milestone/' + project_id, function(query){
        console.log(query);
        for (var key in query) {
            var milestone_id = query[key]._id;
            $.getJSON('/admin/projects/api/miilestonetasks/tasks/' + milestone_id, function(queryTasks){
                console.log(queryTasks);
            });
        }
    })

    // $.getJSON('/admin/projects/api/show_milestone/' + project_id, function(query){
    //     var htmlData = ''
    //     for(var key in query) {
    //         var milestone_id = query[key]._id;
    //        htmlData += '<li>';
    //        htmlData += '<a href="/admin/milestones/task/'+ milestone_id +'" target="_blank">';
    //        //htmlData += '<span class="badge badge-info">'+ countMilestoneTasks(milestone_id) +'</span>';
    //        htmlData += query[key].milestone_name;
    //        htmlData += ' </a>';
    //        htmlData += '<li>';
    //     }
    //     $('#listMilestoneData').append(htmlData);
    // });

    // function countMilestoneTasks(milestone_id){
    //     $.getJSON('/admin/projects/api/miilestonetasks/tasks/' + milestone_id, function(queryTasks){
    //         var datacount;
    //         datacount = queryTasks.length;
    //         console.log(datacount)
    //         return datacount;
    //     });
    // }
                

    $.getJSON( '/admin/project/merge/api/' + project_id, function( queryResult ) {

        var account_id = queryResult.account._id;
        var account_name = queryResult.account.account_name;
        var project_name = queryResult.project_name;
        var project_status = queryResult.status;
        var project_created = queryResult.created.fullname;
        var project_created_id = queryResult.created._id;
        var project_description = queryResult.description;
        var total_hours_budget = queryResult.total_hours_budget;
        var total_hours_incurred = queryResult.total_hours_incurred;
        var percent_complete = queryResult.percent_complete;
        var total_hours_budget = queryResult.total_hours_budget;
        var kickoff = queryResult.kickoff;
        var deadline = queryResult.deadline;
        var newPercentComplete = Math.trunc(percent_complete);

        var $assigned = $('#assigned');

        //append

        $('#UpdateAccount').val(account_name);
        $('#UpdateAccountID').val(account_id);
        $('#updateProjectName').val(queryResult.project_name);
        $('#updateStatus').val(queryResult.status);
        $('#UpdateProjectDesc').val(queryResult.description);
        $('#UpdateOwner').val(project_created);
        $('#UpdateOwnerID').val(project_created_id);
        $('#UpdateTotal_hours_budget').val(total_hours_budget);
        $('#UpdateProjectkickoff').val(kickoff);
        $('#UpdateProjectDeadline').val(deadline);

        $('#update_project_info').click(function(){
            var data = {};

            data.project_name = $('#updateProjectName').val();
            data.status = $('#updateStatus').val();
            data.account = $('#UpdateAccountID').val();
            data.description = $('#UpdateProjectDesc').val();
            data.project_id = project_id;
            data.created = $("#UpdateOwnerID").val();
            data.total_hours_budget = $('#UpdateTotal_hours_budget').val();
            data.kickoff = $('#UpdateProjectkickoff').val();
            data.deadline = $('#UpdateProjectDeadline').val();
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

        });

        $.getJSON('/admin/user/merge/account/api/' + account_id, function(usersdataInAccount){
            var htmlText = '';
            for(var key in usersdataInAccount){

                htmlText += '<tr>';
                htmlText += '<td class="highlight">';
                htmlText += '<a href="/admin/user_profile/'+usersdataInAccount[key]._id+'" target="_blank"  >'+ usersdataInAccount[key].fullname +' </a>';
                htmlText += '</td>';
                htmlText += '<td>'+ usersdataInAccount[key].position +'</td>';
                htmlText += '<td>'+usersdataInAccount[key].team.team_name+' </td>';
                htmlText += '<td>';
                htmlText += '<a href="/admin/users/show_user/'+usersdataInAccount[key]._id+'" target="_blank" class="btn btn-outline btn-circle btn-sm purple">';
                htmlText += '<i class="fa fa-edit"></i> Edit </a>';
                htmlText += '<button id="UserBtnDel" data-id="'+ usersdataInAccount[key]._id +'" class="btn btn-outline btn-circle btn-sm red">';
                htmlText += '<i class="fa fa-trash"></i> Delete </button>';
                htmlText += '</td>';
                htmlText += '</tr>';
            }
            $('#userList').append(htmlText);
        });

        $.getJSON('/admin/user/merge/account/api/' + account_id, function(UserData){
             $assigned.append('<option value>--Select User--</option>');
             $('#updateassigned').append('<option value="0">--Select User--</option>');
             for (var i = 0; i < UserData.length; i++) { 
                 var fullname = UserData[i].fullname;
                 var user_id = UserData[i]._id;
                 $assigned.append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ fullname +'</option>'); 
                 $('#updateassigned').append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ fullname +'</option>');    
             }
        });
        
        $('.appendAccountName').append(queryResult.project_name);
        $('#MilestoneAccountNameID').val(account_id);
        $('#MilestoneAccountName').val(account_name);
        $('#ProjectName').val(project_name);
        $('#ProjectNameID').val(project_id);
        $('#taskAccount').val(account_name);
        $('#taskAccountID').val(account_id);

        //details
        $("#project_name").append(project_name);
        $('#project_status').append(project_status);
        $('#prject_account').append(account_name);
        $('#project_owner').append(project_created);
        $('#project_description').append(project_description);
        $('#total_hours_budget').append(total_hours_budget);
        $('#total_hours_incurred').append(total_hours_incurred);
        $('#percent_complete').text(percent_complete + '%');

        $('#MilestoneCompleted input[name=MilestoneCompleted]').on('change',function(){
            var MilestoneCompleted = $('input[name=MilestoneCompleted]:checked', '#MilestoneCompleted').val(); 
        });

        $('#CreateMilestoneBtn').click(function(){
            var data = {};
            data.milestone_name = $('#milestone_name').val();
            data.due_date = $('#due_date').val();
            data.account = $('#MilestoneAccountNameID').val();
            data.project = $('#ProjectNameID').val();
            data.created_by = $('#MilestoneCreatedbyID').val();
            data.milestondec = $('#milestondec').val();
            data.kick_start = $('#kick_start').val()
            data.MilestoneCompleted = $('input[name=MilestoneCompleted]:checked', '#MilestoneCompleted').val();
            $.ajax({
                url: '/admin/milestones/add_milestone',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success:function(response){
                    console.log(response);
                    //location.reload();
                },
                error:function(response){
                    console.log(response);
                }
            });
        });

    });

   $.getJSON( '/user/api', function( data ) {
        $('#current_user_id').val(data._id);
        $('#MilestoneCreatedbyID').val(data._id);
        $('#created_by_id').val(data._id);
        $.getJSON( '/admin/accounts/api', function( accountData ) {
            $select_account = $('#addAccount');
            $select_user = $('#addassigned');
             $select_account.html('<option value="0">--- Select Account ---</option>');

             for (var i = 0; i < accountData.length; i++) { 
                 var account_name = accountData[i].account_name;
                 var account_id = accountData[i]._id;
                 $select_account.append('<option value="'+ account_id +'" data-id="'+ account_id +'">'+ account_name +'</option>'); 
             }

             $('#addAccount').change(function(){
                if ( $(this).val() != 0 ) {
                    $('.assignedUser').show();
                    var selected = $(this).find('option:selected');
                    var selectedAccount = selected.data('id');
                    $.getJSON('/admin/user/merge/account/api/' + selectedAccount, function(dataAccountUsers){
                        $select_user.html('<option value="0">--- Select User ---</option>');
                        for(var i = 0; i < dataAccountUsers.length; i++){
                            var user_id = dataAccountUsers[i]._id;
                            var user_name = dataAccountUsers[i].fullname;
                            $select_user.append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ user_name +'</option>'); 
                        }


                    });
                } else {
                    $('.assignedUser').hide();
                }
             });

             $('#milestoneData').on('click', '#AddTask', function(){
                var milestone_id = $(this).attr('data-id');
                $('#milestone_id').val(milestone_id);
             });

             $('#commentsTask').keyup(function(){
                var keyed = $(this).val().replace(/\n/g,'<br />');
             });
                            
             $('#editTaskBtn').click(function(){
                 var datas = {};
                 datas.subject = $("#UpdatesubjectTask").val();
                 datas.kick_off = $('#Updatekick_off').val();
                 datas.due_date = $('#UpdatedueDateTask').val();
                 datas.comments = $('#updatecommentsTask').val();
                 datas.account = $('#UpdatetaskAccountID').val();
                 datas.priority = $('#updatepriority').val();
                 datas.status = $('#updatestatus').val();
                 datas.assigned = $('#updateassigned').val();
                 datas.milestone = $('#updatemilestoneTask').val();
                 datas.completed = $('#updateCompletedFoo').val();
                 datas.project = project_id;
                 // datas.assign = $('#UpdateCreatedID').val();
                 datas.pmtID = $('#updatePMTID').val();
                 console.log(datas);
                 $.ajax({
                     url: '/admin/edit_pmt',
                     method: 'PUT',
                     contentType: 'application/json',
                     data: JSON.stringify(datas),
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

   });

   $.getJSON('/admin/milestone/project/pmt/api/' + project_id, function(taskDataItem){
        var htmlText = '';
        for(var key in taskDataItem){

            var date = new Date(taskDataItem[key].due_date);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            dt = date.getDate();
            hour = date.getHours();
            min = date.getMinutes();
            sec = date.getSeconds();
            if (dt < 10) {
              dt = '0' + dt;
            }
            if (month < 10) {
              month = '0' + month;
            }

            var date2 = new Date(taskDataItem[key].kick_off);
            year2 = date2.getFullYear();
            month2 = date2.getMonth() + 1;
            dt2 = date2.getDate();
            hour2 = date2.getHours();
            min2 = date2.getMinutes();
            sec2 = date2.getSeconds();
            if (dt2 < 10) {
              dt2 = '0' + dt2;
            }
            if (month2 < 10) {
              month2 = '0' + month2;
            }


            htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-green">';
            htmlText += '<img class="todo-userpic pull-left" src="'+ taskDataItem[key].created_by.path +'" width="27px" height="27px">';
            htmlText += '<div class="todo-tasklist-item-title">';
            htmlText += taskDataItem[key].created_by.fullname;
            htmlText += '<a href="#taskmodal" data-toggle="modal" class="btn btn-default btn-xs dropdown-toggle pull-right" data-id="'+taskDataItem[key]._id+'" id="MilestonetaskBtn" >Edit</a>';
            htmlText += '</div>';
            htmlText += '<div class=""><strong>'+ taskDataItem[key].subject +'</strong></div>';
            htmlText += '<div class="todo-tasklist-item-text" style="white-space: pre;">'+ taskDataItem[key].comments +'</div>';
            htmlText += '<div class="todo-tasklist-item-text"><strong>Assigned to: </strong>'+ taskDataItem[key].assigned.fullname +'</div>';
            htmlText += '<div class="todo-tasklist-item-text"><strong>Milestone: </strong>'+ taskDataItem[key].milestone.milestone_name +'</div>';
            htmlText += '<div class="todo-tasklist-controls pull-left">';
            htmlText += '<span class="todo-tasklist-date">';
            htmlText += '<i class="fa fa-calendar"></i>'+ month2 + ' ' + dt2 + ' ' + year2 + ' to ';
            htmlText += '<i class="fa fa-calendar"></i>'+ month + ' ' + dt + ' ' + year + '</span><br/>';

            if ( taskDataItem[key].priority == 'High' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-warning">'+taskDataItem[key].priority+'</span>&nbsp;';
            } else if ( taskDataItem[key].priority == 'Normal' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success">'+taskDataItem[key].priority+'</span>&nbsp;';
            } else if (taskDataItem[key].priority == 'Urgent') {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-danger">'+taskDataItem[key].priority+'</span>&nbsp;';
            } else if (taskDataItem[key].priority == 'Medium') {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-info">'+taskDataItem[key].priority+'</span>&nbsp;';
            }
            if ( taskDataItem[key].status == 'Open' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-warning">'+ taskDataItem[key].status +'</span>&nbsp;';
            } else if ( taskDataItem[key].status == 'Completed' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-info">'+ taskDataItem[key].status +'</span>&nbsp;';
            } else if ( taskDataItem[key].status === '1' ) { 
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-warning">None</span>&nbsp;';
            } else if ( taskDataItem[key].status === '2' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success">In-Progress</span>&nbsp;';
            } else if ( taskDataItem[key].status === '3' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-warning">Changes Required For Manager</span>&nbsp;';
            } else if ( taskDataItem[key].status === '4' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-primary">Approval</span>&nbsp;';
            } else if ( taskDataItem[key].status === '5' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success">Completed</span>&nbsp;';
            }
            htmlText += '</div>';
            htmlText += '</div>';
            htmlText += '</div>';
        }
        $('#taskFeedItem').append(htmlText);


        var htmlData = '';
        for(var key in taskDataItem){

            var date = new Date(taskDataItem[key].due_date);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            dt = date.getDate();
            hour = date.getHours();
            min = date.getMinutes();
            sec = date.getSeconds();
            if (dt < 10) {
              dt = '0' + dt;
            }
            if (month < 10) {
              month = '0' + month;
            }

           htmlData += '<tr>';
           htmlData += '<td class="highlight">';
           htmlData += '<a href="javascript:;" >'+ taskDataItem[key].subject +' </a>';
           htmlData += '</td>';
           htmlData += '<td>'+ month + '/' + dt + '/' + year +'</td>';
           htmlData += '<td>'+taskDataItem[key].priority+' </td>';
           htmlData += '<td>'+taskDataItem[key].status+' </td>';
           htmlData += '<td>'+taskDataItem[key].milestone.milestone_name+' </td>';
           htmlData += '<td>';
           htmlData += '<a href="javascript:;" class="btn btn-outline btn-circle btn-sm purple">';
           htmlData += '<i class="fa fa-edit"></i> Edit </a>';
           htmlData += '<button id="UserBtnDel" data-id="'+ taskDataItem[key]._id +'" class="btn btn-outline btn-circle btn-sm red">';
           htmlData += '<i class="fa fa-trash"></i> Delete </button>';
           htmlData += '</td>';
           htmlData += '</tr>';
        }

        $('.TaskMilestoneList').append(htmlData);


        $('#taskFeedItem').on('click','#MilestonetaskBtn', function(){
            var task_id = $(this).attr('data-id');
            $('#updatePMTID').val(task_id);
            $.getJSON('/admin/pmt/api/' + task_id, function(taskDataQuery){
                for(var key in taskDataQuery){
                    $('#UpdateCreatedID').val(taskDataQuery[key].assigned._id);
                    $('#UpdatesubjectTask').val(taskDataQuery[key].subject);
                    $('#UpdatedueDateTask').val(taskDataQuery[key].due_date);
                    $('#updatemilestoneTask').val(taskDataQuery[key].milestone._id);
                    $('#updatecommentsTask').val(taskDataQuery[key].comments);
                    $('#updatetaskAccount').val(taskDataQuery[key].account.account_name);
                    $('#UpdatetaskAccountID').val(taskDataQuery[key].account._id);
                    $('#updatepriority').val(taskDataQuery[key].priority);
                    $('#updatestatus').val(taskDataQuery[key].status);
                    $('#updateassigned').val(taskDataQuery[key].assigned._id);
                    $('#Updatekick_off').val(taskDataQuery[key].kick_off);
                    $('#updateCompletedFoo').val(taskDataQuery[key].completed);
                    $('#updateCompleted').on('change', function(){
                        var completedPercentage =  $(this).val();
                        $('#updateCompletedFoo').val(completedPercentage);
                    });
                    // $("#updateCompleted").ionRangeSlider({
                    //     from: taskDataQuery[key].completed
                    // });
                }

            });
        });

   });

    $.getJSON('/admin/milestone/project/pmt/api/' + project_id, function(pmTasksData){
        if ( pmTasksData.length == 0  ) {
            $('#chart_div').append('No task for this project');
        } else {
            google.charts.load('current', {'packages':['gantt']});
            google.charts.setOnLoadCallback(drawChart);
        }
    });

    function drawChart() {

        $.ajax({
            url: '/admin/milestone/project/pmt/api/' + project_id,
            dataType: 'json',
            success: function (jsonData) {
                var data = new google.visualization.DataTable();
                  data.addColumn('string', 'Task ID');
                  data.addColumn('string', 'Task Name');
                  data.addColumn('string', 'Resource');
                  data.addColumn('date', 'Start Date');
                  data.addColumn('date', 'End Date');
                  data.addColumn('number', 'Duration');
                  data.addColumn('number', 'Percent Complete');
                  data.addColumn('string', 'Dependencies');

                for(var i = 0; i < jsonData.length; i++) {

                data.addRows([
                        [jsonData[i]._id, jsonData[i].subject, jsonData[i].status,
                         new Date(jsonData[i].kick_off), new Date(jsonData[i].due_date), null, jsonData[i].completed, null]
                     ]);
                }

                var options = {
                  height: 400,
                  gantt: {
                    trackHeight: 30
                  }
                };

                var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

                var formatter = new google.visualization.ColorFormat();
                formatter.addRange(-20000, 0, 'white', 'orange');
                formatter.addRange(20000, null, 'red', '#33ff33');
                formatter.format(data, 1); // Apply formatter to second column

                chart.draw(data, options);
            }

        });
    }

    $('#projectbtndel').click(function(){
        $.ajax({
            url: '/admin/delete_project/' + project_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
               window.location.href = '/admin/projects';
            }
        });
    });
});


//add task
$(function(){

    var form1 = $('#addProjectTask');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);

    var pathArray = window.location.pathname.split( '/' );
    var project_id = pathArray[3];

    $('#taskBtn').click(function(){
        if ( !$('#addProjectTask').valid() ) {
           return false;
        } else {
           AddTaskFunc();
        }
    });

    $('#addProjectTask').validate({
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
            assigned: {
                required: true
            },
            kick_off: {
                required: true
            },
            dueDateTask : {
               required: true
            },
            milestoneTask : {
               required : true
            },
            priority : {
               required : true
            },
            status : {
                required : true
            },
            commentsTask : {
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

    function AddTaskFunc(){
         var datas = {};
         datas.subject = $("#subjectTask").val();
         datas.due_date = $('#dueDateTask').val();
         datas.comments = $('#commentsTask').val();
         datas.account = $('#taskAccountID').val();
         datas.priority = $('#priority').val();
         datas.status = $('#status').val();
         datas.assigned = $('#assigned').val();
         datas.project = project_id;
         datas.created_by = $('.current_user_id').val();
         datas.milestone = $('#milestoneTask').val();
         datas.taskBtn = $('#taskBtn').val();

         console.log(datas);
        // $.ajax({
        //     url: '/admin/add_pmt',
        //     method: 'POST',
        //     contentType: 'application/json',
        //     data: JSON.stringify(datas),
        //     success:function(response){
        //         console.log(response);
        //         console.log('success');
        //         location.reload();
        //     },
        //     error:function(response){
        //         console.log(response);
        //     }
        // });
    }
});