<?php

$hostname = '161.35.13.96';
//$hostname = 'localhost';
$username = 'dreamtech';
$password = 'mqAla.jzjC9';
$db_name  = 'jc-proyect';

$conn = new mysqli($hostname, $username, $password, $db_name);

if($conn->connect_error){
	die("Connection failed: ".$conn->connect_error);
}else{
	//echo "LOGRADO!";
}

?>