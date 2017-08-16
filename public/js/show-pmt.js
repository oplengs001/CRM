$(document).ready(function(){
    var pathArray = window.location.pathname.split( '/' );
    var task_id = pathArray[4];

    $('.date-picker').datepicker({
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true
    });


    $.getJSON('/admin/pmt/api/'+ task_id, function(dataPMT){
        console.log(dataPMT);
        for(var key in dataPMT){
            var milestone_id = dataPMT[key].milestone._id
            var milestone_name = dataPMT[key].milestone.milestone_name;
            var project_id = dataPMT[key].project._id;
            var completed_percentage = dataPMT[key].completed;
            var project_name = dataPMT[key].project.project_name;
            var task_title = dataPMT[key].subject;
            var assigned_id = dataPMT[key].assigned._id;
            var assigned = dataPMT[key].assigned.fullname;
            var related_email = dataPMT[key].assigned.email;
            var related_position = dataPMT[key].assigned.position;
            var related_mobileNumber = dataPMT[key].assigned.mobileNumber;
            var created_by_id = dataPMT[key].created_by._id;
            var owner = dataPMT[key].created_by.fullname;
            var kick_off = dataPMT[key].kick_off;
            var due_date = dataPMT[key].due_date;
            var task_priority = dataPMT[key].priority
            var task_status = dataPMT[key].status
            var task_comment = dataPMT[key].comments;
            var milestone_account_id = dataPMT[key].account._id;
            var milestone_account_name = dataPMT[key].account.account_name;
            var milestone_account_owner = dataPMT[key].account.account_owner;
            var milestone_account_type = dataPMT[key].account.account_type;
            var milestone_account_description = dataPMT[key].account.description;
            var milestone_account_industry = dataPMT[key].account.industry;
            var milestone_account_phone_number = dataPMT[key].account.phone_number;
            var milestone_account_website_url = dataPMT[key].account.website_url;

            var date = new Date(kick_off);
            var month = date.getMonth() + 1;
            var newKickOffDate = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear();

            var date2 = new Date(due_date);
            var month2 = date2.getMonth() + 1;
            var newDeadline = month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear();

            //inserting value in form to update
            $('#pmt_id').val(task_id);
            $('#created_by_id').val(created_by_id);
            $('#UpdatesubjectTask').val(task_title);
            $('#updatekickoff').val(kick_off);
            $('#updatedueDateTask').val(due_date);
            $('#UpdatemilestoneTask').val(milestone_name);
            $('#UpdatemilestoneTaskID').val(milestone_id);
            $('#milestone_id').val(milestone_id);
            $('#UpdatetaskAccount').val(milestone_account_name);
            $('#UpdatetaskAccountID').val(milestone_account_id);
            $('#updateProjectTask').val(project_name);
            $('#updateProjectTaskID').val(project_id);
            $('#pmtIDForm').val(task_id);
            $('#updatePMTpriority').val(task_priority);
            $('#updatePMTstatus').val(task_status);
            $('#UpdatecommentsTask').val(task_comment);


            $('.appendAccountName').text(task_title);
            //append details
            $('#task_name').text(task_title);
            $('#task_assigned').text(assigned);
            $('#task_owner').text(owner);
            $('#task_kick_off').text(newKickOffDate);
            $('#task_due_date').text(newDeadline);
            $('#task_priority').text(task_priority);
            if (task_status  == 5 ) {   
                $('#task_status').text('Completed');
            } else if ( task_status  == 4 ) {
                $('#task_status').text('Approval');
            } else if (task_status == 3) {
                $('#task_status').text('Changes Required For Manager');
            } else if ( task_status == 2 ) {
                $('#task_status').text('In-Progress');
            } else if ( task_status == 1 ) {
                $('#task_status').text('None');
            }
            $('#task_comment').text(task_comment);

            //append related

            $('#milestone_account_name').text(milestone_account_name);
            $('#milestone_account_owner').text(milestone_account_owner);
            $('#milestone_account_type').text(milestone_account_type);
            $('#milestone_account_description').text(milestone_account_description);
            $('#milestone_account_industry').text(milestone_account_industry);
            $('#milestone_account_phone_number').text(milestone_account_phone_number);
            $('#milestone_account_website_url').text(milestone_account_website_url)

            $('#related_fullname').text(assigned);
            $('#related_email').text(related_email);
            $('#related_position').text(related_position);
            $('#related_mobileNumber').text(related_mobileNumber);

            //log a call
            $('#TaskLAC').val(task_title);
            $('#TaskIDLAC').val(task_id);
        }

        $.getJSON('/admin/user/merge/account/api/' + milestone_account_id, function(accountDatausers){
            $('#updtePMTassigned').append('<option value="0">--- Select User ---</option>');
            for(var i = 0; i < accountDatausers.length; i++){
                var user_id = accountDatausers[i]._id;
                var user_name = accountDatausers[i].fullname;
                $('#updtePMTassigned').append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ user_name +'</option>'); 
            }

            $('#updtePMTassigned').val(assigned_id);
        });

        $.getJSON('/admin/project/merge/api/' + project_id, function(dataProject){
            var project_pName = dataProject.project_name;
            var project_pAccount = dataProject.account.account_name;
            var project_pCreated = dataProject.dateCreated;
            var project_pDesc = dataProject.description;
            //append projects
            $('#project_pName').text(project_pName);
            $('#project_pAccount').text(project_pAccount);
            $('#project_pCreated').text(project_pCreated);
            $('#project_pDesc').text(project_pDesc);
        });

        $.getJSON('/admin/milestone/merge/data/api/' + milestone_id, function(dataMilestone){
            var m_milestonename = dataMilestone.milestone_name;
            var m_account = dataMilestone.account.account_name;
            var m_project = dataMilestone.project.project_name;
            var m_owner = dataMilestone.created_by.fullname;
            var m_completed = dataMilestone.MilestoneCompleted;
            var m_kick_start = dataMilestone.kick_start;
            var m_due_date = dataMilestone.due_date;
            var m_milestondec = dataMilestone.milestondec;

            $('#m_milestonename').text(m_milestonename);
            $('#m_account').text(m_account);
            $('#m_project').text(m_project);
            $('#m_owner').text(m_owner);
            $('#m_completed').text(m_completed);
            $('#m_kick_start').text(m_kick_start);
            $('#m_due_date').text(m_due_date);
            $('#m_milestondec').text(m_milestondec);
        });

    });
    
    $.getJSON('/admin/pmt/api', function(dataPMTList){
        var htmlData = '';
        for(var data in dataPMTList){
            htmlData += '<li>';
            htmlData += '<a href="/admin/milestone_tasks/show_tasks/'+ dataPMTList[data]._id +'" target="_blank">';
            // htmlData += '<span class="badge badge-info"> 6 </span>';
            htmlData += dataPMTList[data].subject;
            htmlData += '</a>';
            htmlData += '</li>';
        }
        $('#taskList').append(htmlData);
    });

    $.getJSON('/admin/milestone_tasks/api/get_task_log/' + task_id, function(queryTaskLog){
        var htmlText = '';
        for (var key in queryTaskLog) {
            var date = new Date(queryTaskLog[key].date_created);
            var month = date.getMonth() + 1;
            var dt = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            if (dt < 10) {
              dt = '0' + dt;
            }
            var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear() + ' ' + hour + ':' + min;

          var date = new Date(queryTaskLog[key].date_created);
         var month = date.getMonth() + 1;
         var dt = date.getDate();
         var hour = date.getHours();
         var min = date.getMinutes();
         var sec = date.getSeconds();
         if (dt < 10) {
           dt = '0' + dt;
         }
         var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear() + ' ' + hour + ':' + min;

         var date1 = new Date(queryTaskLog[key].timeIn);
         var month1 = date1.getMonth() + 1;
         var dt1 = date1.getDate();
         var hour1 = date1.getHours();
         var min1 = date1.getMinutes();
         var sec1 = date1.getSeconds();
         if (dt < 10) {
           dt = '0' + dt;
         }
         var newTimeIn = month1.length > 1 ? month1 : "0" + month1 + "/" + date1.getDate() + "/" + date1.getFullYear() + ' ' + hour1 + ':' + min1;


         var date2 = new Date(queryTaskLog[key].timeOut);
         var month2 = date2.getMonth() + 1;
         var dt2 = date2.getDate();
         var hour2 = date2.getHours();
         var min2 = date2.getMinutes();
         var sec2 = date2.getSeconds();
         if (dt < 10) {
           dt2 = '0' + dt2;
         }
         var newTimeOut = month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear() + ' ' + hour2 + ':' + min2;

            if ( queryTaskLog[key].timeOut == null ) {
                htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-green">';
            } else {
                htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-red">';
            }
            htmlText += '<img class="todo-userpic pull-left" src="'+ queryTaskLog[key].created_by.path +'" width="27px" height="27px">';
            htmlText += '<div class="todo-tasklist-item-title">';
            htmlText += queryTaskLog[key].created_by.fullname;
            htmlText += '<span class="pull-right" style="font-size: 11px">';
            htmlText += newDateCreated;
            htmlText += '</span>';
            htmlText += '</div>';
            htmlText += '<strong>';
            htmlText += queryTaskLog[key].subject;
            htmlText += '</strong>';
            htmlText += '<div class="todo-tasklist-item-text" style="white-space:pre">'+ queryTaskLog[key].comment +'</div>';
            // htmlText += '<div class="todo-tasklist-controls pull-left">';
            // htmlText += '<span class="todo-comment-date" style="margin-left:10px;">start Date</span>';
            // htmlText += '</div>';
            htmlText += '<div class="todo-tasklist-controls">';
            htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success">Work Start : '+ newTimeIn + '</span>&nbsp;';
            if ( queryTaskLog[key].timeOut == null) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success" style="display:none">Work Start : '+ newTimeOut + '</span>&nbsp;';
            } else {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-danger">End Work : '+ newTimeOut + '</span>&nbsp;';
            }
            htmlText += '</div>'
            htmlText += '</div>';
        }
        $('#taskFeedItem').append(htmlText);
    });

    $('#updateTaskPMTBtn').click(function(){
        var data = {};
        data.assigned = $('#updtePMTassigned').val();
        data.milestone = $('#UpdatemilestoneTaskID').val();
        data.subject = $('#UpdatesubjectTask').val();
        data.pmtID = $('#pmt_id').val(); // store ID
        data.due_date = $('#updatedueDateTask').val();
        data.kick_off = $('#updatekickoff').val();
        data.comments = $('#UpdatecommentsTask').val();
        data.account = $('#UpdatetaskAccountID').val();
        data.priority = $('#updatePMTpriority').val();
        data.status = $('#updatePMTstatus').val();
        data.project = $('#updateProjectTaskID').val();
        data.created_by = $('#created_by_id').val();
        $.ajax({
            url: '/admin/edit_pmt',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                ProjectCompleted(response.project);
            },
            error:function(response){
                console.log('err');
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

    $.getJSON('/user/api', function(currentData){
        console.log(currentData);
        $('#current_user_id').val(currentData._id);
        $('#photoUser').attr('src',currentData.path);
        $('#userNameTodo').text(currentData.fullname);

        $('#sharePost').click(function(){
            var data = {};
            data.post = $('#postField').val();
            data.created_by = $('#current_user_id').val();
            data.pmt = $('#pmtIDForm').val();
            data.milestone = $('#milestone_id').val();
            console.log(data);
            $.ajax({
                url: '/admin/add_pmtpost',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success:function(response){
                    console.log(response);
                    appendPMTPost();
                },
                error:function(response){
                    console.log(response);
                }
            });
        });

        function appendPMTPost(){
            $('#postField').val(' ');
            $.getJSON('/admin/pmt_post/task/merge/api/' + task_id, function(dataPmt){
                console.log(dataPmt);
                var htmlText = '';
                for(var key in dataPmt){
                    var date = new Date(dataPmt[key].dateCreated);
                    var month = date.getMonth() + 1;
                    var dt = date.getDate();
                    var hour = date.getHours();
                    var min = date.getMinutes();
                    var sec = date.getSeconds();
                    if (dt < 10) {
                      dt = '0' + dt;
                    }
                    var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear() + ' ' + hour + ':' + min;

                    htmlText += '<li class="in">';
                    htmlText += '<img class="avatar" alt="" src="'+ dataPmt[key].created_by.path +'" />';
                    htmlText += '<div class="message">';
                    htmlText += '<span class="arrow"> </span>';
                    htmlText += '<a href="javascript:;" class="name"> '+ dataPmt[key].created_by.fullname +' </a>';
                    htmlText += '<span class="datetime"> at '+ newDateCreated +' </span>';
                    htmlText += '<span class="body">';
                    htmlText += dataPmt[key].post;
                    htmlText += '</span>';
                    htmlText += '</div>';
                    htmlText += '</li>';
                }
                $('#postPMTAppend').html(htmlText);
            });
        }

        $.getJSON('/admin/pmt_post/task/merge/api/' + task_id, function(dataPmt){
            console.log(dataPmt);
            var htmlText = '';
            for(var key in dataPmt){
                var date = new Date(dataPmt[key].dateCreated);
                var month = date.getMonth() + 1;
                var dt = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();
                if (dt < 10) {
                  dt = '0' + dt;
                }
                var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear() + ' ' + hour + ':' + min;
                htmlText += '<li class="in">';
                htmlText += '<img class="avatar" alt="" src="'+ dataPmt[key].created_by.path +'" />';
                htmlText += '<div class="message">';
                htmlText += '<span class="arrow"> </span>';
                htmlText += '<a href="javascript:;" class="name"> '+ dataPmt[key].created_by.fullname +' </a>';
                htmlText += '<span class="datetime"> at '+ newDateCreated +' </span>';
                htmlText += '<span class="body">';
                htmlText += dataPmt[key].post;
                htmlText += '</span>';
                htmlText += '</div>';
                htmlText += '</li>';
            }
                $('#postPMTAppend').html(htmlText);
        });



        $('#locBtn').click(function(){
            var data = {};
            data.subject = $('#subjectLAC').val();
            data.comments = $('#CommentsLAC').val();
            data.task = $('#TaskIDLAC').val();
            data.created_by = currentData._id;
            $.ajax({
                url: '/admin/pmt_loc',
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
        });
    });

    $.getJSON('/admin/pmt_log_a_call/merge/api/' + task_id, function(locacallData){
        console.log(locacallData);
        var htmlText = '';
        for(var key in locacallData) {
            var date = new Date(locacallData[key].date_created);
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

            htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-green">';
            htmlText += '<img class="todo-userpic pull-left" src="'+ locacallData[key].created_by.path +'" width="27px" height="27px">';
            htmlText += '<div class="todo-tasklist-item-title">';
            htmlText += locacallData[key].created_by.fullname;
            htmlText += '<span class="pull-right">';
            htmlText += '<a href="#code" data-toggle="modal" class="btn btn-default btn-xs dropdown-toggle" data-id="'+locacallData[key]._id+'" id="logBtn" >Edit</a>';
            htmlText += '</span>';
            htmlText += '</div>';
            htmlText += '<strong>';
            htmlText += locacallData[key].subject;
            htmlText += '</strong>';
            htmlText += '<div class="todo-tasklist-item-text" style="white-space:pre">'+ locacallData[key].comments +'</div>';
            htmlText += '<div class="todo-tasklist-controls pull-left">';
            htmlText += '<span class="todo-comment-date" style="margin-left:10px;">'+ month + '/' + dt + '/' + year + ' ' + hour + ':' + min +'</span>';
            htmlText += '</div>';
            htmlText += '<div class="todo-tasklist-controls pull-right">';
            if ( locacallData[key].priority == 'None' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-info pull-right">'+locacallData[key].priority+'</span>&nbsp;';
            } else if ( locacallData[key].priority == 'High' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-danger pull-right">'+locacallData[key].priority+'</span>&nbsp;';
            } else if ( locacallData[key].priority == 'Normal' ) {
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success pull-right">'+locacallData[key].priority+'</span>&nbsp;';
            }
            htmlText += '</div>'
            htmlText += '</div>';
        }
        $('#logacallitems').append(htmlText);
    });

    $('#logacallitems').on('click','#logBtn', function(){
        var loc_id = $(this).attr('data-id');
        $('#logacallId').val(loc_id);
        $.getJSON('/admin/pmt_log_call/api/' + loc_id, function(pmtlogacalldata){
            console.log(pmtlogacalldata);
            $('#updatesubjectLAC').val(pmtlogacalldata.subject);
            $('#updateCommentsLAC').val(pmtlogacalldata.comments);
            $('#updateprioritylog').val(pmtlogacalldata.priority);
            $('#updateTaskLAC').val(pmtlogacalldata.task.subject);
            $('#updateTaskLACID').val(pmtlogacalldata.task._id);
            $('#updateCreatedBy').val(pmtlogacalldata.created_by._id);
        });
    });

    $('#editLogCall').click(function(){
        var data = {};
        data.subject = $('#updatesubjectLAC').val();
        data.comments = $('#updateCommentsLAC').val();
        data.priority = $('#updateprioritylog').val();
        data.created_by = $('#updateCreatedBy').val();
        data.task = $('#updateTaskLACID').val();
        data.pmtlog_id = $('#logacallId').val();
        console.log(data);
        $.ajax({
            url: '/admin/edit_pmtlogacall',
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

    $('#delLogacall').click(function(){
        var loc_id = $('#logacallId').val();
        $.ajax({
            url: '/admin/pmtloc_delete/' + loc_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
               location.reload();
            }
        });
    });

    $.getJSON('/admin/milestone_tasks/api/get_time/' + task_id, function(query){
        if ( jQuery.isEmptyObject(query) ) {
            // $('#clockInPut').css('display','block')
            $('#clockInPost').css('display','block');;
        } else {
            $('#clockInPut').css('display','block');
        }
    });

    $('#clockInPost').click(function(){
        $('#clockOut').css('display','block');
        $('#clockInPost').css('display','none');
        var data = {};
        data.tasks = task_id;
        $.ajax({
            url: '/admin/milestone_tasks/add_time',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
               console.log(response);
            }
        })
    });

    $('#clockInPut').click(function(){
        $('#clockInPut').css('display','none');
        $('#clockOut').css('display','block');
        var data = {};
        data.tasks = task_id;
        $.ajax({
            url: '/admin/milestone_tasks/update_timeIn',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
                console.log(response)
               // getTimeTotal(response);
            }
        })
    })

    $('#clockOut').click(function(){
        $('#clockInPut').css('display','block');
        $('#clockOut').css('display','none');
        var data = {};
        data.tasks = task_id;
        $.ajax({
            url: '/admin/milestone_tasks/update_time',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
               getTimeTotal(response);
            }
        })
    });

    function getTimeTotal(responseData){

        var dateTimeIn = new Date(responseData.timeIn);
        var timeInHour = dateTimeIn.getHours();
        var timeInMins = dateTimeIn.getMinutes();

        var dateTimeOut = new Date(responseData.timeOut);
        var timeOutHour = dateTimeOut.getHours();
        var timeOutMins = dateTimeOut.getMinutes();

        var newMins = timeOutMins - timeInMins;
        var totalHours = timeOutHour - timeInHour;

        var total_hours = (newMins / 60) + totalHours;
        var total_time = parseFloat(responseData.total_time) + parseFloat(total_hours);
        var data = {};
        data.total_time = total_time.toFixed(2);
        data.tasks = responseData.tasks;
        $.ajax({
            url: '/admin/milestone_tasks/update_total_time',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
               getTotalTimeOccured(response);
               getTimeOutFunc(response);
            }
        });
    }

    function getTotalTimeOccured(DataResponse){
        $.getJSON('/admin/pmt/api/'+ task_id, function(dataPMT) {
            for(var key in dataPMT){
                var project_id = dataPMT[key].project._id;
                $.getJSON('/admin/project/merge/api/' + project_id, function(projectData){
                    var total_time = DataResponse.total_time; //total time

                    total_hours_budget = projectData.total_hours_budget;

                    //Get Timein
                    var dateTimeIn = new Date(DataResponse.timeIn);
                    hoursTimeIn = dateTimeIn.getHours();
                    MinsTimeIn = dateTimeIn.getMinutes();

                    //Get TimeOut
                    var dateTimeOut = new Date(DataResponse.timeOut);
                    hoursTimeOut = dateTimeOut.getHours();
                    MinsTimeOut = dateTimeOut.getMinutes();

                    //get how many hours
                    var totalHours = hoursTimeOut - hoursTimeIn;
                    //get how many minutes
                    var totalMins = MinsTimeOut - MinsTimeIn;
                    //convert mins to hours
                    var convertHours = totalMins / 60;

                    var totalHoursThis = parseFloat(totalHours) + parseFloat(convertHours);

                    //this is the total hours budget remaining
                    var totalHoursBudget = parseFloat(total_hours_budget) - parseFloat(totalHoursThis);
                    var totalHoursIncurred = parseFloat(total_time) + parseFloat(totalHoursThis);

                    goEditTotalBudget(totalHoursBudget.toFixed(2), totalHoursIncurred.toFixed(2), project_id);  
                })
            }
        });
    }
    function goEditTotalBudget(totalHoursBudget, totalHoursIncurred, id){
        var data = {};
        data.project_id = id;
        data.total_hours_budget = totalHoursBudget;
        data.total_hours_incurred = totalHoursIncurred;
        $.ajax({
            url: '/admin/projects/update_total_hours_budget',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
               console.log(response);
            }
        })
    }
    function getTimeOutFunc(response){
        var data = {};
        data.subject = 'Stop Work';
        data.comment = 'Stop Working';
        data.created_by = $('.currentUserId').val();
        console.log(response.timeOut);
        data.timeIn = response.timeIn;
        data.timeOut = response.timeOut
        data.tasks = task_id;
        $.ajax({
            url: '/admin/milestone_tasks/add_taskLog',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
               appendTaskLog(response);
            }
        })
    }

    function appendTaskLog(response){
        var htmlText = '';
        $.getJSON('/admin/milestone_tasks/api/get_task_log/' + task_id, function(queryTaskLog){
            for (var key in queryTaskLog) {

                var date = new Date(queryTaskLog[key].date_created);
                var month = date.getMonth() + 1;
                var dt = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();
                if (dt < 10) {
                  dt = '0' + dt;
                }
                var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear() + ' ' + hour + ':' + min;

                var date1 = new Date(queryTaskLog[key].timeIn);
                var month1 = date1.getMonth() + 1;
                var dt1 = date1.getDate();
                var hour1 = date1.getHours();
                var min1 = date1.getMinutes();
                var sec1 = date1.getSeconds();
                if (dt < 10) {
                  dt = '0' + dt;
                }
                var newTimeIn = month1.length > 1 ? month1 : "0" + month1 + "/" + date1.getDate() + "/" + date1.getFullYear() + ' ' + hour1 + ':' + min1;


                var date2 = new Date(queryTaskLog[key].timeOut);
                var month2 = date2.getMonth() + 1;
                var dt2 = date2.getDate();
                var hour2 = date2.getHours();
                var min2 = date2.getMinutes();
                var sec2 = date2.getSeconds();
                if (dt < 10) {
                  dt2 = '0' + dt2;
                }
                var newTimeOut = month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear() + ' ' + hour2 + ':' + min2;

                if ( queryTaskLog[key].timeOut == null ) {
                    htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-green">';
                } else {
                    htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-red">';
                }
                htmlText += '<img class="todo-userpic pull-left" src="'+ queryTaskLog[key].created_by.path +'" width="27px" height="27px">';
                htmlText += '<div class="todo-tasklist-item-title">';
                htmlText += queryTaskLog[key].created_by.fullname;
                htmlText += '<span class="pull-right" style="font-size: 11px">';
                htmlText += newDateCreated;
                htmlText += '</span>';
                htmlText += '</div>';
                htmlText += '<strong>';
                htmlText += queryTaskLog[key].subject;
                htmlText += '</strong>';
                htmlText += '<div class="todo-tasklist-item-text" style="white-space:pre">'+ queryTaskLog[key].comment +'</div>';
                // htmlText += '<div class="todo-tasklist-controls pull-left">';
                // htmlText += '<span class="todo-comment-date" style="margin-left:10px;">start Date</span>';
                // htmlText += '</div>';
                htmlText += '<div class="todo-tasklist-controls">';
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success">Work Start : '+ newTimeIn + '</span>&nbsp;';
                if ( queryTaskLog[key].timeOut == null) {
                    htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success" style="display:none">Work Start : '+ newTimeOut + '</span>&nbsp;';
                } else {
                    htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-danger">End Work : '+ newTimeOut + '</span>&nbsp;';
                }
                htmlText += '</div>'
                htmlText += '</div>';
            }
            $('#taskFeedItem').html(htmlText);
        });
    }
});

$(function(){
    var pathArray = window.location.pathname.split( '/' );
    var task_id = pathArray[4];

    $('#addTaskLog').click(function(){
        $.getJSON('/admin/milestone_tasks/api/get_time/' + task_id, function(query){
            var data = {};
            data.subject = $('#taskLogSubject').val();
            data.comment = $('#taskLogComment').val();
            data.created_by = $('.currentUserId').val();
            data.timeIn = query.timeIn;
            //data.timeOut = query.timeOut;
            data.tasks = task_id;
            $.ajax({
                url: '/admin/milestone_tasks/add_taskLog',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(response){
                   console.log(response);
                   $('.closeModal').click();
                   appendTaskLog(response);
                }
            })
        });
    });

    function appendTaskLog(response){
        var htmlText = '';
        $.getJSON('/admin/milestone_tasks/api/get_task_log/' + task_id, function(queryTaskLog){
            for (var key in queryTaskLog) {

                var date = new Date(queryTaskLog[key].date_created);
                var month = date.getMonth() + 1;
                var dt = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();
                var sec = date.getSeconds();
                if (dt < 10) {
                  dt = '0' + dt;
                }
                var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear() + ' ' + hour + ':' + min;

                var date1 = new Date(queryTaskLog[key].timeIn);
                var month1 = date1.getMonth() + 1;
                var dt1 = date1.getDate();
                var hour1 = date1.getHours();
                var min1 = date1.getMinutes();
                var sec1 = date1.getSeconds();
                if (dt < 10) {
                  dt = '0' + dt;
                }
                var newTimeIn = month1.length > 1 ? month1 : "0" + month1 + "/" + date1.getDate() + "/" + date1.getFullYear() + ' ' + hour1 + ':' + min1;


                var date2 = new Date(queryTaskLog[key].timeOut);
                var month2 = date2.getMonth() + 1;
                var dt2 = date2.getDate();
                var hour2 = date2.getHours();
                var min2 = date2.getMinutes();
                var sec2 = date2.getSeconds();
                if (dt < 10) {
                  dt2 = '0' + dt2;
                }
                var newTimeOut = month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear() + ' ' + hour2 + ':' + min2;

                if ( queryTaskLog[key].timeOut == null ) {
                    htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-green">';
                } else {
                    htmlText += '<div class="todo-tasklist-item todo-tasklist-item-border-red">';
                }
                htmlText += '<img class="todo-userpic pull-left" src="'+ queryTaskLog[key].created_by.path +'" width="27px" height="27px">';
                htmlText += '<div class="todo-tasklist-item-title">';
                htmlText += queryTaskLog[key].created_by.fullname;
                htmlText += '<span class="pull-right" style="font-size: 11px">';
                htmlText += newDateCreated;
                htmlText += '</span>';
                htmlText += '</div>';
                htmlText += '<strong>';
                htmlText += queryTaskLog[key].subject;
                htmlText += '</strong>';
                htmlText += '<div class="todo-tasklist-item-text" style="white-space:pre">'+ queryTaskLog[key].comment +'</div>';
                // htmlText += '<div class="todo-tasklist-controls pull-left">';
                // htmlText += '<span class="todo-comment-date" style="margin-left:10px;">start Date</span>';
                // htmlText += '</div>';
                htmlText += '<div class="todo-tasklist-controls">';
                htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success">Work Start : '+ newTimeIn + '</span>&nbsp;';
                if ( queryTaskLog[key].timeOut == null) {
                    htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-success" style="display:none">Work Start : '+ newTimeOut + '</span>&nbsp;';
                } else {
                    htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-danger">End Work : '+ newTimeOut + '</span>&nbsp;';
                }
                htmlText += '</div>'
                htmlText += '</div>';
            }
            $('#taskFeedItem').html(htmlText);
        });
    }
})