/**
 * Komponen Manajemen Tugas
 */
export class TasksComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        // Data dummy untuk visualisasi awal
        this.tasks = [
            { id: 1, title: 'Follow up Prospek Baru', date: 'Hari ini', status: 'Pending', priority: 'High' },
            { id: 2, title: 'Meeting Tim Marketing', date: 'Besok, 10:00', status: 'In Progress', priority: 'Medium' },
            { id: 3, title: 'Update Laporan Bulanan', date: '28 Feb 2026', status: 'Completed', priority: 'Low' },
        ];
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-black text-slate-800 text-xl uppercase tracking-widest">Task Management</h3>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelola tugas harian Anda</p>
                    </div>
                    <button class="bg-teal-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg flex items-center">
                        <i data-lucide="plus" class="w-4 h-4 mr-2"></i> New Task
                    </button>
                </div>

                <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div class="divide-y divide-slate-100">
                        ${this.tasks.map(task => this.createTaskItem(task)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        if (window.lucide) window.lucide.createIcons();
    }

    createTaskItem(task) {
        const statusColors = {
            'Pending': 'bg-orange-100 text-orange-600',
            'In Progress': 'bg-blue-100 text-blue-600',
            'Completed': 'bg-green-100 text-green-600'
        };

        return `
            <div class="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                <div class="flex items-center space-x-4">
                    <div class="p-3 rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                        <i data-lucide="check-square" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm">${task.title}</h4>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center">
                            <i data-lucide="clock" class="w-3 h-3 mr-1"></i> ${task.date}
                        </p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusColors[task.status]}">
                        ${task.status}
                    </span>
                    <button class="p-2 text-slate-300 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
            </div>
        `;
    }
}