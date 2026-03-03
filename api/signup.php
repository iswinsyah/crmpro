<?php
// api/signup.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect_pdo.php';

$data = json_decode(file_get_contents("php://input"), true);

// Common fields
$nama_user = trim($data['nama_user'] ?? '');
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');
$role = trim($data['role'] ?? '');

if (empty($nama_user) || empty($username) || empty($password) || empty($role)) {
    http_response_code(400);
    echo json_encode(["message" => "Nama, Username, Password, dan Role wajib diisi."]);
    exit;
}

try {
    // --- Check if username already exists (common for all roles) ---
    $stmtCheck = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmtCheck->execute([$username]);
    if ($stmtCheck->fetch()) {
        http_response_code(409); // 409 Conflict
        echo json_encode(["message" => "Username sudah digunakan, silakan pilih yang lain."]);
        exit;
    }

    $pdo->beginTransaction(); // Start transaction

    if ($role === 'Developer') {
        // --- SCENARIO A: Registering a new Developer and their Company ---
        $nama_perusahaan = trim($data['nama_perusahaan'] ?? '');
        $alamat_perusahaan = trim($data['alamat_perusahaan'] ?? '');
        $kontak_perusahaan = trim($data['kontak_perusahaan'] ?? '');

        if (empty($nama_perusahaan)) {
            http_response_code(400);
            echo json_encode(["message" => "Nama Perusahaan Baru wajib diisi."]);
            exit;
        }

        // 1. Insert new developer
        $stmtDev = $pdo->prepare(
            "INSERT INTO developers (nama_perusahaan, alamat, kontak, status_langganan) VALUES (?, ?, ?, 'Trial')"
        );
        $stmtDev->execute([$nama_perusahaan, $alamat_perusahaan, $kontak_perusahaan]);
        $new_developer_id = $pdo->lastInsertId();

        // 2. Insert new user (the owner)
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmtUser = $pdo->prepare(
            "INSERT INTO users (developer_id, nama_user, role, username, password) VALUES (?, ?, ?, ?, ?)"
        );
        $stmtUser->execute([$new_developer_id, $nama_user, 'Developer', $username, $passwordHash]);
        
        $message = "Perusahaan dan Akun Owner berhasil didaftarkan! Silakan login.";

    } else {
        // --- SCENARIO B: Joining an existing company (Admin CS or Agent) ---
        $allowed_roles = ['Admin CS', 'Agent Freelance'];
        if (!in_array($role, $allowed_roles)) {
            http_response_code(400);
            echo json_encode(["message" => "Role tidak valid untuk pendaftaran."]);
            exit;
        }

        $developer_id = $data['developer_id'] ?? '';
        if (empty($developer_id)) {
            http_response_code(400);
            echo json_encode(["message" => "Perusahaan wajib dipilih."]);
            exit;
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (developer_id, nama_user, role, username, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$developer_id, $nama_user, $role, $username, $passwordHash]);
        $message = "Pendaftaran berhasil! Silakan login.";
    }

    $pdo->commit(); // Commit transaction if all is well

    echo json_encode(["message" => $message]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack(); // Rollback on error
    }
    http_response_code(500);
    error_log("Signup Error: " . $e->getMessage()); // Log error for admin
    echo json_encode(["message" => "Terjadi kesalahan pada server. Silakan coba lagi nanti."]);
}
?>