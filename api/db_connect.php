+ <?php
+ // api/db_connect.php
+ 
+ // --- GANTI DENGAN DETAIL DATABASE LOKAL (XAMPP) ANDA ---
+ // --- DETAIL DATABASE HOSTINGER ---
$host = 'localhost';
$dbname = 'u829486010_crmpro'; // Pastikan ini nama DB di Hostinger
$username = 'u829486010_crmpro';   // Pastikan ini User DB di Hostinger
$password = 'Khilafet@1924'; // Pastikan ini Password DB di Hostinger

+ try {
+     $conn = new mysqli($host, $username, $password, $dbname);
+     
+     if ($conn->connect_error) {
+         throw new Exception("Connection failed: " . $conn->connect_error);
+     }
+ } catch (Exception $e) {
+     http_response_code(500);
+     echo json_encode(["error" => "Database connection failed"]);
+     exit();
+ }
+ ?>