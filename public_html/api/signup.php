<?php
// api/signup.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect_pdo.php';

$data = json_decode(file_get_contents("php://input"), true);

$nama_user = $data['nama_user'] ?? '';
$developer_id = $data['developer_id'] ?? '';
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
// Untuk keamanan, role pendaftaran publik di-hardcode menjadi 'Agent Freelance'
$role = 'Agent Freelance'; 

if (empty($nama_user) || empty($developer_id) || empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Semua field wajib diisi"]);
    exit;
}

try {
    // Cek apakah username sudah ada
    $stmtCheck = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmtCheck->execute([$username]);
    if ($stmtCheck->fetch()) {
        http_response_code(409); // 409 Conflict
        echo json_encode(["message" => "Username sudah digunakan, silakan pilih yang lain."]);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert user baru
    $stmt = $pdo->prepare(
        "INSERT INTO users (developer_id, nama_user, role, username, password) 
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([$developer_id, $nama_user, $role, $username, $passwordHash]);

    echo json_encode(["message" => "Pendaftaran berhasil! Silakan login."]);

} catch (PDOException $e) {
    http_response_code(500);
    // Di production, log error ini, jangan tampilkan ke user
    echo json_encode(["message" => "Terjadi kesalahan pada server."]);
}
?>