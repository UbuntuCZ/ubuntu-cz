<?php
	class PagesHolder {
		private static $instance;
		private static $pages = [];
		private static $currentPage = null;
		private static $vanityPage = null;
		private static $skipKeys = ["custom", "redirects"];
		
		protected function __construct() {}
		
		public static function getInstance() {
			if(null === static::$instance) {
				static::$instance = new static();
				
				$config = parse_ini_file("pages/pages.conf", true);
				foreach($config as $key => $section) {
					$key = in_array($key, self::$skipKeys) ? "custom" : "";
					foreach($section as $page) {
						self::appendPage(self::generateMenuItem($page, $section == "section" ? "section" : false), $key);
					}
				}
			}
			return static::$instance;
		}
		
		public static function getKeysToSkip() {
			return self::$skipKeys;
		}
		
		private static function generateMenuItem($pageString, $customClassList = false) {
			$pageParts = explode(";", $pageString);
			if(sizeof($pageParts) >= 0) {			
				$obj = new MenuItem(array_shift($pageParts), array_shift($pageParts), array_shift($pageParts), array_shift($pageParts),  array_shift($pageParts));
				if($customClassList) {
					$obj->appendClass($customClassList);
				}
				return $obj;
			}
			else {
				return null;
			}
		}
		
		private static function appendPage($page, $namePrefix = null) {
			if($namePrefix != null) {
				self::$pages[$namePrefix.$page->url] = $page;
			}
			else {
				self::$pages[$page->url] = $page;
			}
			if($page->isCurrent) {
				if(array_key_exists($page->url, self::$pages)) {
					self::$currentPage = self::$pages[$page->url];
					self::$vanityPage = $page;
				}
				else {
					self::$currentPage = $page;
				}
			}
		}
		
		public function getPage($name) {
			if(array_key_exists($name, self::$pages)) {
				return self::$pages[$name];
			}
			return null;
		}
		
		public function getCurrentPage() {
			return self::$currentPage;
		}
		
		public function getPageUrl($name) {
			$page = self::getPage($name);
			if($page != null) {
					if(file_exists(".htaccess")) {
						echo getSitePath() . $page->path;
					}
					else {
						echo ".?page=" . $page->url;
					}
			}
			echo "";
		}
		
		final public function __clone() {
			throw new Exception("Clone is not allowed");
		}

		final public function __wakeup() {
			throw new Exception("Unserialization is not allowed");
		}
	}
	
	class MenuItem {
		public $url = null;
		public $path = null;
		public $name = null;
		public $description = null;
		public $keywords = null;
		public $isCurrent = false;
		private $classList = [];
		
		function __construct($url, $path, $name, $description, $keywords) { 
			$this->url = $url;
			$this->path = $path;
			$this->name = $name;
			$this->description = $description;
			$this->keywords = $keywords;
			$this->updateCurrent();
		}
		
		function updateCurrent() {
			if(isset($_GET["page"])) {
				$this->isCurrent = ($this->url == $_GET["page"]);
			}
			else if($this->path == "") {
				$this->isCurrent = true;
			}
		}
		
		function appendClass($customClassList = "") {
			if(!in_array($customClassList, $this->classList)) {
				array_push($this->classList, $customClassList);
			}
		}
		
		function removeClass($customClassList = "") {
			$pos = array_search($customClassList, $this->classList);
			if($pos >= 0) {
				unset($this->classList[$pos]);
			}
		}
		
		function generateListItem($noLiEndTag = false, $showDesc = false) {
			if($this->isCurrent) {
				$this->appendClass("current");
			}
			
			$classString = "";
			if(count($this->classList) > 0) {
				$classString = " class=\"" . implode(" ", $this->classList) . "\"";
			}
			
			$itemUrl =  ".?page=" . $this->url;
			if(file_exists(".htaccess")) {
				$itemUrl = getSitePath() . $this->path;
			}
			
			$desc = "";
			if($showDesc) {
				$desc = "<span class=\"description\">" . $this->description . "</span>";
			}
			
			$output = "<li$classString><a href=\"${itemUrl}\">" . $this->name . "</a>${desc}";
			if(!$noLiEndTag) {
				$output .= "</li>";
			}
			return $output;
		}
	}
	
	class UbuntuRelease {
		public $name = "";
		public $number = null;
		public $relDate = null;
		public $relDateTime = null;
		public $readableRelDate = null;
		public $endDateTime = null;
		public $readableEndDate = null;
		public $lts = false;
		public $status = "";
		public $latest = false;
		private $months = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];
		private $monthsVar = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];
		
		function __construct($relDate, $name) {
			$this->name = $name;
			$this->lts = $this->endsWith($relDate, " LTS");
			if($this->lts) {
				$this->relDate = substr($relDate, 0, -4);
			}
			else {
				$this->relDate = $relDate;
			}
			
			$tmpDateTime = DateTime::createFromFormat("Y-m-d", $this->relDate);
			$this->number = $tmpDateTime->format("y.m");
			
			$this->relDateTime = clone $tmpDateTime;
			$this->readableRelDate = $this->relDateTime->format("d.m.Y");
			
			$this->endDateTime = $this->lts ? $tmpDateTime->modify("+5 years") : $tmpDateTime->modify("+9 months");
			$this->readableEndDate = $this->endDateTime->format("d.m.Y");
			$this->readableEndMonth = $this->endDateTime->format("F Y");
			$this->readableEndMonthCS = $this->months[$this->endDateTime->format("n") - 1] . " " . $this->endDateTime->format("Y");
			$this->readableEndMonthVarCS = $this->monthsVar[$this->endDateTime->format("n") - 1] . " " . $this->endDateTime->format("Y");
			
			if($this->relDateTime <= new DateTime()) {
				if(new DateTime() <= $this->endDateTime) {
					$this->status = "current";
				}
				else {
					$this->status = "past";
				}
			}
			else {
				$this->status = "future";
			}
			if($this->lts) {
				$this->status .= " lts";
			}
		}
		
		function endsWith($haystack, $needle) {
			return substr($haystack, -strlen($needle)) === $needle;
		}
	}
	
	class UbuntuReleases {
		private static $instance;
		private static $releases = null;
		
		protected function __construct() {}
		
		public static function getInstance() {
			if(null === static::$instance) {
				static::$instance = new static();
				$versions = parse_ini_file("ubuntu_versions.ini");
				$releaseObjects = array();
				foreach($versions as $relDate => $name) {
					$releaseObject = new UbuntuRelease($relDate, $name);
					array_push($releaseObjects, $releaseObject);
					if(!next($versions)) {
						$releaseObject->latest = true;
					}
				}
				self::$releases = $releaseObjects;
			}
			return static::$instance;
		}
		
		public function getReleases() {
			return self::$releases;
		}
		
		final public function __clone() {
			throw new Exception("Clone is not allowed");
		}

		final public function __wakeup() {
			throw new Exception("Unserialization is not allowed");
		}
	}
?>
