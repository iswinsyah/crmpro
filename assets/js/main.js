import { ApiService } from './api.js';
import { UI } from './ui.js';
import { PipelineComponent } from './components/pipeline.js';
import { PortfolioComponent } from './components/portfolio.js';
import { ReportingComponent } from './components/reporting.js';
import { ClientManagementComponent } from './components/client_management.js';
import { ReminderFollowupComponent } from './components/reminder.js';
import { LeadAnalyzerComponent, CreativeSuiteComponent, ObjectionGenComponent, PersonaInsightComponent, AiEngineConfigComponent } from './components/ai_features.js';
import { TasksComponent } from './components/tasks.js';
import { CalendarComponent } from './components/calendar.js';
import { ValidationComponent } from './components/validation.js';
import { MenuManagementComponent } from './components/menu_management.js';
import { ImpersonationComponent } from './components/impersonation.js';
import { SettingsComponent } from './components/settings.js';

// --- Cek Sesi Login ---
const loggedInUser = JSON.parse(localStorage.getItem('mgo_user'));
if (!loggedInUser) {
    window.location.href = 'login.html';
} else {
    const state = {
        currentUser: loggedInUser,
        currentRole: loggedInUser.role, // Ambil role dari data login
        currentTab: 'pipeline',
        leads: []
    };

    const menus = [
        // Kategori 1: Strategy & Overview
        { id: 'portfolio', icon: 'globe', label: 'Global Portfolio', roles: ['Super Admin', 'Developer'], category: 'Strategy & Overview' },
        { id: 'validation', icon: 'check-shield', label: 'Validasi Pendaftar', roles: ['Super Admin'], category: 'Strategy & Overview' },
        { id: 'client-management', icon: 'building-2', label: 'Client Management', roles: ['Super Admin'], category: 'Strategy & Overview' },
        
        // Kategori 2: Operational Area
        { id: 'pipeline', icon: 'layout-dashboard', label: 'Lead & Pipeline', roles: ['All'], category: 'Operational Area' },
        { id: 'reminder-followup', icon: 'bell-ring', label: 'Reminder Followup', roles: ['Admin CS', 'Agent Freelance', 'Super Admin'], category: 'Operational Area' },
        { id: 'reporting', icon: 'file-bar-chart', label: 'Weekly Report', roles: ['Developer', 'Admin CS', 'Super Admin'], category: 'Operational Area' },
        
        // Kategori 3: Productivity Tools
        { id: 'tasks', icon: 'check-square', label: 'Task Management', roles: ['All'], category: 'Productivity Tools' },
        { id: 'calendar', icon: 'calendar', label: 'Calendar', roles: ['All'], category: 'Productivity Tools' },

        // Kategori 4: AI Assistants
        { id: 'ai-lead', icon: 'brain-circuit', label: 'Lead Analyzer', roles: ['All'], category: 'AI Assistants' },
        { id: 'ai-creative', icon: 'sparkles', label: 'Creative Suite', roles: ['All'], category: 'AI Assistants' },
        { id: 'ai-objection', icon: 'shield-alert', label: 'Objection Gen', roles: ['All'], category: 'AI Assistants' },
        
        // Kategori 5: Strategy & Setup
        { id: 'persona', icon: 'user-check', label: 'Persona Insight', roles: ['Developer', 'Admin CS', 'Super Admin'], category: 'Strategy & Setup' },
        { id: 'ai-engine', icon: 'database', label: 'AI Engine Config', roles: ['Developer', 'Super Admin'], category: 'Strategy & Setup' },
        { id: 'menu-management', icon: 'list-checks', label: 'Menu Management', roles: ['Super Admin'], category: 'Strategy & Setup' },
        { id: 'impersonation', icon: 'user-cog', label: 'Mode Penyamaran', roles: ['Super Admin'], category: 'Strategy & Setup' },
        { id: 'settings', icon: 'settings', label: 'Settings', roles: ['Developer', 'Super Admin'], category: 'Strategy & Setup' },
    ];

    const ui = new UI();
    let pipelineComponent = null;
    let portfolioComponent = null;
    let reportingComponent = null;
    let clientManagementComponent = null;
    let reminderFollowupComponent = null;
    let leadAnalyzerComponent = null;
    let creativeSuiteComponent = null;
    let objectionGenComponent = null;
    let personaInsightComponent = null;
    let aiEngineConfigComponent = null;
    let tasksComponent = null;
    let calendarComponent = null;
    let settingsComponent = null;
    let validationComponent = null;
    let menuManagementComponent = null;
    let impersonationComponent = null;

    document.addEventListener('DOMContentLoaded', async () => {
        checkImpersonation();
        setupUserUI();
        console.log("MCS Master: Memulai aplikasi...");
        try {
            setupEventListeners();
            await refreshData();
            renderSidebar();
            switchTab('pipeline');
            console.log("MCS Master: Aplikasi siap digunakan!");
        } catch (error) {
            console.error("MCS Master Error:", error);
        }
    });

    function checkImpersonation() {
        const superAdminSession = localStorage.getItem('mgo_super_admin_session');
        if (superAdminSession) {
            const banner = document.createElement('div');
            banner.className = 'bg-orange-500 text-white text-xs font-bold p-2 text-center fixed top-0 left-0 right-0 z-[200]';
            banner.innerHTML = `
                Anda sedang login sebagai <strong>${state.currentUser.nama_user}</strong>. 
                <button id="exit-impersonation" class="ml-4 font-black underline hover:text-orange-200">Kembali ke Akun Super Admin</button>
            `;
            document.body.prepend(banner);
            document.body.style.paddingTop = '32px';

            document.getElementById('exit-impersonation').addEventListener('click', () => {
                if (confirm('Apakah Anda yakin ingin kembali ke akun Super Admin?')) {
                    localStorage.setItem('mgo_user', superAdminSession);
                    localStorage.removeItem('mgo_super_admin_session');
                    window.location.href = 'index.php';
                }
            });
        }
    }

    async function refreshData() {
        try {
            // Kirim user_id yang sedang login ke API
            state.leads = await ApiService.getLeads(state.currentUser.id, state.currentRole);
        } catch (error) {
            console.error("Gagal memuat data:", error);
            ui.showToast("Gagal memuat data leads", "error");
        }
    }

    function setupEventListeners() {
        document.getElementById('btn-open-sidebar').addEventListener('click', () => ui.toggleSidebar(true));
        document.getElementById('btn-close-sidebar').addEventListener('click', () => ui.toggleSidebar(false));
        document.getElementById('mobile-overlay').addEventListener('click', () => ui.toggleSidebar(false));
        document.getElementById('btn-logout').addEventListener('click', logout);
        document.getElementById('btn-add-lead').addEventListener('click', () => {
            injectAddLeadModal();
            ui.openModal('addLeadModal');
        });
        document.addEventListener('lead-selected', (e) => {
            ui.openDrawer(e.detail, state.currentRole);
        });
    }

    function setupUserUI() {
        document.getElementById('role-display').innerText = state.currentUser.role || 'N/A';
        document.getElementById('role-initial').innerText = state.currentUser.nama_user ? state.currentUser.nama_user.charAt(0) : '?';
        document.getElementById('header-role-text').innerText = state.currentUser.nama_user || 'User';
    }

    function logout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('mgo_user');
            window.location.href = 'login.html';
        }
    }

    function injectAddLeadModal() {
        if(document.getElementById('addLeadModal')) return;

        const modalHTML = `
            <div id="addLeadModal" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md hidden p-4">
                <div class="bg-white w-full max-w-3xl rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in">
                    <div class="bg-teal-950 p-5 md:p-8 text-white flex justify-between items-center shrink-0">
                        <div>
                            <h3 class="text-base md:text-xl font-black uppercase tracking-tighter leading-none">Registrasi Prospek Baru</h3>
                            <p class="text-[8px] md:text-[10px] text-teal-400 font-bold uppercase mt-2 italic tracking-widest leading-none">Native API Connection Ready</p>
                        </div>
                        <button type="button" id="btn-close-modal" class="p-2 md:p-3 hover:bg-white/10 rounded-xl transition-all"><i data-lucide="x" class="w-4 h-4 md:w-5 md:h-5"></i></button>
                    </div>
                    <form id="addLeadForm" class="p-5 md:p-8 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1 md:space-y-2"><label class="text-[9px] font-black text-slate-400 uppercase pl-1 tracking-widest">Nama Lengkap</label><input required name="name" type="text" class="w-full bg-slate-50 border p-3 md:p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500" /></div>
                            <div class="space-y-1 md:space-y-2"><label class="text-[9px] font-black text-slate-400 uppercase pl-1 tracking-widest">NIK (16 Digit)</label><input required name="nik" type="text" maxlength="16" class="w-full bg-slate-50 border p-3 md:p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500" /></div>
                            <div class="space-y-1 md:space-y-2"><label class="text-[9px] font-black text-slate-400 uppercase pl-1 tracking-widest">WhatsApp</label><input required name="phone" type="tel" class="w-full bg-slate-50 border p-3 md:p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500" /></div>
                            <div class="space-y-1 md:space-y-2"><label class="text-[9px] font-black text-slate-400 uppercase pl-1 tracking-widest">Pekerjaan</label><input name="job" type="text" class="w-full bg-slate-50 border p-3 md:p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500" /></div>
                            <div class="space-y-1 md:space-y-2"><label class="text-[9px] font-black text-slate-400 uppercase pl-1 tracking-widest">Media Masuk</label>
                                <select name="channel" class="w-full bg-slate-50 border p-3 md:p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500">
                                    <option value="FB Ads">FB Ads</option><option value="Instagram">Instagram</option><option value="TikTok">TikTok</option><option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div class="space-y-1 md:space-y-2"><label class="text-[9px] font-black text-slate-400 uppercase pl-1 tracking-widest">Segmen Prospek</label>
                                <select name="segment" class="w-full bg-slate-50 border p-3 md:p-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500">
                                    <option value="Karyawan Mapan">Karyawan Mapan</option><option value="Investor Produktif">Investor Produktif</option><option value="Orang Tua Mahasiswa">Orang Tua Mahasiswa</option><option value="Fresh Married">Fresh Married</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex space-x-3 pt-4 shrink-0">
                            <button type="button" id="btn-cancel-modal" class="flex-1 py-3 md:py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest">Batal</button>
                            <button type="submit" class="flex-2 w-full py-3 md:py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black text-[10px] uppercase shadow-xl transition-all tracking-widest">Daftarkan Lead</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').innerHTML = modalHTML;
        
        document.getElementById('btn-close-modal').addEventListener('click', () => ui.closeModal('addLeadModal'));
        document.getElementById('btn-cancel-modal').addEventListener('click', () => ui.closeModal('addLeadModal'));
        
        document.getElementById('addLeadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = e.target.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerText;
            
            try {
                btnSubmit.innerText = "Menyimpan...";
                btnSubmit.disabled = true;

                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());

                await ApiService.createLead(data, state.currentUser.id);
                
                ui.showToast("Lead berhasil didaftarkan!");
                ui.closeModal('addLeadModal');
                e.target.reset();

                await refreshData();
                if (state.currentTab === 'pipeline' && pipelineComponent) {
                    pipelineComponent.render();
                }

            } catch (error) {
                console.error(error);
                ui.showToast("Gagal menyimpan lead: " + error.message, "error");
            } finally {
                btnSubmit.innerText = originalText;
                btnSubmit.disabled = false;
            }
        });
        
        if(window.lucide) window.lucide.createIcons();
    }

    function switchTab(tabId) {
        state.currentTab = tabId;
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '';

        if (tabId === 'pipeline') {
            mainContent.innerHTML = `<section id="tab-pipeline" class="h-full flex overflow-x-auto hide-scroll space-x-4 md:space-x-6 pb-4 animate-in snap-x"></section>`;
            pipelineComponent = new PipelineComponent('tab-pipeline', state);
            pipelineComponent.render();
        } else if (tabId === 'portfolio') {
            mainContent.innerHTML = `<section id="tab-portfolio" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            portfolioComponent = new PortfolioComponent('tab-portfolio', state);
            portfolioComponent.render();
        } else if (tabId === 'client-management') {
            mainContent.innerHTML = `<section id="tab-client-management" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            clientManagementComponent = new ClientManagementComponent('tab-client-management');
            clientManagementComponent.render();
        } else if (tabId === 'reminder-followup') {
            mainContent.innerHTML = `<section id="tab-reminder-followup" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            reminderFollowupComponent = new ReminderFollowupComponent('tab-reminder-followup');
            reminderFollowupComponent.render();
        } else if (tabId === 'reporting') {
            mainContent.innerHTML = `<section id="tab-reporting" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            reportingComponent = new ReportingComponent('tab-reporting', state);
            reportingComponent.render();
        } else if (tabId === 'ai-lead') {
            mainContent.innerHTML = `<section id="tab-ai-lead" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            leadAnalyzerComponent = new LeadAnalyzerComponent('tab-ai-lead');
            leadAnalyzerComponent.render();
        } else if (tabId === 'ai-creative') {
            mainContent.innerHTML = `<section id="tab-ai-creative" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            creativeSuiteComponent = new CreativeSuiteComponent('tab-ai-creative');
            creativeSuiteComponent.render();
        } else if (tabId === 'ai-objection') {
            mainContent.innerHTML = `<section id="tab-ai-objection" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            objectionGenComponent = new ObjectionGenComponent('tab-ai-objection');
            objectionGenComponent.render();
        } else if (tabId === 'persona') {
            mainContent.innerHTML = `<section id="tab-persona" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            personaInsightComponent = new PersonaInsightComponent('tab-persona');
            personaInsightComponent.render();
        } else if (tabId === 'ai-engine') {
            mainContent.innerHTML = `<section id="tab-ai-engine" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            aiEngineConfigComponent = new AiEngineConfigComponent('tab-ai-engine');
            aiEngineConfigComponent.render();
        } else if (tabId === 'tasks') {
            mainContent.innerHTML = `<section id="tab-tasks" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            tasksComponent = new TasksComponent('tab-tasks');
            tasksComponent.render();
        } else if (tabId === 'calendar') {
            mainContent.innerHTML = `<section id="tab-calendar" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            calendarComponent = new CalendarComponent('tab-calendar');
            calendarComponent.render();
        } else if (tabId === 'settings') {
            mainContent.innerHTML = `<section id="tab-settings" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            settingsComponent = new SettingsComponent('tab-settings');
            settingsComponent.render();
        } else if (tabId === 'validation') {
            mainContent.innerHTML = `<section id="tab-validation" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            validationComponent = new ValidationComponent('tab-validation');
            validationComponent.render();
        } else if (tabId === 'menu-management') {
            mainContent.innerHTML = `<section id="tab-menu-management" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            menuManagementComponent = new MenuManagementComponent('tab-menu-management', menus);
            menuManagementComponent.render();
        } else if (tabId === 'impersonation') {
            mainContent.innerHTML = `<section id="tab-impersonation" class="h-full overflow-y-auto custom-scrollbar pb-10 animate-in"></section>`;
            impersonationComponent = new ImpersonationComponent('tab-impersonation');
            impersonationComponent.render();
        } else {
            mainContent.innerHTML = `<div class="p-10 text-center text-slate-400">Modul ${tabId} belum dimigrasi.</div>`;
        }
        
        if (window.innerWidth < 768) ui.toggleSidebar(false);
    }

    function renderSidebar() {
        const sidebarMenu = document.getElementById('sidebar-menu');
        sidebarMenu.innerHTML = '';
        let lastCategory = '';

        menus.forEach(menu => {
            // Cek apakah user punya akses ke menu ini
            const hasAccess = menu.roles.includes('All') || menu.roles.includes(state.currentRole);
            if (!hasAccess) return;

            if (menu.category !== lastCategory) {
                const catHeader = document.createElement('p');
                catHeader.className = "text-[9px] text-teal-600 font-black uppercase tracking-widest mb-2 mt-5 md:mt-6 pl-2";
                catHeader.innerText = menu.category;
                sidebarMenu.appendChild(catHeader);
                lastCategory = menu.category;
            }

            const isActive = menu.id === state.currentTab;
            const btn = document.createElement('button');
            btn.className = `w-full flex items-center px-4 py-3 rounded-xl transition-all mb-1 ${
                isActive ? 'bg-teal-800 text-white shadow-lg' : 'text-teal-100 hover:bg-teal-800/50 hover:text-white'
            }`;
            btn.innerHTML = `
                <i data-lucide="${menu.icon}" class="w-[16px] h-[16px] md:w-[18px] md:h-[18px] mr-3"></i>
                <span class="font-bold text-[10px] uppercase tracking-wider">${menu.label}</span>
            `;
            
            btn.addEventListener('click', () => switchTab(menu.id));
            sidebarMenu.appendChild(btn);
        });

        if (window.lucide) window.lucide.createIcons();
    }
}