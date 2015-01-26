<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlConfig.php';
// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// updates the map db

$query="UPDATE `voters` SET `value`=".$_GET["value"].",`voters`=".$_GET["voters"]." WHERE `edge`= ".$_GET["edge"];
echo $query;
mysql_query($query);
mysql_close();
?>

