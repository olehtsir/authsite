<?php
require __DIR__ . "/db.php";
session_start();

$input = json_decode(file_get_contents("php://input"), true);

$email = trim($input["email"] ?? "");
$password = $input["password"] ?? "";

// 1) Перевіряємо дані
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["message" => "Невірний email"]);
  exit;
}

if (strlen($password) < 6) {
  http_response_code(400);
  echo json_encode(["message" => "Пароль мінімум 6 символів"]);
  exit;
}

// 2) Перевіряємо чи такий email вже існує
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->fetch()) {
  http_response_code(409);
  echo json_encode(["message" => "Цей email вже зареєстрований"]);
  exit;
}

// 3) Хешуємо пароль (важливо!)
$hash = password_hash($password, PASSWORD_DEFAULT);

// 4) Записуємо в базу
$stmt = $pdo->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
$stmt->execute([$email, $hash]);

$userId = $pdo->lastInsertId();

// 5) Одразу логінимо користувача через сесію
$_SESSION["user"] = ["id" => $userId, "email" => $email];

echo json_encode(["message" => "Registered ✅"]);
