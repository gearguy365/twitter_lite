var global_data;

$(document).ready(function() {

	loader();
			
	$('#refresh').click(function() {
    	$("#loading").show();
    	loader();
    });

	$(document).on('click','.retweet',function(e){
		e.stopPropagation();
		$('.notification-bar').html('retweeting...');
		$('.notification-bar').slideDown();

		var text = $(this).closest('div[class^=col]').find('.text').html();
		var tweet_id = 'default';
		var indicator;
		
		$.each(global_data, function(i,object) {
			if(object.text==text){
				tweet_id=object.id_str;
			}
		});
		
		
		$.post('appservice.php', {search_key: 'statuses_retweet', search_value: tweet_id}, function(data) {

			data = JSON.parse(data);
			
			if(data.hasOwnProperty('errors')) {
				$('.notification-bar').html('could not retweet');
				
			}
			else {
				$('.notification-bar').html('retweeted successfully!');
				
			}
		});

		$('.notification-bar').delay(2000).fadeOut();
	});

	$(document).on('click', '.reply', function(e) {
		e.stopPropagation();

	    $('.reply').keypress(function(e) {
		    if (event.which == 13) {
		        event.preventDefault();

		        $('.notification-bar').html('replying...');
				$('.notification-bar').slideDown();

				var status = $(this).closest('div[class^=col]').find('.text').html();
				var text = $(this).val();
				var tweet_id = 'default';
				var usrname = 'default';
		
				$.each(global_data, function(i,object) {
					if(object.text==status){
						tweet_id=object.id_str;
						usrname=object.user.screen_name;
					}
				});

				text = '@'+usrname+' '+text;
		
				$.post('appservice.php',{search_key: 'statuses_reply', search_value: text, additional_value: tweet_id}, function(data) {
					data = JSON.parse(data);
					
					if(data.hasOwnProperty('errors')){
						$('.notification-bar').html('could not reply');
					}
					else {
						$('.notification-bar').html('replied successfully!');
					}
					console.log(data);
				});

				$('.notification-bar').delay(2000).fadeOut();
			}
		});
	});

	$('#tweet-submit').click(function(e) {
		var tweet = $('#tweet').val();

		if(tweet.length==0) {
			$('.notification-bar').html('cant make and empty tweet: ');
			$('.notification-bar').slideDown();
		}

		else if(tweet.length>140) {
			$('.notification-bar').html('140 word limit of tweet exceeded ');
			$('.notification-bar').slideDown();
		}
		else {
			$('.notification-bar').html('Tweeting...');
			$('.notification-bar').slideDown();

			$.post('appservice.php',{search_key: 'statuses_update', search_value: tweet}, function(data) {
				//console.log(data);
				data = JSON.parse(data);
			
				if(data.hasOwnProperty('errors')){
					$('.notification-bar').html('could not tweet');
				}
				else {
					$('.notification-bar').html('tweted successfully!');
				}
				console.log(data);
			});
			loader();
		}

		$('.notification-bar').delay(2000).fadeOut();
	});



	$('#myModal').on('show.bs.modal', function(event) {
	    var element = $(event.relatedTarget); // the li that triggered the modal to show
	    var user_name = element.find('.title').text();
	    var tweet_text = element.find('.text').text(); // Extract the value of the .text div inside that li
	    var tweet_media = '';
	    var tweet_url = '';
	    var user_scname = '';
	    var media_type = '';

	    $.each(global_data, function(i,object) {

			if(object.text==tweet_text) {

				if(object.entities.hasOwnProperty('media')) {
					media_type = object.entities.media[0].type;

					if(media_type=='photo') {
						tweet_media = '<img src="'+object.entities.media[0].media_url+'" class="img-thumbnail" alt="Cinque Terre" width="600" height="400">';
					}
					else if(media_type=='video')  {
						tweet_media = '<video width="400" controls><source src="'+object.entities.media[0].media_url+'" type="video/mp4"></video>'
					}	
				}

				if(object.entities.hasOwnProperty('urls') && object.entities.urls.length!=0) {
					tweet_url = 'Follow the news: <a href="'+object.entities.urls[0].expanded_url+'">'+object.entities.urls[0].expanded_url+'"</a>';
				}
				
				user_scname = object.user.screen_name;
			}
		});

	    var modal = $(this);
	    $("#popup-title").html('<strong>'+user_name+'</strong>@<small>'+user_scname+'</small>');
	    $("#popup-body").html('<p>'+tweet_text+'</p>'+tweet_media+'<br>'+tweet_url);
	});

});

function loader() {
	$.post('appservice.php', {search_key: 'home_timeline', search_value: 'none'},function(data) {
        global_data = JSON.parse(data); 
	    $("#loading").hide();
        console.log(global_data);

        if ($.isArray(global_data)!=true) {
    		$('#feeds').append('<strong>Can not get tweets, rate limit exceeded/token expired</strong><p>');
    	} 

    	else {
    		$('#feeds').text('');
	        $.each(global_data, function(i, obj) {
	        		$('#feeds').append(
						'<li class="news" data-toggle="modal" data-target="#myModal"><div class="row"><div class="col-sm-1 narrow"><img src="'+obj.user.profile_image_url+'" class="img-thumbnail" alt="Cinque Terre" width="60" height="60"></div><div class="col-sm-5 narrow"><p class="title">'+obj.user.name+'</p><p class="text">'+obj.text+'</p><p>twitted at '+obj.created_at+'</p><form class="form-inline"><input type="text" class="form-control reply" placeholder="Type and enter to reply"><button type="button" class="btn btn-default retweet">Re-Tweet</button></form></div></div><hr></li>'
					);     
		    });
		}
	});
}