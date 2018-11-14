<?php
	$url = "http://feeds.feedburner.com/d0od?format=xml";
	$cache_file = "omgubuntu.rss";
	$file = "";
	if(file_exists($cache_file) && (time() - filemtime($cache_file) < (60 * 60 * 4))) {
		$file = file_get_contents($cache_file);
	}
	else {
		$file = file_get_contents($url);
		file_put_contents($cache_file, $file, LOCK_EX);
	}
	echo $file;
?>
