import { maskInfo } from './helpers.js';
import { ApiService } from './api.js';

export class UI {
    constructor() {
        this.els = {
            sidebar: document.getElementById('sidebar'),
            mobileOverlay: document.getElementById('mobile-overlay'),
            modalContainer: document.getElementById('modal-container'),
            drawerContainer: document.getElementById('drawer-container'),
        };
    }

    toggleSidebar(forceState = null) {
        const isOpen = forceState !== null 
            ? forceState 
            : this.els.sidebar.classList.contains('-translate-x-full');

        if (isOpen) {
            this.els.sidebar.classList.remove('-translate-x-full');
            this.els.mobileOverlay.classList.remove('hidden');
        } else {
            this.els.sidebar.classList.add('-translate-x-full');
            this.els.mobileOverlay.classList.add('hidden');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    showToast(message, type = 'success') {
        alert(`[${type.toUpperCase()}] ${message}`);
    }

    renderLoading(message = 'Memuat...') {
        return `
            <div class="p-10 text-center text-slate-500 animate-pulse">
                <i data-lucide="loader-2" class="w-8 h-8 mx-auto animate-spin"></i>
                <p class="mt-4 text-sm font-bold">${message}</p>
            </div>
        `;
    }

    renderError(message = 'Terjadi kesalahan.') {
        return `
            <div class="p-10 text-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
                <i data-lucide="alert-triangle" class="w-8 h-8 mx-auto"></i>
                <p class="mt-4 text-sm font-bold">${message}</p>
            </div>
        `;
    }

    openDrawer(lead, currentRole) {
        // Cek otorisasi lebih robust
        const user = JSON.parse(localStorage.getItem('mgo_user')) || {};
        const isOwner = lead.owner === 'Self' || lead.owner_id == user.id;
        const isAuthorized = (currentRole === 'Developer' || currentRole === 'Super Admin' || currentRole.includes('Super Admin') || isOwner);
        
        const drawerHTML = `
        <div id="leadDetailModal" class="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm">
            <div class="w-[85%] sm:w-[480px] bg-white h-full shadow-2xl overflow-y-auto p-6 md:p-10 border-l relative flex flex-col animate-in slide-in-from-right-8">
                <div class="flex justify-between items-center mb-6 md:mb-8 shrink-0">
                    <button id="btn-close-drawer" class="p-2 hover:bg-slate-100 rounded-full bg-slate-50"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="space-y-6 md:space-y-8 flex-1">
                    <div>
                        <h3 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter leading-none uppercase">${lead.name}</h3>
                        <p class="text-[9px] md:text-[10px] font-bold text-teal-600 uppercase tracking-widest italic tracking-tighter mt-2">${lead.segment || 'Umum'}</p>
                        <div class="mt-4 md:mt-6 space-y-2 md:space-y-3">
                            <div class="flex items-center p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 shadow-inner">
                                <i data-lucide="fingerprint" class="w-4 h-4 text-teal-600 mr-3 shrink-0"></i>
                                <span class="text-xs md:text-sm font-black text-slate-600 tracking-widest break-all">${maskInfo(lead.nik, lead.owner, currentRole, 'nik')}</span>
                            </div>
                            <div class="flex items-center p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 shadow-inner">
                                <i data-lucide="phone" class="w-4 h-4 text-teal-600 mr-3 shrink-0"></i>
                                <span class="text-xs md:text-sm font-black text-slate-600 tracking-widest break-all">${maskInfo(lead.phone, lead.owner, currentRole, 'phone')}</span>
                            </div>
                            <div class="grid grid-cols-2 gap-3 md:gap-4 mt-4">
                                <div class="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 shadow-inner"><p class="text-[8px] font-black text-slate-400 uppercase mb-1 leading-none">Pekerjaan</p><p class="text-[10px] md:text-xs font-black text-slate-800 truncate">${lead.job || "-"}</p></div>
                                <div class="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 shadow-inner"><p class="text-[8px] font-black text-slate-400 uppercase mb-1 leading-none">Status</p><p class="text-[10px] md:text-xs font-black text-slate-800 truncate">${lead.status.replace('_', ' ')}</p></div>
                            </div>
                        </div>
                    </div>
                    ${isAuthorized ? `
                        <div class="space-y-3 md:space-y-4 mt-6 md:mt-8">
                            <div class="p-4 md:p-6 bg-teal-50 rounded-[1.5rem] md:rounded-[2.5rem] border border-teal-100 italic">
                                <p class="text-[9px] md:text-[10px] font-black text-teal-600 uppercase mb-1 flex items-center"><i data-lucide="shield-check" class="w-3.5 h-3.5 mr-2"></i> Data Verified</p>
                                <p class="text-[10px] md:text-[11px] font-medium text-teal-800 leading-relaxed">Anda memiliki akses penuh untuk follow-up data ini.</p>
                            </div>
                            ${lead.phone ? `<a href="https://wa.me/${lead.phone.replace(/^0/, '62')}" target="_blank" class="w-full py-4 md:py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all flex justify-center items-center"><i data-lucide="message-circle" class="w-4 h-4 mr-2"></i> Chat WhatsApp Sekarang</a>` : `<div class="w-full py-4 md:py-5 bg-slate-100 text-slate-400 rounded-xl md:rounded-2xl font-black text-[10px] uppercase flex justify-center items-center cursor-not-allowed"><i data-lucide="message-circle-off" class="w-4 h-4 mr-2"></i> No WhatsApp Available</div>`}
                            
                            <button id="btn-delete-lead" data-id="${lead.id}" class="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-black text-[10px] uppercase transition-all flex justify-center items-center mt-2">
                                <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i> Hapus Data Lead
                            </button>
                        </div>
                    ` : `
                        <div class="p-6 md:p-8 bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-2xl space-y-4 border border-white/5 mt-6 md:mt-8">
                            <i data-lucide="shield-question" class="w-6 h-6 md:w-8 md:h-8 text-orange-500"></i>
                            <h4 class="text-xs md:text-sm font-black uppercase tracking-widest leading-none">Protected Data</h4>
                            <p class="text-[10px] md:text-xs text-slate-400 italic leading-relaxed">Data ini dimiliki oleh rekan tim lain. Detail disensor untuk menjaga privasi.</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
        `;

        this.els.drawerContainer.innerHTML = drawerHTML;
        
        document.getElementById('btn-close-drawer').addEventListener('click', () => {
            this.els.drawerContainer.innerHTML = '';
        });

        const btnDelete = document.getElementById('btn-delete-lead');
        if (btnDelete) {
            btnDelete.addEventListener('click', async () => {
                if (confirm('PERINGATAN: Data lead ini akan dihapus permanen. Lanjutkan?')) {
                    try {
                        // Kita butuh user ID, ambil dari localStorage karena UI tidak punya state
                        const user = JSON.parse(localStorage.getItem('mgo_user'));
                        await ApiService.deleteLead(lead.id, user.id);
                        
                        this.showToast('Lead berhasil dihapus.');
                        this.els.drawerContainer.innerHTML = ''; // Tutup drawer
                        document.dispatchEvent(new CustomEvent('lead-deleted')); // Kabari main.js untuk refresh
                    } catch (error) {
                        this.showToast('Gagal menghapus: ' + error.message, 'error');
                    }
                }
            });
        }

        if(window.lucide) window.lucide.createIcons();
    }
}