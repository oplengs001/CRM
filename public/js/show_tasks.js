$(document).ready(function(){

    var pathArray = window.location.pathname.split( '/' );
    var milestone_id = pathArray[4];

    $("#updateCompleted").ionRangeSlider({
        min: 0,
        max: 100,
        from: 0
    });

    $('.date-picker').datepicker({  
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true
    });


    var currentRating = $('#example-fontawesome-o').data('current-rating');

    $('.stars-example-fontawesome-o .current-rating')
        .find('span')
        .html(currentRating);

    $('.stars-example-fontawesome-o .clear-rating').on('click', function(event) {
        event.preventDefault();

        $('#example-fontawesome-o')
            .barrating('clear');
    });

    $('#MilestoneDelBtn').click(function(){
        $.ajax({
            url: '/admin/delete_milestone/' + milestone_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response){
               window.location.href  = '/admin/projects';
            }
        });
    });

    var currentRating = $('#example-fontawesome-o').data('current-rating');

    $('.stars-example-fontawesome-o .current-rating')
        .find('span')
        .html(currentRating);

    $('.stars-example-fontawesome-o .clear-rating').on('click', function(event) {
        event.preventDefault();

        $('#example-fontawesome-o')
            .barrating('clear');
    });

    $('#example-fontawesome-o').barrating({
        theme: 'fontawesome-stars-o',
        showSelectedRating: false,
        initialRating: currentRating,
        onSelect: function(value, text) {
            if (!value) {
                $('#example-fontawesome-o')
                    .barrating('clear');
            } else {
                $('.stars-example-fontawesome-o .current-rating')
                    .addClass('hidden');

                $('.stars-example-fontawesome-o .your-rating')
                    .removeClass('hidden')
                    .find('span')
                    .html(value);
            }
        },
        onClear: function(value, text) {
            $('.stars-example-fontawesome-o')
                .find('.current-rating')
                .removeClass('hidden')
                .end()
                .find('.your-rating')
                .addClass('hidden');
        }
    });


    $.getJSON( '/user/api', function( dataInfoUser ){
        $('#createdbyPMT').val(dataInfoUser._id);
    });

    $.getJSON('/admin/milestone/merge/data/api/' + milestone_id, function(milestoneData){
        var account_id = milestoneData.account._id;
        var account_name = milestoneData.account.account_name;
        var account_owner = milestoneData.account.account_owner;
        var account_type = milestoneData.account.account_type;
        var account_description = milestoneData.account.description;
        var account_industry = milestoneData.account.industry;
        var account_phone_number = milestoneData.account.phone_number;
        var account_website_url = milestoneData.account.website_url;


        $.getJSON('/admin/user/merge/account/api/' + account_id, function(accountDatausers){
            $('#assigned').append('<option value>--- Select User ---</option>');
            for(var i = 0; i < accountDatausers.length; i++){
                var user_id = accountDatausers[i]._id;
                var user_name = accountDatausers[i].fullname;
                $('#assigned').append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ user_name +'</option>'); 
            }

            var htmlText = '';
            for( var key in accountDatausers ){
                htmlText += '<tr>';
                htmlText += '<td class="highlight">';
                htmlText += '<a href="/admin/user_profile/'+accountDatausers[key]._id+'" target="_blank"  >'+ accountDatausers[key].fullname +' </a>';
                htmlText += '</td>';
                htmlText += '<td>'+ accountDatausers[key].position +'</td>';
                htmlText += '<td>'+accountDatausers[key].team.team_name+' </td>';
                htmlText += '</tr>';
            }
            $('#UserDataList').append(htmlText);
        });

        var project_id = milestoneData.project._id;
        var project_name = milestoneData.project.project_name;
        var status = milestoneData.project.status;
        var project_date_created = milestoneData.project.dateCreated;
        var project_due_date = milestoneData.project.deadline;
        var milestone_name = milestoneData.milestone_name;
        var date_created = milestoneData.dateCreated;
        var due_date = milestoneData.due_date;
        var MilestoneAccountName = milestoneData.account.account_name;
        var UpdateMilestoneAccountNameID = milestoneData.account._id;
        var UpdateProjectName = milestoneData.project.project_name;
        var UpdateProjectNameID = milestoneData.project._id;
        var Updatemilestondec = milestoneData.milestondec;
        var UpdateKickStartDate = milestoneData.kick_start;
        var milestoneOwner = milestoneData.created_by.fullname;
        var milestoneComplete = milestoneData.MilestoneCompleted;

        var date = new Date(UpdateKickStartDate);
        var month = date.getMonth() + 1;
        var newDateCreated = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear();

        var date2 = new Date(due_date);
        var month2 = date2.getMonth() + 1;
        var newDueDate = month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear();

        var date3 = new Date(project_date_created);
        var month3 = date3.getMonth() + 1;
        var ProjectnewDateCreated = month3.length > 1 ? month3 : "0" + month3 + "/" + date3.getDate() + "/" + date3.getFullYear();

        var date4 = new Date(project_due_date);
        var month4 = date4.getMonth() + 1;
        var ProjectnewDueDate = month4.length > 1 ? month4 : "0" + month4 + "/" + date4.getDate() + "/" + date4.getFullYear();


        //append related details - projects
        $('#milestone_project_dateCreated').append(ProjectnewDateCreated);
        $('#milestone_project_deadline').append(ProjectnewDueDate);

        //append details
        $('#milestone_name_title').append(milestone_name);
        $('#milestone_dateCreated').append(newDateCreated);
        $('#milestone_due_date').append(newDueDate);
        $('#milestone_account').append(account_name);
        $('#milestone_project').append(project_name);
        $('#milestone_description').append(Updatemilestondec);
        $('#milestoneOwner').append(milestoneOwner);
        $('#milestoneComplete').append(milestoneComplete);


        //append data
        // {{milestoneData.milestone_name}}
        $('#milestoneTask').val(milestone_name)
        $('#taskAccount').val(account_name);
        $('#taskAccountID').val(account_id);
        $('#project_id_pmt').val(project_id);

        //inserting value
        $('#UpdateMilestone_name').val(milestone_name);
        $('#update_due_date').val(due_date);
        $('#UpdateMilestoneAccountName').val(MilestoneAccountName);
        $('#UpdateMilestoneAccountNameID').val(UpdateMilestoneAccountNameID);
        $('#UpdateProjectName').val(UpdateProjectName);
        $('#UpdateProjectNameID').val(UpdateProjectNameID);
        $('#Updatemilestondec').val(Updatemilestondec);
        $('#Updatekick_start').val(UpdateKickStartDate);
        if ( milestoneComplete == 'Yes') {
            $('#UpdateMilestoneCompletedYes').attr('checked','true');
        } else {
            $('#UpdateMilestoneCompletedNo').attr('checked', 'true');
        }

        $('#edtiMilestone').click(function(){
            var data = {};
            data.milestone_name = $('#UpdateMilestone_name').val();
            data.due_date = $('#update_due_date').val();
            data.milestondec = $('#Updatemilestondec').val();
            data.milestone_id = milestone_id;
            data.kick_start = $('#Updatekick_start').val();
            data.MilestoneCompleted = $('input[name=UpdateMilestoneCompleted]:checked', '#UpdateMilestoneCompleted').val();
            $.ajax({
                url: '/admin/edit_milestone',
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

        $.getJSON('/admin/pmt/api', function(dataPMTList){
            var htmlData = '';
            for(var data in dataPMTList){
                htmlData += '<li>';
                htmlData += '<a href="/admin/milestone/show_tasks/'+ dataPMTList[data]._id +'" target="_blank">';
                // htmlData += '<span class="badge badge-info"> 6 </span>';
                htmlData += dataPMTList[data].subject;
                htmlData += '</a>';
                htmlData += '</li>';
            }
            $('#taskList').append(htmlData);
        });

    });

    $.getJSON('/admin/milestone/pmt/api/' + milestone_id, function(pmtData){
        var table = $('#sample_1').DataTable( {
          responsive: true,
          autoWidth: false,
          data: pmtData,
          columnDefs: 
              [
                  {
                      "targets" : [ 0 ],
                      "width" : "12%",
                      "render" : function(data, type, row, meta) {
                          return '<a href="/admin/milestone_tasks/show_tasks/'+ row['_id'] +'" target="_blank">'+ data +'</a>';
                      }
                  },
                  {
                       "targets" : [1],
                       "width" : "7%",
                       "render" : function(data,type, row, meta){
                            return '<img class="img-responsive" style="width:41%;border-radius:50%;margin:0 auto" src="'+ data +'" />';
                       }
                  },
                  {
                        "targets" : [2],
                        "width" : "7%",
                        "render" : function(data, type,row,meta){

                            if ( row['status'] == 'Open' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-warning">'+ 
                                    row['status'] +'</span>&nbsp;';
                            } else if ( row['status'] == 'Completed' ) {
                                return'<span class="todo-tasklist-badge badge badge-roundless label-info">'+ row['status'] +'</span>&nbsp;';
                            } else if ( row['status'] === '1' ) { 
                                return '<span class="todo-tasklist-badge badge badge-roundless label-warning">None</span>&nbsp;';
                            } else if ( row['status'] === '2' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-success">In-Progress</span>&nbsp;';
                            } else if ( row['status'] === '3' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-warning">Changes Required For Manager</span>&nbsp;';
                            } else if ( row['status'] === '4' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-primary">Approval</span>&nbsp;';
                            } else if ( row['status'] === '5' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-success">Completed</span>&nbsp;';
                            }
                        }
                  },
                  {
                        "targets" : [3],
                        "width" : "6%",
                        "render" : function(data, type, row,meta){
                            if ( row['priority'] == 'Normal') {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-info label-xs">'+ 
                                    row['priority'] +'</span>&nbsp;';
                            } else if ( row['priority'] == 'Medium' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-success label-xs">'+ 
                                    row['priority'] +'</span>&nbsp;';
                            } else if ( row['priority'] == 'High' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-warning label-xs">'+ 
                                    row['priority'] +'</span>&nbsp;';
                            } else if ( row['priority'] == 'Urgent' ) {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-danger label-xs">'+ 
                                    row['priority'] +'</span>&nbsp;';
                            } else {
                                return '<span class="todo-tasklist-badge badge badge-roundless label-info label-xs">'+ 
                                    row['priority'] +'</span>&nbsp;';
                            }
                        }
                  },
                  {
                        "targets" : [4],
                        "width" : "5%",
                        "render" : function(data, type, row, meta){
                            var date = new Date(row['due_date']);
                            var month = date.getMonth() + 1;
                            return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
                        }
                  },
                  {
                      "targets" : [5],
                      "render" : function(data, type, row, meta){
                        if ( row['status'] == 5 ) {
                            return  '<div class="btn-group text-center">' +
                                       '<a href="#updatePMT" data-toggle="modal" data-id="'+row['_id']+'" id="updatePMTBtn">' +
                                           '<i class="btn btn-primary fa fa-pencil-square-o"></i>' +
                                       '</a>' +
                                           '<i class="btn purple fa fa-comments-o" data-id="'+ row['_id'] +'" id="GivefeedbackBtn"></i>' +
                                       '<a href="#addRatingModal" data-toggle="modal" data-id="' + row['_id']+'" id="RateQualityBtn">' +
                                           '<i class="btn yellow-crusta fa fa-heart-o"></i>' +
                                       '</a>' +
                                           '<i class="btn btn-danger fa fa-trash-o" data-id="'+ row['_id'] +'" id="taskbtndel"></i>' +
                                     '</div>'
                        } else {
                            return  '<div class="btn-group text-center">' +
                                       '<a href="#updatePMT" data-toggle="modal" data-id="'+row['_id']+'" id="updatePMTBtn">' +
                                           '<i class="btn btn-primary fa fa-pencil-square-o"></i>' +
                                       '</a>' +
                                           '<i class="btn purple fa fa-comments-o" data-id="'+ row['_id'] +'" id="GivefeedbackBtn"></i>' +
                                           '<i class="btn btn-danger fa fa-trash-o" data-id="'+ row['_id'] +'" id="taskbtndel"></i>' +
                                     '</div>'
                        }
                      }
                  }
              ],
          columns: 
              [
                  {
                    "data" : "subject",
                    "title" : "Task Name"
                  },
                  {
                    "title" : "Owner",
                    "data" : "created_by.path"
                  },
                  {
                    "title" : "Status"
                  },
                  {
                    "data" : "priority",
                    "title" : "Priority"
                  },
                  {
                    "data" : "due_date",
                    "title" : "Deadline"
                  },
                  // {
                  //   "title" : "Completed",
                  //   "data" : "completed"
                  // },
                  {
                    "title" : "Action" 
                  }
              ]
            });
        
        var htmlData = '';
        for (var key in pmtData){

            var date = new Date(pmtData[key].due_date);
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
            htmlData += '<a href="javascript:;" >'+ pmtData[key].subject +' </a>';
            htmlData += '</td>';
            htmlData += '<td>'+ month + '/' + dt + '/' + year +'</td>';
            if ( pmtData[key].priority == 'High' ) {
                htmlData += '<td><span class="label label-danger"> '+ pmtData[key].priority +' </span></td>';
            } else if ( pmtData[key].priority == 'Normal' ) {
                htmlData += '<td><span class="label label-success"> '+ pmtData[key].priority +' </span></td>';
            } else {
                htmlData += '<td><span class="label label-info"> '+ pmtData[key].priority +' </span></td>';
            }

            if ( pmtData[key].status == 'Open' ) {
                htmlData += '<td><span class="label label-warning"> '+ pmtData[key].status +' </span></td>';
            } else if ( pmtData[key].status == 'Completed' ) {
                htmlData += '<td><span class="label label-info"> '+ pmtData[key].status +' </span></td>';
            } else if ( pmtData[key].status == '1' ) {
                htmlData += '<td><span class="todo-tasklist-badge badge badge-roundless label-warning">None</span>&nbsp;</td>';
            } else if ( pmtData[key].status == '2' ) {
                htmlData += '<td><span class="todo-tasklist-badge badge badge-roundless label-success">In-Progress</span>&nbsp;</td>';
            } else if ( pmtData[key].status == '3' ) {
                htmlData += '<td><span class="todo-tasklist-badge badge badge-roundless label-warning">Changes Required For Manager</span>&nbsp;</td>';
            } else if ( pmtData[key].status == '4' ) {
                htmlData += '<td><span class="todo-tasklist-badge badge badge-roundless label-primary">Approval</span>&nbsp;</td>';
            } else if ( pmtData[key].status == '5' ) {
                htmlData += '<td><span class="todo-tasklist-badge badge badge-roundless label-success">Completed</span>&nbsp;</td>';
            }
            htmlData += '<td>'+pmtData[key].assigned.fullname+' </td>';
            htmlData += '</tr>';
        }
        $('.TaskMilestoneList').append(htmlData);
    });

    $('#sample_1').on('click','#pmtTaskBtn', function(){
        var pmtID = $(this).attr('data-id');
        $.getJSON('/admin/pmt/api/' + pmtID, function(pmtsingle){
            console.log(pmtsingle);
            for(var key in pmtsingle) {

                var date = new Date(pmtsingle[key].kick_off);
                var month = date.getMonth() + 1;
                var newPMTDate = month.length > 1 ? month : "0" + month + "/" + date.getDate() + "/" + date.getFullYear();

                var date2 = new Date(pmtsingle[key].due_date);
                var month2 = date2.getMonth() + 1;
                var newPMTDueDate = month2.length > 1 ? month2 : "0" + month2 + "/" + date2.getDate() + "/" + date2.getFullYear();

                $('#showPMT #modal-title').text(pmtsingle[key].subject);
                $('#showPMT #subjectPMT').text(pmtsingle[key].comments);

                //insert pmt_id to form
                $('#pmt_id_single').val(pmtsingle[key]._id);
                // $('#showPMT #kickOffDate').text(newPMTDate);
                // $('#showPMT #dueDatePMT').text(newPMTDueDate);
            }
        });
    });

    $('#sample_1').on('click', '#RateQualityBtn', function(){
        var task_id = $(this).attr('data-id');
        $.getJSON('/admin/pmt/api/'+ task_id, function(pmtDataQuery){
            for(var key in pmtDataQuery){
                var project_id = pmtDataQuery[key].project._id;
                var milestone_id = pmtDataQuery[key].milestone._id;
                var assigned_id = pmtDataQuery[key].assigned._id;
                var rate = pmtDataQuery[key].rate;
            }
            $('#example-fontawesome-o').attr('data-current-rating',rate);
            var newRate = $('#example-fontawesome-o').attr('data-current-rating');
            $('#FeedbacktaskID').val(task_id);
            $('#FeedbackprojectID').val(project_id);
            $('#FeedbackMilestoneID').val(milestone_id);
            $('#FeebbackAssignedID').val(assigned_id);
            $('.stars-example-fontawesome-o .br-widget a:nth-child(-n+ '+newRate+' )').addClass('br-selected');
            $('.valueRate').text(rate);
        });
    });

    $('#giveRateBtn').click(function(){
        var data = {};
        data.rate = $('#example-fontawesome-o').val();
        data.task = $('#FeedbacktaskID').val();
        console.log(data);
           $.ajax({
               url: '/admin/give_rate',
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

    $('#sample_1').on('click','#updatePMTBtn', function(){
        var pmt_id = $(this).attr('data-id');
        $('#pmt_id').val(pmt_id);
        $.get('/admin/pmt/api/' + pmt_id, function(pmtDataQuery){
            for (var key in pmtDataQuery){
                var account_id = pmtDataQuery[key].account._id;
                $.getJSON('/admin/user/merge/account/api/' + account_id, function(dataAccountUsers){
                    $('#updtePMTassigned').append('<option value="0">--- Select User ---</option>');
                    for(var i = 0; i < dataAccountUsers.length; i++){
                        var user_id = dataAccountUsers[i]._id;
                        var user_name = dataAccountUsers[i].fullname;
                        $('#updtePMTassigned').append('<option value="'+ user_id +'" data-id="'+ user_id +'">'+ user_name +'</option>'); 
                    }
                    $('#updtePMTassigned').val(pmtDataQuery[key].assigned._id);
                });

                var project_id = pmtDataQuery[key].project._id;
                $.getJSON('/admin/milestone/merge/project/api/' + project_id, function(projectData){

                    $('#UpdatemilestoneTask').append('<option value="0">---------- Select Milestone ----------</option>');
                    for (var i = 0; i < projectData.length; i++) { 
                        var milestone_name = projectData[i].milestone_name;
                        var milestone_id = projectData[i]._id;
                        $('#UpdatemilestoneTask').append('<option value="'+ milestone_id +'" data-id="'+ milestone_id +'">'+ milestone_name +'</option>'); 
                    }
                    $('#UpdatemilestoneTask').val(pmtDataQuery[key].milestone._id);
                });

                //append value forms
                $('#UpdatesubjectTask').val(pmtDataQuery[key].subject);
                $('#pmt_id').val(pmtDataQuery[key]._id);
                $('#updatedueDateTask').val(pmtDataQuery[key].due_date);
                $('#updatekickoff').val(pmtDataQuery[key].kick_off);
                $('#UpdatecommentsTask').val(pmtDataQuery[key].comments);
                $('#UpdatetaskAccount').val(pmtDataQuery[key].account.account_name);
                $('#UpdatetaskAccountID').val(account_id);
                $('#updatePMTpriority').val(pmtDataQuery[key].priority);
                $('#updatePMTstatus').val(pmtDataQuery[key].status);
                $('#updateProjectTask').val(pmtDataQuery[key].project.project_name);
                $('#updateProjectTaskID').val(pmtDataQuery[key].project._id);
                $('#updateCompletedFoo').val(pmtDataQuery[key].completed);
                $('#updateCompleted').on('change', function(){
                    var completedPercentage =  $(this).val();
                    $('#updateCompletedFoo').val(completedPercentage);
                });
            }
        });
        $.getJSON( '/user/api', function( dataInfo ){
            $('#created_by_id').val(dataInfo._id);
        });
    });

    $('#updateTaskPMTBtn').click(function(){
        var data = {};

        data.assigned = $('#updtePMTassigned').val();
        data.milestone = $('#UpdatemilestoneTask').val();
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
        data.completed = $('#updateCompletedFoo').val();

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

    $('#pmtpostbtn').click(function(){
        $.getJSON( '/user/api', function( dataInfo ){
            var data = {};
            data.post = $('#postpmtinput').val();
            data.created_by = dataInfo._id;
            data.milestone = milestone_id;
            data.pmt = $('#pmt_id_single').val();
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
    });

    function appendPMTPost(){
        $.getJSON('/admin/pmt_post/merge/api', function(dataPmt){
            console.log(dataPmt);
            var htmlText = '';
            for(var key in dataPmt){
                htmlText += '<li class="in">';
                htmlText += '<img class="avatar" alt="" src="'+ dataPmt[key].created_by.path +'" />';
                htmlText += '<div class="message">';
                htmlText += '<span class="arrow"> </span>';
                htmlText += '<a href="javascript:;" class="name"> '+ dataPmt[key].created_by.fullname +' </a>';
                htmlText += '<span class="datetime"> at '+ dataPmt[key].dateCreated +' </span>';
                htmlText += '<span class="body">';
                htmlText += dataPmt[key].post;
                htmlText += '</span>';
                htmlText += '</div>';
                htmlText += '</li>';
            }
            $('#postPMTAppend').append(htmlText);
        });
    }
}); //end of doc ready

$(function(){

    var pathArray = window.location.pathname.split( '/' );
    var milestone_id = pathArray[4];
    
    var form1 = $('#addPMTForm');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);

    $('#add_PMT').click(function(){
        if ( !$('#addPMTForm').valid() ) {
           return false;
        } else {
           addTaskFunc()
        }
    });

    $('#addPMTForm').validate({
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
            kick_off : {
                required: true
            },
            dueDateTask: {
                required: true
            },
            milestoneTask : {
                required : true
            },
            priority : {
               required: true
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

    function addTaskFunc(){
        var data = {};
        data.assigned = $('#assigned').val();
        data.milestone = milestone_id;
        data.subject = $('#subjectTask').val();
        data.due_date = $('#dueDateTask').val();
        data.comments = $('#commentsTask').val();
        data.account = $('#taskAccountID').val();
        data.priority = $('#priority').val();
        data.status = $('#status').val();
        data.project = $('#project_id_pmt').val();
        data.created_by = $('#createdbyPMT').val();

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

})