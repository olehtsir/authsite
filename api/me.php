<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION["user"])) {
  http_response_code(401);
  echo json_encode(["message" => "Not authorized"]);
  exit;
}

echo json_encode(["user" => $_SESSION["user"]]);
