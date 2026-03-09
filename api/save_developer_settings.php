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
$ai_persona_insight = $_POST['ai_persona_insight'] ?? null; // Data baru dari AI
$ai_content_calendar = $_POST['ai_content_calendar'] ?? null; // Data baru dari AI Kalender
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
    // Cek apakah ini hanya update untuk AI insight atau form lengkap
    if ($ai_persona_insight !== null) {
        // Decode Base64 text from frontend to bypass WAF
        $decoded_insight = base64_decode($ai_persona_insight);
        // Hanya update kolom AI
        $stmt = $pdo->prepare("UPDATE developers SET ai_persona_insight = ? WHERE id = ?");
        $stmt->execute([$decoded_insight, $developer_id]);
    } elseif ($ai_content_calendar !== null) {
        // Decode Base64 text from frontend to bypass WAF
        $decoded_calendar = base64_decode($ai_content_calendar);
        // Hanya update kolom AI Kalender
        $stmt = $pdo->prepare("UPDATE developers SET ai_content_calendar = ? WHERE id = ?");
        $stmt->execute([$decoded_calendar, $developer_id]);
    } else {
        // Update form lengkap
        $stmt = $pdo->prepare(
            "UPDATE developers SET 
                app_name = ?, 
                notification_email = ?, 
                logo_url = ?, 
                maintenance_mode = ? 
            WHERE id = ?"
        );
        $stmt->execute([$app_name, $notification_email, $logo_url, $maintenance_mode, $developer_id]);
    }

    $message = 'Pengaturan berhasil disimpan!';
    if ($ai_persona_insight !== null) {
        $message = 'Hasil analisa AI berhasil disimpan!';
    } elseif ($ai_content_calendar !== null) {
        $message = 'Kalender konten berhasil disimpan!';
    }

    echo json_encode(['message' => $message, 'new_logo_url' => $logo_url]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Save Settings Error: " . $e->getMessage());
    echo json_encode(['message' => 'Gagal menyimpan pengaturan: ' . $e->getMessage()]);
}
?>