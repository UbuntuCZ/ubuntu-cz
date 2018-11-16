<?php
	header("Content-Type: application/json");

	if(isset($_GET["version"])) {
		$version = $_GET["version"];
		$url = "http://releases.ubuntu.com/${version}/";
		$cache_file = "release${version}.json";
		$file = "";
		if(file_exists($cache_file) && (isset($_GET["old"]) || (time() - filemtime($cache_file) < (60 * 60 * 24)))) {
			$JSON = file_get_contents($cache_file);
			echo $JSON;
			return;
		}
		else {
			$types = array(
				"desktop" => "amd64",
				"server" => "amd64"
			);
			
			$ctx = stream_context_create(array(
				"http" => array(
					"timeout" => 2
					)
				)
			); 
			
			$file = file_get_contents($url, 0, $ctx);
			$dataFound = false;
			
			$JSON = "{\n";
			$JSON .= "\t\"name\": \"releases\",\n";
			$JSON .= "\t\"fetched\": \"" . date("Y-m-d G:i") . "\",\n";
			$index = 0;
			foreach($types as $key => $type) {
				preg_match_all("/<a href=\"(.*?-${key}-amd64.iso)\">.*?<\/a>(.*?)\n/", $file, $matches);
				if(sizeof($matches) > 2) {
					$lineMatch = array_pop($matches[0]);
					$JSON .= "\t\"" . $key . "\": {\n";
					preg_match("/ubuntu-(.*?)-/", $lineMatch, $versionNumberMatches);
					if(sizeof($versionNumberMatches) > 1) {
						$JSON .= "\t\t\"number\": \"" . $versionNumberMatches[1] . "\",\n";
					}
					
					preg_match("/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+([\d\.\,]+[a-zA-Z])\s+(.*)$/", $lineMatch, $dataArray);
					$sizeOfDataArray = sizeof($dataArray);
					if($sizeOfDataArray > 2) {
						$JSON .= "\t\t\"date\": \"" . $dataArray[1] . "\",\n";
						$JSON .= "\t\t\"time\": \"" . $dataArray[2] . "\",\n";
						
						if($sizeOfDataArray > 3) {
							$JSON .= "\t\t\"size\": \"" . $dataArray[3] . "\",\n";
							
							if($sizeOfDataArray > 4) {
								$JSON .= "\t\t\"description\": \"" . $dataArray[4] . "\",\n";
							}
						}
					}
					$JSON .= "\t\t\"" . $type . "\": \"$url" . array_pop($matches[1]) . "\"\n";
					$JSON .= "\t}" . (($index < sizeof($types) - 1) ? "," : "") . "\n";
					$dataFound = true;
				}
				$index++;
			}
			$JSON .= "}";
			
			if($dataFound) {
				file_put_contents($cache_file, $JSON, LOCK_EX);
				echo $JSON;
				return;
			}
			
			if(file_exists($cache_file)) {
				$JSON = file_get_contents($cache_file);
				touch($cache_file);
				echo $JSON;
				return;
			}
		}
	}
?>
