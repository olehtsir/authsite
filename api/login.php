<?php
require __DIR__ . "/db.php";
session_start();

$input = json_decode(file_get_contents("php://input"), true);

$email = trim($input["email"] ?? "");
$password = $input["password"] ?? "";

// 1) Знаходимо користувача в базі
$stmt = $pdo->prepare("SELECT id, email, password_hash FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

// 2) Якщо нема або пароль не підходить → помилка
if (!$user || !password_verify($password, $user["password_hash"])) {
  http_response_code(401);
  echo json_encode(["message" => "Неправильний email або пароль"]);
  exit;
}

// 3) Записуємо його в сесію
$_SESSION["user"] = ["id" => $user["id"], "email" => $user["email"]];

echo json_encode(["message" => "Logged in ✅"]);
