export class ReminderFollowupComponent {
    constructor(containerId) { this.container = document.getElementById(containerId); }
    render() {
        if(!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6">
                <div class="bg-teal-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden text-center md:text-left">
                    <div class="absolute top-0 right-0 p-8 opacity-10 hidden md:block"><i data-lucide="zap" class="w-24 h-24"></i></div>
                    <h3 class="text-xl md:text-2xl font-black mb-2 italic leading-tight uppercase tracking-tighter">Daily AI Tasks</h3>
                    <p class="text-[10px] md:text-xs opacity-70 font-medium italic">"Gunakan Logika MGO: Jangan biarkan prospek mendingin. Follow-up paling optimal jam 10 pagi."</p>
                </div>
                <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div class="divide-y divide-slate-100">
                        <div class="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-3 md:gap-4">
                            <div class="flex items-start sm:items-center space-x-3 md:space-x-4">
                                <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100 text-red-600"><i data-lucide="message-circle" class="w-4 h-4 md:w-[18px] md:h-[18px]"></i></div>
                                <div><p class="font-black text-xs md:text-sm text-slate-800 uppercase tracking-tighter flex items-center flex-wrap gap-2">Budi Santoso <span class="px-2 py-0.5 bg-orange-100 text-orange-600 text-[8px] rounded-full uppercase font-black">AI Suggestion</span></p><p class="text-[10px] md:text-xs text-slate-500 italic font-medium mt-1">"Momentum Hot: 48 jam tanpa interaksi. Segera hubungi!"</p></div>
                            </div>
                            <div class="flex items-center justify-between sm:justify-end gap-4 md:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                                <div class="text-left sm:text-right"><p class="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-red-500">Hari Ini</p><span class="text-[8px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">High</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        if(window.lucide) window.lucide.createIcons();
    }
}