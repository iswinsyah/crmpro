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
        // Kategori 1: Strategy & Overview (sort_order 1x)
        [
            'menu_id' => 'portfolio', 'label' => 'Global Portfolio', 'icon' => 'globe',
            'allowed_roles' => json_encode(['Super Admin', 'Developer']), 'sort_order' => 10
        ],
        [
            'menu_id' => 'validation', 'label' => 'Validasi Pendaftar', 'icon' => 'check-shield',
            'allowed_roles' => json_encode(['Super Admin']), 'sort_order' => 11
        ],
        [
            'menu_id' => 'client-management', 'label' => 'Client Management', 'icon' => 'building-2',
            'allowed_roles' => json_encode(['Super Admin']), 'sort_order' => 12
        ],
        
        // Kategori 2: Operational Area (sort_order 2x)
        [
            'menu_id' => 'pipeline', 'label' => 'Lead & Pipeline', 'icon' => 'layout-dashboard',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 20
        ],
        [
            'menu_id' => 'reminder-followup', 'label' => 'Reminder Followup', 'icon' => 'bell-ring',
            'allowed_roles' => json_encode(['Admin CS', 'Agent Freelance', 'Super Admin']), 'sort_order' => 21
        ],
        [
            'menu_id' => 'reporting', 'label' => 'Weekly Report', 'icon' => 'file-bar-chart',
            'allowed_roles' => json_encode(['Developer', 'Admin CS', 'Super Admin']), 'sort_order' => 22
        ],
        
        // Kategori 3: Productivity Tools (sort_order 3x)
        [
            'menu_id' => 'tasks', 'label' => 'Task Management', 'icon' => 'check-square',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 30
        ],
        [
            'menu_id' => 'calendar', 'label' => 'Calendar', 'icon' => 'calendar',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 31
        ],

        // Kategori 4: AI Assistants (sort_order 4x)
        [
            'menu_id' => 'ai-lead', 'label' => 'Lead Analyzer', 'icon' => 'brain-circuit',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 40
        ],
        [
            'menu_id' => 'ai-creative', 'label' => 'Creative Suite', 'icon' => 'sparkles',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 41
        ],
        [
            'menu_id' => 'ai-objection', 'label' => 'Objection Gen', 'icon' => 'shield-alert',
            'allowed_roles' => json_encode(['All']), 'sort_order' => 42
        ],
        
        // Kategori 5: Strategy & Setup (sort_order 5x)
        [
            'menu_id' => 'persona', 'label' => 'Persona Insight', 'icon' => 'user-check',
            'allowed_roles' => json_encode(['Developer', 'Admin CS', 'Super Admin']), 'sort_order' => 50
        ],
        [
            'menu_id' => 'ai-engine', 'label' => 'AI Engine Config', 'icon' => 'database',
            'allowed_roles' => json_encode(['Developer', 'Super Admin']), 'sort_order' => 51
        ],
        [
            'menu_id' => 'menu-management', 'label' => 'Menu Management', 'icon' => 'list-checks',
            'allowed_roles' => json_encode(['Super Admin']), 'sort_order' => 98
        ],
        [
            'menu_id' => 'impersonation', 'label' => 'Mode Penyamaran', 'icon' => 'user-cog',
            'allowed_roles' => json_encode(['Super Admin']), 'sort_order' => 99
        ],
        [
            'menu_id' => 'settings', 'label' => 'Settings', 'icon' => 'settings',
            'allowed_roles' => json_encode(['Developer', 'Super Admin']), 'sort_order' => 100
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