<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");

session_destroy();

echo json_encode(["message" => "Logged out ✅"]);
