<?php
session_start();
require_once ('src/codebird.php');
\Codebird\Codebird::setConsumerKey('jXl0aUp7v5gfVv0OeBsswLlPn', 'rSbvEEseMMv2cNu8Lz1Zxtvn9QGKNHRMXP7iLUKJ9RXGBpN7Kk');

$cb = \Codebird\Codebird::getInstance();
$cb->setReturnFormat(CODEBIRD_RETURNFORMAT_JSON);


if(isset($_POST) && !empty($_POST['search_key']) && !empty($_POST['search_value'])){
	$search_key = $_POST['search_key'];
	$search_value = $_POST['search_value'];

	$cb->setToken($_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);

	if($search_key=='users_search'){
		$reply = $cb->users_search([
		'q'=>$search_value,
		'count'=>20
		]);
		
		echo $reply;
	}

	else if($search_key=='tweet_search') {
		$reply = $cb->search_tweets([
			'q'=>$search_value,
			'count'=>20,
			'result_type'=>'recent']);
		echo $reply;
	}

	else if($search_key=='home_timeline'){
		$reply = $cb->statuses_homeTimeline([
			'count'=>20
			]);
		print_r($reply);
	}

	else if($search_key=='verify_credentials'){
		$reply = $cb->account_verifyCredentials();
		echo $reply;
	}

	else if($search_key=='statuses_retweet'){
		$reply = $cb->statuses_retweet_ID('id='.$search_value);
		echo $reply;
	}

	//search_key: 'statuses_reply', search_value: tweet_id, additional_value: usrname
	else if($search_key=='statuses_reply'){
		$in_reply_to_status_id_str = $_POST['additional_value'];
		$reply = $cb->statuses_update([
			'status' => $search_value,
			'in_reply_to_status_id' => $in_reply_to_status_id_str
			]);
		echo $reply;
	}
	else if($search_key=='statuses_update'){
		$reply = $cb->statuses_update([
			'status' => $search_value,
			]);
		echo $reply;
	}

}

?>