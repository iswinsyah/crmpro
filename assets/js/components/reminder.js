export class ReminderFollowupComponent {
    constructor(containerId, state) { 
        this.container = document.getElementById(containerId); 
        this.state = state;
    }
    
    render() {
        if(!this.container) return;

        // Filter leads yang statusnya FOLLOW_UP
        const followupLeads = this.state.leads.filter(l => l.status === 'FOLLOW_UP');

        const listHtml = followupLeads.length > 0 ? followupLeads.map(lead => `
            <div class="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-3 md:gap-4 cursor-pointer" data-lead-id="${lead.id}">
                <div class="flex items-start sm:items-center space-x-3 md:space-x-4">
                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 bg-orange-100 text-orange-600"><i data-lucide="clock" class="w-4 h-4 md:w-[18px] md:h-[18px]"></i></div>
                    <div>
                        <p class="font-black text-xs md:text-sm text-slate-800 uppercase tracking-tighter flex items-center flex-wrap gap-2">${lead.name} <span class="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] rounded-full uppercase font-black">Follow Up</span></p>
                        <p class="text-[10px] md:text-xs text-slate-500 italic font-medium mt-1">Klik untuk melihat detail dan mengubah status.</p>
                    </div>
                </div>
                <div class="flex items-center justify-between sm:justify-end gap-4 md:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <div class="text-left sm:text-right"><p class="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">WhatsApp</p><span class="text-[10px] font-bold text-slate-700">${lead.phone}</span></div>
                </div>
            </div>
        `).join('') : `<div class="p-10 text-center text-slate-400 italic">Tidak ada lead yang perlu di-follow up saat ini.</div>`;

        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6">
                <div class="bg-teal-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden text-center md:text-left">
                    <div class="absolute top-0 right-0 p-8 opacity-10 hidden md:block"><i data-lucide="zap" class="w-24 h-24"></i></div>
                    <h3 class="text-xl md:text-2xl font-black mb-2 italic leading-tight uppercase tracking-tighter">Reminder Follow Up</h3>
                    <p class="text-[10px] md:text-xs opacity-70 font-medium italic">"Daftar ini otomatis diambil dari Pipeline dengan status <strong>FOLLOW UP</strong>. Ubah status lead atau hapus lead untuk membersihkan daftar ini."</p>
                </div>
                <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div class="divide-y divide-slate-100">
                        ${listHtml}
                    </div>
                </div>
            </div>
        `;
        this.attachEventListeners();
        if(window.lucide) window.lucide.createIcons();
    }

    attachEventListeners() {
        const leadElements = this.container.querySelectorAll('[data-lead-id]');
        leadElements.forEach(el => {
            el.addEventListener('click', () => {
                const leadId = el.dataset.leadId;
                // Find the lead from the state, which has the 'owner' property
                const lead = this.state.leads.find(l => l.id == leadId);
                if (lead) {
                    document.dispatchEvent(new CustomEvent('lead-selected', { detail: lead }));
                }
            });
        });
    }
}