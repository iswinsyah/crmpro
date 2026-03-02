export class CalendarComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
    }

    render() {
        if (!this.container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday
        
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        let html = `
            <div class="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div class="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 class="font-black text-slate-800 text-xl uppercase tracking-widest">${monthNames[month]} ${year}</h3>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jadwal Follow-up & Survey</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="p-2 rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-500"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <button class="p-2 rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-500"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
                    </div>
                </div>
                
                <div class="grid grid-cols-7 text-center border-b border-slate-100 bg-slate-50/30">
                    ${['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => 
                        `<div class="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">${d}</div>`
                    ).join('')}
                </div>

                <div class="grid grid-cols-7 auto-rows-fr bg-slate-50">
        `;

        // Kotak kosong untuk hari sebelum tanggal 1
        for (let i = 0; i < startingDay; i++) {
            html += `<div class="min-h-[100px] border-b border-r border-slate-100 bg-slate-50/50"></div>`;
        }

        // Render Tanggal
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            
            html += `
                <div class="min-h-[100px] border-b border-r border-slate-100 p-2 relative group hover:bg-white transition-colors">
                    <span class="text-xs font-bold ${isToday ? 'bg-teal-600 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-lg' : 'text-slate-500'}">${day}</span>
                    
                    <!-- Dummy Event (Contoh) -->
                    ${day === 15 || day === 20 ? `
                        <div class="mt-2 p-1.5 bg-orange-100 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-200 transition-colors">
                            <p class="text-[8px] font-black text-orange-700 truncate">Follow Up Budi</p>
                        </div>
                    ` : ''}
                     ${day === 28 ? `
                        <div class="mt-2 p-1.5 bg-blue-100 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                            <p class="text-[8px] font-black text-blue-700 truncate">Survey Lokasi</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        if (window.lucide) window.lucide.createIcons();
    }
}