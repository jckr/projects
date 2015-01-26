<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlConfig.php';
// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// updates the map db

$query="UPDATE `map` SET `height`=".$_GET["height"]." WHERE `col`= ".$_GET["col"]." and `row`= ".$_GET["row"];
mysql_query($query);
mysql_close();
?>

