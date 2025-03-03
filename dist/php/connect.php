<?php
//error_log('hola');
$hostname = '173.201.179.213'; //'161.35.13.96'; //173.201.179.213
//$hostname = 'localhost';
$username = 'crm-root';//'dreamtech'; //crm-root
$password = 'mqAla.jzjC9';
$db_name  = 'crm_base'; //'jc-proyect';

$conn = new mysqli($hostname, $username, $password, $db_name);

if($conn->connect_error){
	//error_log("clavo:".$conn->connect_error);
	die("Connection failed: ".$conn->connect_error);
}else{
	//error_log("LOGRADO!") ;
}

?>