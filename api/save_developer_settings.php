<?php
// api/save_developer_settings.php
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
require_once 'db_connect_pdo.php';

// Data dari form-data
$developer_id = $_POST['developer_id'] ?? null;
$app_name = $_POST['app_name'] ?? null;
$notification_email = $_POST['notification_email'] ?? null;
$maintenance_mode = isset($_POST['maintenance_mode']) ? 1 : 0;
$logo_file = $_FILES['logo'] ?? null;

if (!$developer_id) {
    http_response_code(400);
    echo json_encode(['message' => 'Developer ID tidak valid.']);
    exit;
}

// Validasi user (hanya Developer atau Super Admin yang bisa edit)
$user_id = $_POST['user_id'] ?? null;
$stmtUser = $pdo->prepare("SELECT role, developer_id FROM users WHERE id = ?");
$stmtUser->execute([$user_id]);
$user = $stmtUser->fetch();

if (!$user || !in_array($user['role'], ['Super Admin', 'Developer']) || ($user['role'] === 'Developer' && $user['developer_id'] != $developer_id)) {
     http_response_code(403);
     echo json_encode(['message' => 'Akses ditolak. Anda tidak berhak mengubah pengaturan ini.']);
     exit;
}

$logo_url = $_POST['existing_logo_url'] ?? null; // Ambil URL logo yang sudah ada

// --- Handle File Upload ---
if ($logo_file && $logo_file['error'] === UPLOAD_ERR_OK) {
    $upload_dir = '../uploads/logos/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_extension = pathinfo($logo_file['name'], PATHINFO_EXTENSION);
    $safe_filename = "logo_" . $developer_id . "_" . time() . "." . $file_extension;
    $upload_path = $upload_dir . $safe_filename;

    if (move_uploaded_file($logo_file['tmp_name'], $upload_path)) {
        // Hapus logo lama jika ada dan berhasil upload yang baru
        if ($logo_url && file_exists('..' . $logo_url)) {
            unlink('..' . $logo_url);
        }
        $logo_url = '/uploads/logos/' . $safe_filename; // Simpan path relatif ke DB
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Gagal mengupload logo.']);
        exit;
    }
}

try {
    $stmt = $pdo->prepare(
        "UPDATE developers SET 
            app_name = ?, 
            notification_email = ?, 
            logo_url = ?, 
            maintenance_mode = ? 
        WHERE id = ?"
    );
    
    $stmt->execute([$app_name, $notification_email, $logo_url, $maintenance_mode, $developer_id]);

    echo json_encode(['message' => 'Pengaturan berhasil disimpan!', 'new_logo_url' => $logo_url]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Save Settings Error: " . $e->getMessage());
    echo json_encode(['message' => 'Gagal menyimpan pengaturan: ' . $e->getMessage()]);
}
?>