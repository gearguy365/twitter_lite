<?php
session_start();
session_destroy();
unset($_SESSION['oauth_token']);
unset($_SESSION['oauth_token_secret']);
header('Location: index.php'); 
?>