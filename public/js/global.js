$(document).ready(function(){
		$.getJSON( '/user/api', function( data ) {
		    var path = data.path;
		    //$('.username.username-hide-on-mobile').text(data.fullname);
		    //$('.dropdown-user img').attr('src', '../../../../../' + path);
		});

		$.getJSON('/admin/users/api/', function(querydata){
			var htmlText = '';

			for(var key in querydata){
				// htmlText += '<a href="admin/user_profile/'+ querydata[key]._id +'" target="_blank">';
			    htmlText += '<li class="media" data-id="'+ querydata[key]._id +'" id="goToUser">';
			    htmlText += ' <img class="media-object" src="'+ querydata[key].path +'">';
			    htmlText += '<div class="media-body">';
			    htmlText += '<h4 class="media-heading">'+ querydata[key].fullname +'</h4>';
			    htmlText += '<div class="media-heading-sub">' + querydata[key].position +'</div>';
			    htmlText += '</div>';
			    htmlText += '</li>';
			    // htmlText += '</a>';

			}

			$('.page-quick-sidebar-chat-users').on('click', '#goToUser', function() {
			    $('.page-quick-sidebar-chat-users')
			    	.animate({'margin-left':'1000px'},
			    		function(){
			    			$('#StaffListSidebar').slideUp('fast');
			    			$('.page-quick-sidebar-item').animate({'margin-left' : '0'});
			    		});
			});
			$('.page-quick-sidebar-back-to-list').click(function(){
				$('.page-quick-sidebar-item').animate({'margin-left' : '320px'});
				$('.page-quick-sidebar-chat-users').animate({'margin-left' : '0'},2000);
				$('#StaffListSidebar').css('display','block');
			});

			$('#StaffListSidebar').append(htmlText);
		});

});