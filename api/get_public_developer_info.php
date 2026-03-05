<?php
// api/get_public_developer_info.php
header("Content-Type: application/json");
require_once 'db_connect_pdo.php';

$developer_id = $_GET['id'] ?? null;

if (!$developer_id) {
    http_response_code(400);
    echo json_encode(['message' => 'Referral ID tidak valid.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT nama_perusahaan, app_name, logo_url FROM developers WHERE id = ? AND status_langganan = 'Active'");
    $stmt->execute([$developer_id]);
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$info) {
        http_response_code(404);
        echo json_encode(['message' => 'Developer tidak ditemukan atau tidak aktif.']);
        exit;
    }
    
    if (empty($info['app_name'])) {
        $info['app_name'] = $info['nama_perusahaan'];
    }

    echo json_encode($info);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Get Public Dev Info Error: " . $e->getMessage());
    echo json_encode(['message' => 'Gagal memuat informasi developer.']);
}
?>