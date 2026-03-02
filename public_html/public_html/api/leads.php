<?php
// api/leads.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

require_once 'db_connect_pdo.php'; // Gunakan koneksi PDO yang baru

$action = $_GET['action'] ?? '';

// --- 1. GET LEADS (LIST) ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
    if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
        http_response_code(401);
        echo json_encode(["message" => "Akses ditolak: Sesi tidak valid."]);
        exit;
    }
    $user_id = $_GET['user_id'];

    try {
        $stmtUser = $pdo->prepare("SELECT id, developer_id, role FROM users WHERE id = ?");
        $stmtUser->execute([$user_id]);
        $currentUser = $stmtUser->fetch();

        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(["message" => "User tidak valid"]);
            exit;
        }

        $developer_id = $currentUser['developer_id'];
        $role = $currentUser['role'];

        $sql = "";
        $params = [];

        if ($role === 'Super Admin') {
            $sql = "SELECT leads.*, developers.nama_perusahaan FROM leads JOIN developers ON leads.developer_id = developers.id ORDER BY leads.created_at DESC";
        } elseif ($role === 'Developer') {
            $sql = "SELECT * FROM leads WHERE developer_id = ? ORDER BY created_at DESC";
            $params[] = $developer_id;
        } elseif ($role === 'Admin CS' || $role === 'Agent Freelance') {
            // Agent hanya bisa melihat lead miliknya sendiri
            $sql = "SELECT * FROM leads WHERE developer_id = ? AND owner_id = ? ORDER BY created_at DESC";
            $params[] = $developer_id;
            $params[] = $user_id;
        } else {
            echo json_encode([]);
            exit;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $leads = $stmt->fetchAll();

        foreach ($leads as &$row) {
            $row['isLocked'] = (bool)$row['is_locked'];
            // Tambahkan status kepemilikan untuk logika sensor data di frontend
            $row['owner'] = ($row['owner_id'] == $user_id) ? 'Self' : 'Other_Agent';
        }

        echo json_encode($leads);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Server Error: " . $e->getMessage()]);
    }
    exit;
}

// --- 2. CREATE LEAD ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $user_id = $_POST['user_id'] ?? 0;
    $name = $_POST['name'] ?? '';
    $nik = $_POST['nik'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $job = $_POST['job'] ?? '';
    $channel = $_POST['channel'] ?? '';
    $segment = $_POST['segment'] ?? '';

    if (empty($user_id) || empty($name) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["message" => "Sesi user, Nama, dan No HP wajib diisi"]);
        exit();
    }

    try {
        $stmtUser = $pdo->prepare("SELECT developer_id FROM users WHERE id = ?");
        $stmtUser->execute([$user_id]);
        $currentUser = $stmtUser->fetch();

        if (!$currentUser || !$currentUser['developer_id']) {
            http_response_code(403);
            echo json_encode(["message" => "User tidak terdaftar di perusahaan manapun."]);
            exit;
        }
        $developer_id = $currentUser['developer_id'];

        $stmt = $pdo->prepare("INSERT INTO leads (developer_id, owner_id, name, nik, phone, job, channel, segment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$developer_id, $user_id, $name, $nik, $phone, $job, $channel, $segment]);
        
        echo json_encode(["message" => "Lead berhasil ditambahkan", "id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Gagal menyimpan data: " . $e->getMessage()]);
    }
    exit;
}

// --- 3. UPDATE STATUS (DRAG & DROP) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_status') {
    $id = $_POST['id'] ?? 0;
    $status = $_POST['status'] ?? '';
    $isLocked = ($status === 'SURVEY') ? 1 : 0;

    try {
        $stmt = $pdo->prepare("UPDATE leads SET status = ?, is_locked = ? WHERE id = ?");
        $stmt->execute([$status, $isLocked, $id]);
        echo json_encode(["message" => "Status updated"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Update failed: " . $e->getMessage()]);
    }
    exit;
}
?>