<?php
// api/login.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect_pdo.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? ''); // Hapus spasi depan/belakang
$password = trim($data['password'] ?? ''); // Hapus spasi depan/belakang

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Username dan Password wajib diisi"]);
    exit;
}

try {
    // Cari user berdasarkan username
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(["message" => "User tidak ditemukan. Pastikan Anda sudah menjalankan seed_admins.php di browser!"]);
        exit;
    }

    // Verifikasi password
    if (password_verify($password, $user['password'])) {
        // Hapus password dari respons agar aman
        unset($user['password']);
        
        echo json_encode([
            "message" => "Login berhasil",
            "user" => $user
        ]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(["message" => "Password salah. Cek Capslock atau ketikan Anda."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    // Log error asli di server, tampilkan pesan umum ke user
    echo json_encode(["message" => "Database Error: Gagal memproses login."]);
}
?>