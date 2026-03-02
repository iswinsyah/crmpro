<?php
// api/auth.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect_pdo.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Username dan Password wajib diisi"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Login Sukses
        echo json_encode([
            "message" => "Login Berhasil",
            "user" => [
                "id" => $user['id'],
                "nama" => $user['nama_user'],
                "role" => $user['role'],
                "developer_id" => $user['developer_id']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Username atau Password salah"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server Error"]);
}
?>