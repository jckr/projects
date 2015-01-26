<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlConfig.php';
// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// updates the pf table

$query="UPDATE `pf` SET";
if (isset($_GET["commentaire"])) {$query.=" `commentaire`=\"".$_GET["commentaire"]."\"";}
if (isset($_GET["recettes"])) {$query.=" `recettes`=".$_GET["recettes"];}
if (isset($_GET["depenses"])) {$query.=" `depenses`=".$_GET["depenses"];}
if (isset($_GET["vote"])) {$query.=" `vote`=".$_GET["vote"];}
if (isset($_GET["sexe"])) {$query.=" `sexe`=".$_GET["sexe"];}
if (isset($_GET["age"])) {$query.=" `age`=".$_GET["age"];}
$query.=" WHERE `id`=".$_GET["id"];
echo ("{}");
mysql_query($query);
mysql_close();
?>

