<?php

// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlConfig.php';
// connect to the database

@mysql_select_db($dsn) or die( "Unable to select database");

// reads the map db
$query="SELECT * FROM `voters`";
mysql_query($query);

$result = mysql_query($query,$link) or die('Errant query:  '.$query);

$values = array();
if(mysql_num_rows($result)) {
	while($value = mysql_fetch_assoc($result)) {
      $values[] = array('value'=>$value);
    }
}
header('Content-type: application/json');
echo json_encode(array('values'=>$values));

mysql_close();
?>
