$(document).ready(function(){

    $('.date-picker').datepicker({  
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true
    });

    var pathArray = window.location.pathname.split( '/' );
    var campaign_id = pathArray[4];
    var $assigned = $('#assigned');
    $assigned.append('<option value=""> ----- None ----- </option>');
    
    $.getJSON('/admin/campaigns/api/campaign_loc/' + campaign_id, function(locacallData){
        var htmlText = '';
        for(var key in locacallData){

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
            htmlText += '</div>';
            htmlText += '<strong>';
            htmlText += locacallData[key].subject;
            htmlText += '</strong>';
            htmlText += '<div class="todo-tasklist-item-text">'+ locacallData[key].comments +'</div>';
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
            htmlText += '<span style="margin-right:5px" class="todo-tasklist-badge badge badge-roundless label-primary pull-right">'+locacallData[key].assigned.fullname+'</span>&nbsp;';
            htmlText += '</div>'
            htmlText += '</div>';


        }
        $('#logacallitems').append(htmlText);
    });

    $.getJSON('/admin/campaigns/api/campaign_post/' + campaign_id, function(responsePost){
        var htmlText = '';
        for(var key in responsePost){

            var date = new Date(responsePost[key].dateCreated);
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
            htmlText += '<img class="todo-userpic pull-left" src="'+ responsePost[key].created_by.path +'" width="27px" height="27px">';
            htmlText += '<div class="todo-tasklist-item-title">';
            htmlText += responsePost[key].created_by.fullname;
            htmlText += '</div>';
            htmlText += '<div class="todo-tasklist-item-text">'+ responsePost[key].post +'</div>';
            htmlText += '<div class="todo-tasklist-controls pull-left">';
            htmlText += '<span class="todo-comment-date" style="margin-left:10px;">'+ month + '/' + dt + '/' + year + ' ' + hour + ':' + min +'</span>';
            htmlText += '</div>';
            htmlText += '</div>';


        }
        $('#postDataAppend').append(htmlText);
    });

    $.getJSON('/admin/campaigns/api/campaign_task/' + campaign_id, function(responseTask){
        var htmlText = '';
        for(var key in responseTask){

            var date = new Date(responseTask[key].due_date);
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
            htmlText += '<img class="todo-userpic pull-left" src="'+ responseTask[key].created_by.path +'" width="27px" height="27px">';
            htmlText += '<div class="todo-tasklist-item-title">';
            htmlText += responseTask[key].created_by.fullname;
            // htmlText += '<span class="pull-right">';
            // htmlText += '<a href="#code" data-toggle="modal" class="btn btn-default btn-xs dropdown-toggle" data-id="'+responseTask[key]._id+'" id="logBtn" >Edit</a>';
            // htmlText += '</span>';
            htmlText += '</div>';
            htmlText += '<strong>';
            htmlText += responseTask[key].subject;
            htmlText += '</strong>';
            htmlText += '<div class="todo-tasklist-item-text">'+ responseTask[key].comments +'</div>';
            htmlText += '<div class="todo-tasklist-controls pull-left">';
            htmlText += '</div>';
            htmlText += '<div class="todo-tasklist-controls pull-right">';
            htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-danger">'+ month + '/' + dt + '/' + year + '</span>&nbsp;';
            htmlText += '<span class="todo-tasklist-badge badge badge-roundless label-info">'+responseTask[key].priority+'</span>&nbsp;';
            htmlText += '<span style="margin-right:5px" class="todo-tasklist-badge badge badge-roundless label-primary">'+responseTask[key].assigned.fullname+'</span>&nbsp;';
            htmlText += '</div>'
            htmlText += '</div>';


        }
        $('#taskFeedItem').append(htmlText);
    });

    $.getJSON('/admin/campaigns/api/user/' + campaign_id, function(responseData) {
        for(var i = 0; i < responseData.length; i ++){
            var fullname = responseData[i].fullname;
            var fullnameId = responseData[i]._id;
            $assigned.append('<option value="'+ fullnameId +'" data-id="'+ fullnameId +'">'+ fullname +'</option>'); 
        }
    });
});
$(function(){
    var pathArray = window.location.pathname.split( '/' );
    var campaign_id = pathArray[4];
    $('#updateCampaignMod').click(function(){
        $.getJSON('/admin/campaigns/api/' + campaign_id, function(responseData){
            $('#updateAccountName').val(responseData.account.account_name);
            $('.updateAccountNameID').val(responseData.account._id);
            $('#updateCampaignName').val(responseData.team_name);
            $('.CampaignId').val(responseData._id);
            $('#updateCampaignOwner').val(responseData.campaign_owner.fullname);
            $('.updateCampaignOwnerID').val(responseData.campaign_owner._id);
        })
    });

    $('#updateCampaignBtn').click(function(){
        var data = {};
        data.team_name = $('#updateCampaignName').val();
        data.campaign_id = $('.CampaignId').val();
        data.campaign_owner = $('.updateCampaignOwnerID').val();
        console.log(data);
        $.ajax({
            url: '/admin/campaigns/update_campaign',
            method : 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                console.log(response);
                location.reload();
            },
            error:function(response){
                console.log(response)
            }
        });                
    });

    $('#CampaignDelBtn').click(function(){
        var data = {};
        data.campaign_id = campaign_id;
        $.ajax({
            url: '/admin/campaigns/delete_campaign',
            method : 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success:function(response){
                console.log(response);
                window.location.href = '/admin/campaigns'
            },
            error:function(response){
                console.log(response)
            }
        });
    });

    $('.mention_sample').mentionsInput({
      onDataRequest:function (mode, query, callback) {
        $.getJSON('/admin/campaigns/api/user/' + campaign_id, function(responseData) {
          responseData = _.filter(responseData, function(item) { return item.fullname.toLowerCase().indexOf(query.toLowerCase()) > -1 });
          callback.call(this, responseData);
        });
      }
    });

    $('#locBtn').click(function(){
        $('.mention_sample').mentionsInput('getMentions', function(response) {
           for (var i = 0; i < response.length; i++) { 
               var assigned = response[i]._id;
               var data = {};
               data.subject = $('#subjectLAC').val();
               data.comments = $('#CommentsLAC').val();
               data.campaigns = $('#campaignsIDLAC').val();
               data.assigned = assigned;
               $.ajax({
                   url: '/admin/campaigns/add_campaignLoc',
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
        });
    });

    $('#sharePost').click(function(){
        var data = {};
        data.created_by = user_id;
        data.campaign = campaign_id;
        data.post = $('#postField').val();
        console.log(data);
        $.ajax({
            url: '/admin/campaigns/add_campaignPost',
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

    $('#taskBtn').click(function(){
        var data = {};
        data.subject = $('#subjectTask').val();
        data.due_date = $('#dueDateTask').val();
        data.comments = $('#commentsTask').val();
        data.assigned = $('#assigned').val();
        data.campaign = $('#taskCampaignID').val();
        data.priority = $('#priority').val();
        data.status = $('#status').val();
        data.created_by = user_id;
        $.ajax({
            url: '/admin/campaigns/add_task',
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
});