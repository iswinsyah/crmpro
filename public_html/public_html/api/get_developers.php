<?php
// api/get_developers.php
header("Content-Type: application/json");
require_once 'db_connect_pdo.php';

try {
    // Ambil semua developer yang aktif, kecuali MGO Pusat (id=1)
    $stmt = $pdo->query("SELECT id, nama_perusahaan FROM developers WHERE status_langganan = 'Active' AND id != 1 ORDER BY nama_perusahaan ASC");
    $developers = $stmt->fetchAll();
    echo json_encode($developers);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Gagal mengambil data developer"]);
}
?>