+ <?php
+ // api/leads.php
+ header("Content-Type: application/json");
+ header("Access-Control-Allow-Origin: *");
+ header("Access-Control-Allow-Methods: GET, POST");
+ 
+ require_once 'db_connect.php';
+ 
+ $action = $_GET['action'] ?? '';
+ 
+ // --- 1. GET LEADS (LIST) ---
+ if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
+     $sql = "SELECT * FROM leads ORDER BY created_at DESC";
+     
+     $result = $conn->query($sql);
+     $leads = [];
+     
+     while ($row = $result->fetch_assoc()) {
+         $row['isLocked'] = (bool)$row['is_locked']; 
+         $leads[] = $row;
+     }
+     
+     echo json_encode($leads);
+     exit();
+ }
+ 
+ // --- 2. CREATE LEAD ---
+ if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
+     $name = $_POST['name'] ?? '';
+     $nik = $_POST['nik'] ?? '';
+     $phone = $_POST['phone'] ?? '';
+     $job = $_POST['job'] ?? '';
+     $channel = $_POST['channel'] ?? '';
+     $segment = $_POST['segment'] ?? '';
+     
+     if (empty($name) || empty($phone)) {
+         http_response_code(400);
+         echo json_encode(["message" => "Nama dan No HP wajib diisi"]);
+         exit();
+     }
+ 
+     $stmt = $conn->prepare("INSERT INTO leads (name, nik, phone, job, channel, segment, status, owner) VALUES (?, ?, ?, ?, ?, ?, 'NEW_LEAD', 'Self')");
+     $stmt->bind_param("ssssss", $name, $nik, $phone, $job, $channel, $segment);
+     
+     if ($stmt->execute()) {
+         echo json_encode(["message" => "Lead berhasil ditambahkan", "id" => $stmt->insert_id]);
+     } else {
+         http_response_code(500);
+         echo json_encode(["message" => "Gagal menyimpan data"]);
+     }
+     $stmt->close();
+     exit();
+ }
+ 
+ // --- 3. UPDATE STATUS (DRAG & DROP) ---
+ if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_status') {
+     $id = $_POST['id'] ?? 0;
+     $status = $_POST['status'] ?? '';
+     
+     $isLocked = ($status === 'SURVEY') ? 1 : 0;
+ 
+     $stmt = $conn->prepare("UPDATE leads SET status = ?, is_locked = ? WHERE id = ?");
+     $stmt->bind_param("sii", $status, $isLocked, $id);
+     
+     if ($stmt->execute()) {
+         echo json_encode(["message" => "Status updated"]);
+     } else {
+         http_response_code(500);
+         echo json_encode(["message" => "Update failed"]);
+     }
+     $stmt->close();
+     exit();
+ }
+ ?>