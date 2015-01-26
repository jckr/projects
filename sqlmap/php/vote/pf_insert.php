<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlConfig.php';
// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

if (isset($_GET["vote"])) {
	$query=" `vote`=".$_GET["vote"];
	$query="INSERT INTO `pf`(`depenses`, `recettes`, `vote`) VALUES (".$_GET["depenses"].",".$_GET["recettes"].",".$_GET["vote"].")";
	}
else {
	$query="INSERT INTO `pf`(`depenses`, `recettes`) VALUES (".$_GET["depenses"].",".$_GET["recettes"].")";
}
$result=mysql_query($query);

echo json_encode(array('id'=>mysql_insert_id()));
mysql_close();
?>

