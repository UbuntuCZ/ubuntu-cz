<?php
$url = 'https://api.travis-ci.com/repo/UbuntuCZ%2Fubuntu-cz/requests';
$body = '{ "request": {
    "branch":"master",
    "message": "Cron: ' . date('Y-m-d H:i') . '"
} }';
// $token = 'xxx';
$opts = array(
    'http' => array(
        'method'  => 'POST',
        'header' =>
            "Content-Type: application/json\r\n" .
            "Content-Length: " . strlen($body) . "\r\n" .
            "Accept: application/json\r\n" .
            "Travis-API-Version: 3\r\n" .
            "Authorization: token " . $token . "\r\n",
        'content' => $body,
    ),
);
$context = stream_context_create($opts);
file_get_contents($url, false, $context);
