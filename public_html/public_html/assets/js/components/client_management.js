export class ClientManagementComponent {
    constructor(containerId) { this.container = document.getElementById(containerId); }
    render() {
        if(!this.container) return;
        const clients = [
            { name: 'Developer Amanah Residen', leads: 450, conversion: '12%', status: 'Healthy', color: 'text-green-600' },
            { name: 'Bukit Syariah Cluster', leads: 320, conversion: '8%', status: 'Warning', color: 'text-orange-600' },
            { name: 'Kavling Berkah Land', leads: 890, conversion: '15%', status: 'Top Performer', color: 'text-teal-600' }
        ];
        this.container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-8">
                <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-6 md:p-8 border-b bg-slate-50 flex justify-between items-center">
                        <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest italic">Developer Portfolio</h3>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left min-w-[600px]">
                            <thead class="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                                <tr><th class="px-6 py-5">Developer Name</th><th class="px-6 py-5">Total Leads</th><th class="px-6 py-5">Conversion</th><th class="px-6 py-5">Status</th><th class="px-6 py-5">Action</th></tr>
                            </thead>
                            <tbody class="text-xs md:text-sm font-bold">
                                ${clients.map(c => `
                                <tr class="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 md:py-6 text-slate-700 whitespace-nowrap">${c.name}</td><td class="px-6 py-4 md:py-6 text-slate-500 whitespace-nowrap">${c.leads} Leads</td><td class="px-6 py-4 md:py-6 text-slate-800 whitespace-nowrap">${c.conversion}</td><td class="px-6 py-4 md:py-6 uppercase text-[10px] ${c.color} whitespace-nowrap">${c.status}</td><td class="px-6 py-4 md:py-6 whitespace-nowrap"><button class="text-teal-600 text-[10px] md:text-xs font-black uppercase hover:underline">Audit Data</button></td>
                                </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}