export class MenuManagementComponent {
    constructor(elementId, menus) {
        this.container = document.getElementById(elementId);
        // Ambil semua menu, kecuali menu 'Menu Management' itu sendiri
        this.menus = menus.filter(m => m.id !== 'menu-management'); 
        this.roles = ['Agent Freelance', 'Admin CS', 'Developer', 'Super Admin'];
    }

    render() {
        this.container.innerHTML = this.renderTable();
        this.attachEventListeners();
    }

    renderTable() {
        const rows = this.menus.map(menu => {
            const checkboxes = this.roles.map(role => {
                // Cek apakah menu ini bisa diakses oleh role yang bersangkutan
                const hasAccess = menu.roles.includes(role) || menu.roles.includes('All');
                // Super Admin selalu punya akses dan tidak bisa diubah
                const isDisabled = role === 'Super Admin';
                return `
                    <td class="p-4 text-center">
                        <input type="checkbox" class="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" 
                               ${hasAccess ? 'checked' : ''} 
                               ${isDisabled ? 'disabled' : ''}>
                    </td>
                `;
            }).join('');

            return `
                <tr class="border-b hover:bg-slate-50/50 transition-colors">
                    <td class="p-4 font-medium text-slate-800 flex items-center">
                        <i data-lucide="${menu.icon}" class="w-4 h-4 mr-3 text-slate-400"></i>
                        <span>${menu.label}</span>
                    </td>
                    ${checkboxes}
                </tr>
            `;
        }).join('');

        return `
            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-md">
                <h2 class="text-xl font-black text-slate-800 uppercase tracking-wider">Menu Management</h2>
                <p class="text-sm text-slate-500 mt-1">Atur hak akses menu untuk setiap role. Perubahan akan aktif setelah user login ulang.</p>
                <div class="overflow-x-auto mt-6">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 text-xs text-slate-500 uppercase font-black tracking-wider">
                            <tr>
                                <th class="p-4">Nama Menu</th>
                                <th class="p-4 text-center">Agent Freelance</th>
                                <th class="p-4 text-center">Admin CS</th>
                                <th class="p-4 text-center">Developer</th>
                                <th class="p-4 text-center">Super Admin</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">${rows}</tbody>
                    </table>
                </div>
                <div class="mt-6 text-right">
                    <button id="save-menu-access" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-teal-700 transition-all active:scale-95">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Untuk saat ini, tombol simpan belum memiliki fungsi.
        // Ini bisa kita implementasikan di tahap selanjutnya.
        const saveButton = document.getElementById('save-menu-access');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                alert('Fungsi penyimpanan hak akses belum diimplementasikan.');
            });
        }
    }
}