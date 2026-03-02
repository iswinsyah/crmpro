<?php
// api/db_connect_pdo.php
// Koneksi Database menggunakan PDO (PHP Data Objects) untuk keamanan maksimal

$host = 'localhost';
$db   = 'u123456789_crmpro'; // Ganti dengan nama database Hostinger Anda
$user = 'u123456789_user';   // Ganti dengan user database Anda
$pass = 'PasswordDBAnda';    // Ganti dengan password database Anda
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Di production, jangan echo error detail ke publik
    http_response_code(500);
    echo json_encode(["error" => "Koneksi Database Gagal"]);
    exit;
}
?>