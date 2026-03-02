<?php
// PENTING: HAPUS FILE INI SETELAH SELESAI DIGUNAKAN!

require_once __DIR__ . '/api/db_connect_pdo.php';

// --- EDIT DATA ADMIN DI BAWAH INI ---
$admins = [
    [
        'username' => 'winsyah', // Ganti dengan username Anda
        'nama_user' => 'Winsyah', // Nama Lengkap Anda
        'password' => 'Khilafet@1924', // Password Anda (Pastikan sama persis)
        'role' => 'Super Admin'
    ],
    [
        'username' => 'civic', // Ganti dengan username teman Anda
        'nama_user' => 'Civic', // Nama Lengkap Teman Anda
        'password' => '12345678', // GANTI dengan password teman Anda
        'role' => 'Super Admin'
    ]
];
// ------------------------------------

echo "<h1>Memulai Pendaftaran Super Admin...</h1>";

$sql = "INSERT INTO users (username, nama_user, password, role) VALUES (:username, :nama_user, :password, :role)";
$stmt = $pdo->prepare($sql);

foreach ($admins as $admin) {
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
    $checkStmt->execute(['username' => $admin['username']]);
    $hashed_password = password_hash(trim($admin['password']), PASSWORD_DEFAULT); // Trim password sebelum hash

    if ($checkStmt->fetch()) {
        // Update jika user sudah ada (untuk reset password)
        $updateStmt = $pdo->prepare("UPDATE users SET nama_user = :nama_user, password = :password, role = :role WHERE username = :username");
        $updateStmt->execute(['username' => $admin['username'], 'nama_user' => $admin['nama_user'], 'password' => $hashed_password, 'role' => $admin['role']]);
        echo "<p style='color: blue;'>User '{$admin['username']}' sudah ada. Password diperbarui!</p>";
    } else {
        // Insert baru
        $stmt->execute(['username' => $admin['username'], 'nama_user' => $admin['nama_user'], 'password' => $hashed_password, 'role' => $admin['role']]);
        echo "<p style='color: green;'>User '{$admin['username']}' berhasil didaftarkan sebagai Super Admin!</p>";
    }
}

echo "<h2>Proses Selesai.</h2>";
echo "<p style='color:red; font-weight:bold;'>SANGAT PENTING: Segera HAPUS file ini (seed_admins.php) dari server Anda sekarang juga demi keamanan!</p>";
?>