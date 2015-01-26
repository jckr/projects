<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlConfig.php';
// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// insert 0s in the map db

for ($i = 0; $i < 50; $i++) {
	for ($j = 0; $j < 50; $j++) {
		$query="INSERT INTO `map`(`col`, `row`, `height`) VALUES (".$i.",".$j.",0)";
		mysql_query($query);
	}
}
mysql_close();
?>

