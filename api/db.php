<?php
header("Content-Type: application/json; charset=UTF-8");

// XAMPP: MySQL зазвичай root без пароля
$host = "127.0.0.1";
$db   = "authdb";
$user = "root";
$pass = "";

try {
  $pdo = new PDO(
    "mysql:host=$host;dbname=$db;charset=utf8mb4",
    $user,
    $pass,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["message" => "DB connection error"]);
  exit;
}
