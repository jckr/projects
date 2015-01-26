<?php
$user="root";
$password="";
$database="vis";
mysql_connect("127.0.0.1",$user,$password);
@mysql_select_db($database) or die( "Unable to select database");
$query="CREATE TABLE map (
	col int(3) NOT NULL,
	row int(3) NOT NULL,
	height int(3) NOT NULL)";
mysql_query($query);
mysql_close();
?>