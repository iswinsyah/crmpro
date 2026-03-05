import { ApiService } from '../api.js';
import { UI } from '../ui.js';

export class SettingsComponent {
    constructor(containerId, state) {
        this.container = document.getElementById(containerId);
        this.state = state;
        this.ui = new UI();
        this.settingsData = null;
    }

    async render() {
        if (!this.container) return;
        this.container.innerHTML = this.ui.renderLoading('Memuat pengaturan...');

        try {
            // Hanya Developer atau Super Admin yang bisa akses
            const userRole = this.state.currentUser.role;
            if (userRole !== 'Developer' && userRole !== 'Super Admin') {
                this.container.innerHTML = this.ui.renderError('Hanya Developer atau Super Admin yang dapat mengakses halaman ini.');
                if (window.lucide) window.lucide.createIcons();
                return;
            }
            
            const developerId = this.state.currentUser.developer_id;
            this.settingsData = await ApiService.get(`get_developer_settings.php?developer_id=${developerId}`);
            
            this.container.innerHTML = this.renderForm();
            this.attachEventListeners();

        } catch (error) {
            this.container.innerHTML = this.ui.renderError(`Gagal memuat pengaturan: ${error.message}`);
            console.error(error);
            if (window.lucide) window.lucide.createIcons();
        }
    }

    renderForm() {
        const { app_name, notification_email, logo_url, maintenance_mode } = this.settingsData;
        const logoSrc = logo_url ? logo_url : 'https://via.placeholder.com/150/E2E8F0/94A3B8?text=Logo';
        const isMaintenanceOn = maintenance_mode == 1;

        return `
            <div class="max-w-3xl mx-auto space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-black text-slate-800 text-xl uppercase tracking-widest">System Settings</h3>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Konfigurasi Aplikasi Perusahaan Anda</p>
                    </div>
                </div>

                <form id="settings-form" class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div class="p-6 md:p-8 space-y-6">
                        <!-- Profile Section -->
                        <div class="flex items-center space-x-4 pb-6 border-b border-slate-100">
                            <img id="logo-preview" src="${logoSrc}" alt="Logo Perusahaan" class="w-16 h-16 rounded-full bg-slate-200 object-cover">
                            <div>
                                <h4 class="font-black text-slate-800 text-sm">Company Logo</h4>
                                <p class="text-[10px] text-slate-400 mb-2">Format: PNG, JPG (Max 2MB)</p>
                                <label for="logo-upload" class="cursor-pointer text-[9px] font-bold bg-slate-800 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-slate-700">
                                    Upload New
                                </label>
                                <input type="file" id="logo-upload" name="logo" class="hidden" accept="image/png, image/jpeg">
                            </div>
                        </div>

                        <!-- Form Settings -->
                        <div class="space-y-4">
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Aplikasi</label>
                                <input type="text" name="app_name" value="${app_name || ''}" class="w-full bg-slate-50 border p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Notifikasi</label>
                                <input type="email" name="notification_email" value="${notification_email || ''}" class="w-full bg-slate-50 border p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500">
                            </div>
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <h5 class="font-bold text-slate-800 text-xs">Maintenance Mode</h5>
                                    <p class="text-[9px] text-slate-400">Matikan akses untuk user non-admin</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="maintenance_mode" class="sr-only peer" ${isMaintenanceOn ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-slate-50 border-t border-slate-100 text-right">
                        <button type="submit" id="btn-save-settings" class="bg-teal-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 shadow-lg transition-all">Save Changes</button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners() {
        if (window.lucide) window.lucide.createIcons();

        const form = document.getElementById('settings-form');
        if (form) {
            form.addEventListener('submit', (e) => this.saveChanges(e));
        }

        const logoUpload = document.getElementById('logo-upload');
        if (logoUpload) {
            logoUpload.addEventListener('change', (e) => this.previewLogo(e));
        }
    }
    
    previewLogo(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('logo-preview');
                preview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    }

    async saveChanges(event) {
        event.preventDefault();
        const saveButton = document.getElementById('btn-save-settings');
        const originalText = saveButton.innerText;
        saveButton.innerText = 'Menyimpan...';
        saveButton.disabled = true;

        const form = document.getElementById('settings-form');
        const formData = new FormData(form);
        
        formData.append('user_id', this.state.currentUser.id);
        formData.append('developer_id', this.state.currentUser.developer_id);
        formData.append('existing_logo_url', this.settingsData.logo_url || '');

        try {
            const response = await fetch(`${ApiService.BASE_URL}/save_developer_settings.php`, {
                method: 'POST',
                body: formData
            });

            const result = await ApiService.handleResponse(response);
            
            if (result.new_logo_url) {
                this.settingsData.logo_url = result.new_logo_url;
            }

            this.ui.showToast(result.message, 'success');

        } catch (error) {
            this.ui.showToast(`Gagal menyimpan: ${error.message}`, 'error');
        } finally {
            saveButton.innerText = originalText;
            saveButton.disabled = false;
        }
    }
}