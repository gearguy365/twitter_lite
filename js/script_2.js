$(document).ready(function() {
	var username;

	$.post('appservice.php', {search_key:'verify_credentials', search_value:'default'}, function(data) {
		data = JSON.parse(data);
		console.log(data);
    	username = data.screen_name;
	});


	setTimeout(function() {
	for(var x = 0; x<localStorage.length; x++){
		var key = localStorage.key(x);
	    var item = localStorage.getItem(key);
	    console.log(username+'-'+key+'-'+item);
	  }
	}, 3000);
    

	$('#search-input').on('click', function() {
		populateDatalist();
	});
  

 	$('#search-submit').on('click', function() {
        var keyword = $('#search-input').val(); 

        if($.trim(keyword) != '') {
        	saveKeyword(username,keyword);
	        $(".text-muted").hide();
	        $(".loading").show();

			$.post('appservice.php',{search_key: 'tweet_search', search_value: keyword}, function(data) {
				data = JSON.parse(data);
				data = data.statuses;

				console.log(data);
				$('#tweets_search-feed').html('');

				$.each(data, function(i, obj) {
					$('#tweets-search-feed').append(
					  '<li class="news"><div class="row"><div class="col-sm-1 narrow"><img src="'+obj.user.profile_image_url+'" class="img-thumbnail" alt="Cinque Terre" width="60" height="60"></div><div class="col-sm-5 narrow"><p class="title">'+obj.user.name+'</p><p class="text">'+obj.text+'</p><p>twitted at '+obj.created_at+'</p></div></div><hr></li>'
					);
				});
			});

			$.post('appservice.php',{search_key: 'users_search', search_value: keyword}, function(data) {
				data = JSON.parse(data);
				console.log(data);
				$('#accounts-search-feed').html('');

				$.each(data, function(i, obj) {
				  $('#accounts-search-feed').append(
				    '<li class="news"><div class="row"><div class="col-sm-1 narrow"><img src="'+obj.profile_image_url+'" class="img-thumbnail" alt="Cinque Terre" width="60" height="60"></div><div class="col-sm-5 narrow"><p class="title">'+obj.name+'</p><p class="text">'+obj.description+'</p></div></div><hr></li>'
				    );
				});
			});   
        }

        setTimeout(function() {
			$(".loading").hide();
        }, 6000);
	});

    function populateDatalist() {
		var itemarray = localStorage.getItem(username).split(",");
		$('#FavouriteColor').html('');
		$.each(itemarray, function(i){
			$('#FavouriteColor').append('<option value="'+itemarray[i]+'">');
		});
    }

    function saveKeyword(username, keyword) {
		var exists = false;
		for(var key in localStorage){
			if(key === username){
			  exists = true;
			}
		}

		if(exists) {
			var temp = localStorage.getItem(username);
			localStorage.setItem(username, temp+','+keyword);
		}
		else {
			localStorage.setItem(username, keyword);
		}
    }
});