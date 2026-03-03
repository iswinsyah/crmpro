<?php
// PENTING: HAPUS FILE INI SETELAH SELESAI DIGUNAKAN!

// Pastikan path ini benar. Jika error, coba hapus '/api' atau sesuaikan.
if (file_exists(__DIR__ . '/api/db_connect_pdo.php')) {
    require_once __DIR__ . '/api/db_connect_pdo.php';
} else {
    // Fallback jika file ada di root
    require_once __DIR__ . '/db_connect_pdo.php';
}

// --- EDIT DATA ADMIN DI BAWAH INI ---
$admins = [
    [
        'username' => 'winsyah', // Ganti dengan username Anda
        'nama_user' => 'Winsyah',
        'password' => 'Khilafet@1924', // Password Baru Anda
        'role' => 'Super Admin'
    ],
    [
        'username' => 'civic', // Ganti dengan username teman Anda
        'nama_user' => 'Civic',
        'password' => '12345678', // GANTI dengan password teman Anda
        'role' => 'Super Admin'
    ]
];
// ------------------------------------

echo "<h1>Memulai Reset Password (PAKSA)...</h1>";

try {
    // Query Sakti: Insert data, tapi kalau username sudah ada, UPDATE password-nya!
    $sql = "INSERT INTO users (username, nama_user, password, role) 
            VALUES (:username, :nama_user, :password, :role)
            ON DUPLICATE KEY UPDATE 
            nama_user = VALUES(nama_user),
            password = VALUES(password),
            role = VALUES(role)";
            
    $stmt = $pdo->prepare($sql);

    foreach ($admins as $admin) {
        $hashed_password = password_hash(trim($admin['password']), PASSWORD_DEFAULT);
        
        $stmt->execute([
            'username' => $admin['username'],
            'nama_user' => $admin['nama_user'],
            'password' => $hashed_password,
            'role' => $admin['role']
        ]);
        
        echo "<p style='color: green; font-size: 18px;'>✅ User <b>{$admin['username']}</b> berhasil di-update. Password: <b>{$admin['password']}</b></p>";
    }
    echo "<h2>SUKSES! Silakan Login sekarang.</h2>";

} catch (PDOException $e) {
    echo "<h3 style='color: red;'>Error Database: " . $e->getMessage() . "</h3>";
}
?>