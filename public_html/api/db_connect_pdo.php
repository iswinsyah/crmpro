<?php
// api/db_connect_pdo.php
$host = 'localhost';
$dbname = 'u829486010_crmpro'; // GANTI DENGAN NAMA DATABASE ASLI DI HOSTINGER
$username = 'u829486010_crmpro'; // GANTI DENGAN USERNAME DATABASE ASLI
$password = 'Khilafet@1924'; // GANTI DENGAN PASSWORD DATABASE ASLI

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Koneksi Database Gagal: " . $e->getMessage());
}
?>