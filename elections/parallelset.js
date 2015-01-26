<!DOCTYPE html>
<meta charset="utf-8">
<head>
<title>Questions de valeurs</title>
<link type="text/css" rel="stylesheet" href="../lib/jquery-ui/tipsy.css"/>
<link href="../bootstrap/css/bootstrap.css" rel="stylesheet">
<link href="../lib/jquery-ui/jquery-ui.css" rel="stylesheet">

<style>

</style>
<!--[if lt IE 9]>
	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<!-- Le fav and touch icons -->
	<link rel="shortcut icon" href="../bootstrap/ico/favicon.ico">
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="../bootstrap/ico/apple-touch-icon-114-precomposed.png">
	<link rel="apple-touch-icon-precomposed" sizes="72x72" href="../bootstrap/ico/apple-touch-icon-72-precomposed.png">
	<link rel="apple-touch-icon-precomposed" href="../bootstrap/ico/apple-touch-icon-57-precomposed.png">
</head>
<body>
<script src="../d3.v2.min.js?2.8.1">
</script>


<div class="container">
<!--<a href="https://twitter.com/share" class="twitter-share-button" data-via="jcukier">Tweet</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>-->
<h1>Questions de valeurs <small>Avril 2012</small></h1>
<hr>
<!--<p>Chaque ligne représente une ville de plus de 10000 électeurs, un département ou une région.<br>
Les lignes sont colorées par région. <br>
Cliquez-glissez le long des axes pour définir des intervalles, et voir qui a voté selon ces critères.<br></p>-->

<!--<div class="ui-widget">
	<label for="ville">Rechercher: </label>
	<input id="ville" class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">
</div>-->

<div class="row">
	<div class="span4" id="questions"><ul class="nav nav-pills nav-stacked"></ul></div>
	<div class="span8">
		<div class="row">
			<div class="span5" id="questio"></div>
			<div class="span3" id="votes"><ul class="nav nav-list"></ul></div>
		</div>
		<hr>
		<div class="row">
			<div id="cats" ><ul class="nav nav-pills"><li style="line-height:14px;padding:8px 12px;">Séparer les réponses par: </li></ul></div>
		</div>

	</div>

</div>

<footer>
<!--<div id="#about" style="text-align:right">Source: <a href="https://docs.google.com/open?id=0B_w-HzR97DkJVmJXOXIwQVlUWFU">Résultats détaillés du 1er tour</a><br>Jérôme Cukier <a href="https://twitter.com/jcukier" class="twitter-follow-button" data-show-count="false">Follow @jcukier</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script></div>
-->




</div> <!-- /container -->



<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="../lib/jquery/jquery.js"></script>
<script src="../lib/jquery-ui/jquery-ui.min.js"></script>

<script src="../lib/jquery-ui/jquery.tipsy.js"></script>

<script src="dataquestio.js"></script>
<script src="routinequestio.js"></script>


<script src="../bootstrap/js/jquery.js"></script>
<script src="../bootstrap/js/bootstrap-transition.js"></script>
<script src="../bootstrap/js/bootstrap-tab.js"></script>
<!--<script src="../bootstrap/js/bootstrap-alert.js"></script>-->
<!--<script src="../bootstrap/js/bootstrap-modal.js"></script>
<script src="../bootstrap/js/bootstrap-dropdown.js"></script>
<script src="../bootstrap/js/bootstrap-scrollspy.js"></script>

<script src="../bootstrap/js/bootstrap-tooltip.js"></script>
<script src="../bootstrap/js/bootstrap-popover.js"></script>
<script src="../bootstrap/js/bootstrap-button.js"></script>
<script src="../bootstrap/js/bootstrap-collapse.js"></script>
<script src="../bootstrap/js/bootstrap-carousel.js"></script>
<script src="../bootstrap/js/bootstrap-typeahead.js"></script>-->

</body>
</html>