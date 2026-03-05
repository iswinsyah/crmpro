<?php
// PENTING: HAPUS FILE INI SETELAH SELESAI DIJALANKAN SEKALI!

require_once __DIR__ . '/api/db_connect_pdo.php';

try {
    echo "<h1>Memulai Inisialisasi Menu...</h1>";

    // 1. Hapus tabel lama jika ada, untuk memastikan data bersih
    $pdo->exec("DROP TABLE IF EXISTS app_menus");
    echo "<p>Tabel 'app_menus' lama (jika ada) berhasil dihapus.</p>";

    // 2. Buat struktur tabel baru
    $createTableSql = "
    CREATE TABLE `app_menus` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `menu_id` VARCHAR(50) NOT NULL UNIQUE,
      `label` VARCHAR(100) NOT NULL,
      `icon` VARCHAR(50) NOT NULL,
      `allowed_roles` JSON NOT NULL,
      `sort_order` INT DEFAULT 0
    );";
    $pdo->exec($createTableSql);
    echo "<p style='color: green;'>✅ Tabel 'app_menus' berhasil dibuat.</p>";

    // 3. Isi tabel dengan data menu default
    $menus = [
        [
            'menu_id' => 'dashboard', 'label' => 'Dashboard', 'icon' => 'layout-dashboard',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 1
        ],
        [
            'menu_id' => 'leads-management', 'label' => 'Leads Management', 'icon' => 'users',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 2
        ],
        [
            'menu_id' => 'impersonation', 'label' => 'Mode Penyamaran', 'icon' => 'log-in',
            'allowed_roles' => json_encode(['Super Admin']), 'sort_order' => 98
        ],
        [
            'menu_id' => 'menu-management', 'label' => 'Menu Management', 'icon' => 'settings-2',
            'allowed_roles' => json_encode(['Super Admin']), 'sort_order' => 99
        ]
    ];

    $stmt = $pdo->prepare(
        "INSERT INTO app_menus (menu_id, label, icon, allowed_roles, sort_order) VALUES (:menu_id, :label, :icon, :allowed_roles, :sort_order)"
    );

    foreach ($menus as $menu) {
        $stmt->execute($menu);
    }

    echo "<p style='color: green;'>✅ " . count($menus) . " menu default berhasil dimasukkan ke database.</p>";
    echo "<h2>SUKSES! Database menu sudah siap.</h2>";
    echo "<p style='color: red; font-weight: bold;'>Jangan lupa hapus file 'seed_menus.php' ini sekarang!</p>";

} catch (PDOException $e) {
    echo "<h3 style='color: red;'>Error Database: " . $e->getMessage() . "</h3>";
}
?>