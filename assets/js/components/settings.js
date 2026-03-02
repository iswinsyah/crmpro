export class SettingsComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="max-w-3xl mx-auto space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-black text-slate-800 text-xl uppercase tracking-widest">System Settings</h3>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Konfigurasi Aplikasi</p>
                    </div>
                </div>

                <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div class="flex border-b border-slate-100">
                        <button class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-teal-600 border-b-2 border-teal-600 bg-teal-50/50">General</button>
                        <button class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50">User Management</button>
                        <button class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50">Integrations</button>
                    </div>
                    
                    <div class="p-6 md:p-8 space-y-6">
                        <!-- Profile Section -->
                        <div class="flex items-center space-x-4 pb-6 border-b border-slate-100">
                            <div class="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                <i data-lucide="camera" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h4 class="font-black text-slate-800 text-sm">Company Logo</h4>
                                <p class="text-[10px] text-slate-400 mb-2">Format: PNG, JPG (Max 2MB)</p>
                                <button class="text-[9px] font-bold bg-slate-800 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider">Upload New</button>
                            </div>
                        </div>

                        <!-- Form Settings -->
                        <div class="space-y-4">
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Aplikasi</label>
                                <input type="text" value="CRM PRO - Property Syariah" class="w-full bg-slate-50 border p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Notifikasi</label>
                                <input type="email" value="admin@villaquran.com" class="w-full bg-slate-50 border p-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500">
                            </div>
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <h5 class="font-bold text-slate-800 text-xs">Maintenance Mode</h5>
                                    <p class="text-[9px] text-slate-400">Matikan akses untuk user non-admin</p>
                                </div>
                                <div class="w-10 h-5 bg-slate-300 rounded-full relative cursor-pointer">
                                    <div class="w-3 h-3 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-slate-50 border-t border-slate-100 text-right">
                        <button class="bg-teal-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 shadow-lg transition-all">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        
        if (window.lucide) window.lucide.createIcons();
    }
}