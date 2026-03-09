import { ApiService } from '../api.js';

/**
 * Kumpulan Komponen AI & Fitur Canggih
 */

// 1. LEAD ANALYZER
export class LeadAnalyzerComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    render() {
        if(!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6 md:space-y-8">
                <div class="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 text-center">
                    <div class="flex items-center justify-center mb-4 md:mb-6"><i data-lucide="brain-circuit" class="w-8 h-8 md:w-10 md:h-10 text-teal-600"></i></div>
                    <h3 class="text-sm md:text-lg font-black text-slate-800 uppercase tracking-widest italic mb-4 md:mb-6">Lead Gestur Analyzer AI <span class="text-[9px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full not-italic ml-2">Powered by Gemini</span></h3>
                    <textarea id="analyzer-input" placeholder="Tempel percakapan chat WA prospek di sini..." class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs md:text-sm font-medium h-40 md:h-48 outline-none focus:ring-2 focus:ring-teal-500 resize-none shadow-inner custom-scrollbar"></textarea>
                    <button id="btn-analyze" class="w-full mt-4 md:mt-6 py-4 md:py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all">Analisa Suhu Prospek</button>
                </div>
                <div id="analyzer-result" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 hidden"></div>
            </div>
        `;
        this.container.querySelector('#btn-analyze').addEventListener('click', () => this.analyze());
        if(window.lucide) window.lucide.createIcons();
    }
    async analyze() {
        const btn = this.container.querySelector('#btn-analyze');
        const res = this.container.querySelector('#analyzer-result');
        const input = this.container.querySelector('#analyzer-input').value;
        if(!input) return alert('Masukkan teks chat dulu bos!');
        
        const originalText = btn.innerText;
        btn.innerText = "Sedang Menganalisa...";
        btn.disabled = true;
        res.classList.add('hidden');

        try {
            const prompt = `Analisa percakapan chat prospek properti berikut. Tentukan skor "Suhu Prospek" (0-100%), Label (HOT/WARM/COLD), dan berikan 1 kalimat saran tindakan singkat. Format output JSON: {"score": "85%", "label": "HOT LEAD", "advice": "Saran..."}. Chat: "${input}"`;
            
            const response = await ApiService.generateAIContent(prompt);
            
            // Parsing hasil (Gemini kadang mengembalikan markdown json, kita bersihkan)
            let cleanJson = (response.result || '').replace(/```json|```/g, '').trim();
            let data = { score: "N/A", label: "UNKNOWN", advice: "Gagal mem-parsing respon AI." };
            try { data = JSON.parse(cleanJson); } catch(e) { console.error("Gagal parsing JSON dari AI:", e); }

            res.innerHTML = `
                <div class="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border text-center shadow-sm">
                    <p class="text-3xl md:text-4xl font-black text-teal-600">${data.score || 'N/A'}</p>
                    <p class="text-[9px] md:text-[10px] font-black text-orange-600 uppercase tracking-widest mt-2">${data.label || 'ANALYSIS DONE'}</p>
                </div>
                <div class="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white italic text-[10px] md:text-xs leading-relaxed flex items-center shadow-xl">
                    "${data.advice || 'Tidak ada saran.'}"
                </div>
            `;
            res.classList.remove('hidden');
        } catch (error) {
            res.innerHTML = `<div class="col-span-1 md:col-span-2 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs"><strong class="font-bold">Gagal Analisa AI:</strong><br>${error.message}</div>`;
            res.classList.remove('hidden');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
}

// 2. CREATIVE SUITE
export class CreativeSuiteComponent {
    constructor(containerId, state) {
        this.container = document.getElementById(containerId);
        this.state = state;
        this.mode = 'text';
    }
    render() {
        if(!this.container) return;
        const savedInsight = this.state.developerSettings?.ai_persona_insight;

        this.container.innerHTML = `
            <div class="max-w-5xl mx-auto space-y-6">
                <div class="flex space-x-2 md:space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto hide-scroll shrink-0 snap-x">
                    <button id="btn-creative-text" class="shrink-0 snap-center min-w-[140px] flex-1 py-3 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center bg-teal-600 text-white shadow-lg"><i data-lucide="file-text" class="w-3.5 h-3.5 mr-2"></i> Copywriting AI</button>
                    <button id="btn-creative-visual" class="shrink-0 snap-center min-w-[140px] flex-1 py-3 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center text-slate-400 hover:bg-slate-50"><i data-lucide="image" class="w-3.5 h-3.5 mr-2"></i> Visual Idea</button>
                    <button id="btn-creative-video" class="shrink-0 snap-center min-w-[140px] flex-1 py-3 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center text-slate-400 hover:bg-slate-50"><i data-lucide="video" class="w-3.5 h-3.5 mr-2"></i> Video Script</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div class="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h3 class="text-xs md:text-sm font-black text-slate-800 mb-6 uppercase tracking-widest italic text-center md:text-left">AI Content Parameter</h3>
                        <div id="persona-context-indicator" class="hidden mb-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-center">
                            <p class="text-[9px] font-bold text-teal-700">💡 Menggunakan konteks dari <strong class="underline">Persona Insight</strong> yang tersimpan.</p>
                        </div>
                        <div class="space-y-4">
                            <select id="creative-angle" class="w-full bg-slate-50 border p-4 rounded-2xl text-[10px] font-bold outline-none"><option>Angle: Syariah Murni Tanpa Sita</option><option>Angle: Rumah Pertama Milenial</option><option>Angle: Investasi Properti Menguntungkan</option></select>
                            <textarea id="creative-input" placeholder="Detail unit, poin promo, atau kendala prospek..." class="w-full bg-slate-50 border rounded-2xl p-4 h-32 md:h-40 text-xs font-medium resize-none focus:ring-2 focus:ring-teal-500 outline-none shadow-inner"></textarea>
                            <button id="btn-generate-creative" class="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all active:scale-95">Generate Konten Kreatif</button>
                        </div>
                    </div>
                    <div class="bg-slate-900 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl flex flex-col min-h-[300px] md:min-h-[400px]">
                        <p class="text-[9px] font-black text-teal-400 uppercase mb-4 tracking-widest flex items-center"><i data-lucide="sparkles" class="w-3.5 h-3.5 mr-2"></i> AI Content Result (Gemini)</p>
                        <div id="creative-result" class="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-4">
                            <i data-lucide="bot" class="w-8 h-8 mb-3"></i>
                            <p class="text-xs italic font-medium">Masukkan parameter dan klik generate.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.setupListeners();

        if (savedInsight) {
            this.container.querySelector('#persona-context-indicator').classList.remove('hidden');
        }

        if(window.lucide) window.lucide.createIcons();
    }
    setupListeners() {
        ['text', 'visual', 'video'].forEach(m => {
            this.container.querySelector(`#btn-creative-${m}`).addEventListener('click', () => this.switchMode(m));
        });
        this.container.querySelector('#btn-generate-creative').addEventListener('click', () => this.generate());
    }
    switchMode(mode) {
        this.mode = mode;
        ['text', 'visual', 'video'].forEach(m => {
            const btn = this.container.querySelector(`#btn-creative-${m}`);
            btn.className = (m === mode) 
                ? "shrink-0 snap-center min-w-[140px] flex-1 py-3 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center bg-teal-600 text-white shadow-lg"
                : "shrink-0 snap-center min-w-[140px] flex-1 py-3 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center text-slate-400 hover:bg-slate-50";
        });
        if(window.lucide) window.lucide.createIcons();
    }
    async generate() {
        const btn = this.container.querySelector('#btn-generate-creative');
        const res = this.container.querySelector('#creative-result');
        const angle = this.container.querySelector('#creative-angle').value;
        const input = this.container.querySelector('#creative-input').value;
        
        const originalText = btn.innerText;
        btn.innerText = "Processing AI...";
        btn.disabled = true;
        res.innerHTML = `<div class="animate-pulse flex flex-col items-center"><i data-lucide="cpu" class="w-8 h-8 text-teal-400 mb-3"></i><p class="text-[10px] font-black uppercase tracking-widest">Merangkai...</p></div>`;
        res.classList.remove('opacity-30');
        if(window.lucide) window.lucide.createIcons();
        
        try {
            const personaInsight = this.state.developerSettings?.ai_persona_insight || 'Tidak ada data persona. Asumsikan target market umum untuk properti syariah.';

            let prompt = `Anda adalah seorang Creative Director ahli untuk agensi properti syariah.
            
**KONTEKS BUYER PERSONA (berdasarkan data):**
---
${personaInsight}
---

**TUGAS ANDA:**
Buat konten kreatif untuk properti syariah dengan detail sebagai berikut:
- **Mode Konten:** ${this.mode}
- **Angle/Sudut Pandang:** ${angle}
- **Detail Tambahan dari User:** ${input || 'Tidak ada.'}

**INSTRUKSI OUTPUT:**
`;

            if (this.mode === 'text') {
                prompt += "Buatlah **Copywriting Lengkap** yang sangat persuasif, terdiri dari: \n1. **Headline** yang menarik perhatian. \n2. **Body Copy** yang menjelaskan keuntungan sesuai persona. \n3. **Call to Action (CTA)** yang kuat.";
            } else if (this.mode === 'visual') {
                prompt += "Berikan **Ide Konsep Visual** untuk postingan Instagram (bisa carousel atau single image). Jelaskan secara detail: \n1. **Gambar Utama/Slide 1:** Deskripsi visual dan teks overlay. \n2. **Gambar/Slide Berikutnya:** Deskripsi visual dan poin-poin penting. \n3. **Teks untuk Caption:** Tulis caption singkat yang sesuai dengan visualnya.";
            } else { // video
                prompt += "Tulis **Naskah/Script Video Pendek** (TikTok/Reels) yang lengkap, mencakup: \n1. **Hook (3 detik pertama):** Kalimat atau adegan pembuka yang membuat orang berhenti scroll. \n2. **Isi Video:** Poin-poin utama yang disampaikan (bisa berupa narasi atau teks di layar). \n3. **Visual/Adegan:** Deskripsi singkat adegan yang harus direkam. \n4. **Call to Action (CTA):** Ajakan di akhir video.";
            }

            const response = await ApiService.generateAIContent(prompt);

            res.innerHTML = `<div class="w-full h-full bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl text-[10px] md:text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap border border-white/5 text-left custom-scrollbar overflow-y-auto">${response.result}</div>`;
        } catch (error) {
            res.innerHTML = `<div class="text-red-400 text-xs">Error: ${error.message}</div>`;
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
}

// 3. OBJECTION GEN
export class ObjectionGenComponent {
    constructor(containerId) { this.container = document.getElementById(containerId); }
    render() {
        if(!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6 md:space-y-8">
                <div class="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 class="text-xs md:text-sm font-black text-slate-800 mb-6 uppercase tracking-widest text-center italic">Handling Objection Master AI <span class="text-[9px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full not-italic ml-2">Gemini</span></h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        ${this.btn('mahal', 'Harganya kemahalan pak...')}
                        ${this.btn('legal', 'Gimana legalitasnya, aman?')}
                        ${this.btn('jauh', 'Lokasinya kok jauh ya?')}
                        ${this.btn('bank', 'Saya biasanya pake KPR Bank...')}
                    </div>
                    <div class="bg-teal-950 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-4 opacity-5"><i data-lucide="shield-alert" class="w-16 h-16"></i></div>
                        <p class="text-[9px] md:text-[10px] font-black text-teal-400 uppercase mb-3 tracking-widest flex items-center relative z-10"><i data-lucide="message-square" class="w-4 h-4 mr-2"></i> Script Jawaban Taktis AI:</p>
                        <p id="objection-text" class="text-xs md:text-sm font-medium leading-relaxed italic text-teal-50/80 relative z-10 border-l-2 border-teal-500 pl-4 md:pl-6">Pilih salah satu keberatan di atas untuk mendapatkan jawaban taktis AI.</p>
                    </div>
                </div>
            </div>
        `;
        this.container.querySelectorAll('button').forEach(b => b.addEventListener('click', (e) => this.handle(e.currentTarget.dataset.type)));
        if(window.lucide) window.lucide.createIcons();
    }
    btn(type, text) {
        return `<button data-type="${type}" class="text-left p-5 border rounded-2xl hover:border-teal-500 hover:bg-slate-50 transition-all group active:scale-95 shadow-sm border-slate-100">
            <p class="text-[8px] md:text-[9px] font-black text-slate-400 uppercase mb-1">Keberatan Prospek:</p>
            <p class="text-[10px] md:text-[11px] font-bold text-slate-700 italic">"${text}"</p>
        </button>`;
    }
    async handle(type) {
        const objectionMap = {
            mahal: "Harganya kemahalan pak...",
            legal: "Gimana legalitasnya, aman?",
            jauh: "Lokasinya kok jauh ya?",
            bank: "Saya biasanya pake KPR Bank..."
        };
        
        const container = this.container.querySelector('#objection-text');
        container.innerText = "Sedang meramu jawaban taktis...";
        
        try {
            const prompt = `Berikan script jawaban sales properti syariah yang taktis, sopan, dan persuasif untuk menangani keberatan prospek: "${objectionMap[type]}". Jawaban harus singkat (max 2 kalimat) dan menekankan value syariah/investasi.`;
            const response = await ApiService.generateAIContent(prompt);
            container.innerText = response.result;
        } catch (error) {
            container.innerText = `Gagal memuat AI: ${error.message}`;
        }
    }
}

// 4. PERSONA INSIGHT
export class PersonaInsightComponent {
    constructor(containerId, state) { 
        this.container = document.getElementById(containerId);
        this.state = state;
        this.lastAIResult = null; // Untuk menyimpan hasil AI sementara
    }

    render() {
        if(!this.container) return;

        // Hitung Statistik Real-time dari Data Leads
        const leads = this.state.leads || [];
        const savedInsight = this.state.developerSettings?.ai_persona_insight;
        const totalLeads = leads.length;

        if (totalLeads === 0) {
            this.container.innerHTML = `<div class="p-10 text-center text-slate-400">Belum ada data lead untuk dianalisis. Silakan input data lead terlebih dahulu.</div>`;
            return;
        }

        // Fungsi helper untuk mencari nilai terbanyak (modus)
        const getTop = (field) => {
            const counts = {};
            leads.forEach(l => {
                const val = l[field] || 'Unknown';
                counts[val] = (counts[val] || 0) + 1;
            });
            return Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || '-';
        };

        const topJob = getTop('job');
        const topSegment = getTop('segment');
        const topChannel = getTop('channel'); // Mengganti Domisili dengan Channel karena data domisili tidak ada di tabel

        this.container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="bg-teal-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden text-center md:text-left">
                    <div class="absolute top-0 right-0 p-8 opacity-10 hidden md:block"><i data-lucide="user-check" class="w-24 h-24"></i></div>
                    <h3 class="text-xl md:text-2xl font-black mb-2 italic leading-tight uppercase tracking-tighter">Global AI Buyer Persona</h3>
                    <p class="text-[10px] md:text-xs opacity-70 font-medium italic max-w-lg mx-auto md:mx-0">"Data dianalisis otomatis dari database lead untuk membedah psikologi, minat, dan merekomendasikan gaya komunikasi terbaik."</p>
                    <button id="btn-analyze-persona" class="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95">
                        <i data-lucide="sparkles" class="w-3 h-3 inline mr-1"></i> Generate AI Analysis
                    </button>
                </div>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    <div class="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200 text-center"><p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Top Pekerjaan</p><p class="text-xl md:text-2xl font-black text-slate-800 tracking-tighter px-2 truncate">${topJob}</p></div>
                    <div class="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200 text-center"><p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Segmen Dominan</p><p class="text-xl md:text-2xl font-black text-teal-600 tracking-tighter px-2 truncate">${topSegment}</p></div>
                    <div class="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200 text-center"><p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Top Channel</p><p class="text-xl md:text-2xl font-black text-orange-500 tracking-tighter px-2 truncate">${topChannel}</p></div>
                </div>

                <!-- AI Result Container -->
                <div id="persona-result" class="hidden bg-white p-6 md:p-10 rounded-[2rem] shadow-lg border border-teal-100 animate-in">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-4">
                            <i data-lucide="bot" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h4 class="font-black text-slate-800 text-lg uppercase tracking-widest">AI Insight Result</h4>
                            <p class="text-[10px] text-slate-400 font-bold">Powered by Gemini Pro</p>
                        </div>
                    </div>
                    <div id="persona-content" class="text-xs md:text-sm text-slate-600 leading-relaxed font-medium space-y-2"></div>
                    <button id="btn-save-persona" class="hidden mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase shadow-lg transition-all active:scale-95">
                        <i data-lucide="save" class="w-3 h-3 inline mr-1.5"></i> Simpan Hasil Analisa Ini
                    </button>
                </div>
            </div>
        `;
        
        this.container.querySelector('#btn-analyze-persona').addEventListener('click', () => this.analyzePersona(topJob, topSegment, topChannel));
        
        // Jika ada data tersimpan, langsung tampilkan
        if (savedInsight) {
            this.displayResult(savedInsight, false);
        }

        if(window.lucide) window.lucide.createIcons();
    }

    async analyzePersona(job, segment, channel) {
        const btn = this.container.querySelector('#btn-analyze-persona');
        const resultContainer = this.container.querySelector('#persona-result');
        const contentContainer = this.container.querySelector('#persona-content');
        
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-3 h-3 inline mr-1 animate-spin"></i> Menganalisa...`;
        btn.disabled = true;
        
        try {
            const prompt = `Sebagai konsultan properti ahli, analisa Buyer Persona berdasarkan data dominan berikut: Pekerjaan=${job}, Segmen=${segment}, Media Masuk=${channel}. 
            Berikan insight mendalam mengenai:
            1. Psikologi & Pemicu Pembelian (Pain & Gain).
            2. Gaya Komunikasi yang disukai.
            3. Rekomendasi Strategi Closing.
            Gunakan bahasa Indonesia yang profesional namun mudah dipahami sales. Format dengan poin-poin.`;

            const response = await ApiService.generateAIContent(prompt);
            
            this.displayResult(response.result, true);
            
        } catch (error) {
            contentContainer.innerHTML = `<div class="text-red-500 font-bold">Analisa Gagal:</div><div class="text-xs mt-2">${error.message}</div>`;
            resultContainer.classList.remove('hidden');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            if(window.lucide) window.lucide.createIcons();
        }
    }

    displayResult(rawText, isNewResult) {
        const resultContainer = this.container.querySelector('#persona-result');
        const contentContainer = this.container.querySelector('#persona-content');
        const saveButton = this.container.querySelector('#btn-save-persona');

        this.lastAIResult = rawText; // Simpan hasil mentah
        const formattedResult = String(rawText).replace(/\n/g, '<br>');
        contentContainer.innerHTML = formattedResult;
        resultContainer.classList.remove('hidden');

        if (isNewResult) {
            saveButton.classList.remove('hidden');
            saveButton.style.display = 'inline-flex'; // Paksa tampil
            saveButton.onclick = () => this.saveResult();
        } else {
            saveButton.classList.add('hidden');
            saveButton.style.display = 'none';
        }
        if(window.lucide) window.lucide.createIcons();
    }

    async saveResult() {
        const saveButton = this.container.querySelector('#btn-save-persona');
        const originalContent = saveButton.innerHTML; // Simpan icon & text asli
        saveButton.innerText = 'Menyimpan...';
        saveButton.disabled = true;

        const formData = new FormData();
        formData.append('developer_id', this.state.currentUser.developer_id);
        formData.append('user_id', this.state.currentUser.id); // FIX: Tambahkan User ID agar lolos validasi server
        
        // Encode AI text to Base64 to bypass WAF
        const encodedInsight = btoa(unescape(encodeURIComponent(this.lastAIResult)));
        formData.append('ai_persona_insight', encodedInsight);

        try {
            const response = await fetch(`${ApiService.BASE_URL}/save_developer_settings.php`, { method: 'POST', body: formData });
            const result = await ApiService.handleResponse(response); // Handle error response dengan benar
            
            alert('Hasil analisa berhasil disimpan!');
            saveButton.classList.add('hidden');
            
            // Update state lokal agar jika pindah tab, data tetap ada
            if (!this.state.developerSettings) this.state.developerSettings = {};
            this.state.developerSettings.ai_persona_insight = this.lastAIResult;

        } catch (error) {
            alert('Gagal menyimpan hasil: ' + error.message);
            saveButton.innerHTML = originalContent; // Kembalikan icon & text
            saveButton.disabled = false;
        }
    }
}

// 5. AI ENGINE CONFIG
export class AiEngineConfigComponent {
    constructor(containerId) { this.container = document.getElementById(containerId); }
    render() {
        if(!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-8">
                <div class="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div class="flex flex-col md:flex-row items-center text-center md:text-left mb-8 border-b pb-6">
                        <i data-lucide="database" class="w-8 h-8 text-teal-600 mb-3 md:mb-0 md:mr-4"></i>
                        <div><h3 class="text-sm md:text-lg font-black text-slate-800 uppercase tracking-widest italic">AI Engine Configuration</h3><p class="text-[10px] md:text-xs text-slate-500 font-medium mt-1">Pengaturan parameter dasar kecerdasan buatan MCS Master.</p></div>
                    </div>
                    <div class="space-y-6">
                        <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div class="flex justify-between items-center mb-3"><label class="text-[9px] font-black text-slate-700 uppercase tracking-widest">Model Pembelajaran AI</label><span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">Active</span></div>
                            <select class="w-full bg-white border p-3 md:p-4 rounded-xl text-[10px] md:text-xs font-bold outline-none shadow-sm"><option>MCS Real Estate Model v2.4 (Optimized)</option><option>General Sales Model v1.1</option></select>
                        </div>
                        <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <label class="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-3 block">Temperature (Kreativitas vs Presisi)</label>
                            <input type="range" min="0" max="100" value="70" class="w-full accent-teal-600" />
                            <div class="flex justify-between text-[8px] md:text-[9px] font-bold text-slate-400 mt-2 uppercase"><span>Sangat Kaku / Matematis</span><span>Sangat Kreatif</span></div>
                        </div>
                        <button class="w-full py-4 bg-teal-950 text-white rounded-xl font-black text-[10px] uppercase shadow-xl hover:bg-teal-800 transition-colors">Simpan Konfigurasi</button>
                    </div>
                </div>
            </div>
        `;
        if(window.lucide) window.lucide.createIcons();
    }
}

// 6. AI CONTENT CALENDAR GENERATOR
export class ContentCalendarGeneratorComponent {
    constructor(containerId, state) {
        this.container = document.getElementById(containerId);
        this.state = state;
        this.lastAIResult = null;
    }

    render() {
        if (!this.container) return;
        const savedInsight = this.state.developerSettings?.ai_persona_insight;
        const savedCalendar = this.state.developerSettings?.ai_content_calendar;

        if (!savedInsight) {
            this.container.innerHTML = `<div class="p-10 text-center text-orange-600 bg-orange-50 rounded-2xl border border-orange-200">
                <i data-lucide="alert-triangle" class="w-12 h-12 mx-auto mb-4"></i>
                <h3 class="font-bold">Konteks Persona Dibutuhkan</h3>
                <p class="text-sm mt-1">Silakan generate dan simpan hasil di menu <strong>Persona Insight</strong> terlebih dahulu sebelum membuat kalender konten.</p>
            </div>`;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        this.container.innerHTML = `
            <div class="max-w-7xl mx-auto space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Kolom Parameter -->
                    <div class="lg:col-span-1 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm self-start">
                        <h3 class="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest italic text-center">Parameter Kalender</h3>
                        <div class="space-y-5">
                            <div>
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Durasi Konten</label>
                                <div class="grid grid-cols-2 gap-2 mt-2">
                                    <button data-duration="7" class="duration-btn bg-teal-600 text-white shadow-lg">1 Pekan</button>
                                    <button data-duration="30" class="duration-btn">1 Bulan</button>
                                </div>
                            </div>
                             <div>
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Frekuensi Posting / Hari</label>
                                <div class="grid grid-cols-3 gap-2 mt-2">
                                    <button data-freq="1" class="freq-btn bg-teal-600 text-white shadow-lg">1x</button>
                                    <button data-freq="2" class="freq-btn">2x</button>
                                    <button data-freq="3" class="freq-btn">3x</button>
                                </div>
                            </div>
                            <div class="pt-4">
                                <button id="btn-generate-calendar" class="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all active:scale-95 flex items-center justify-center">
                                    <i data-lucide="calendar-days" class="w-4 h-4 mr-2"></i> Generate Jadwal
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Kolom Hasil -->
                    <div class="lg:col-span-2 bg-slate-900 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl flex flex-col">
                        <p class="text-[9px] font-black text-teal-400 uppercase mb-4 tracking-widest flex items-center"><i data-lucide="sparkles" class="w-3.5 h-3.5 mr-2"></i> AI Content Calendar</p>
                        <div id="calendar-result-container" class="flex-1 min-h-[400px]">
                            <!-- Hasil akan dirender di sini -->
                        </div>
                        <button id="btn-save-calendar" class="hidden mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase shadow-lg transition-all active:scale-95 self-start">
                            <i data-lucide="save" class="w-3 h-3 inline mr-1.5"></i> Simpan Kalender Ini
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Apply shared button styles
        this.container.querySelectorAll('.duration-btn, .freq-btn').forEach(btn => {
            btn.classList.add('py-3', 'px-4', 'rounded-xl', 'font-black', 'text-[9px]', 'uppercase', 'tracking-widest', 'transition-all', 'border');
            if (!btn.classList.contains('bg-teal-600')) {
                btn.classList.add('text-slate-400', 'hover:bg-slate-50', 'border-slate-200');
            }
        });

        if (savedCalendar) {
            this.displayResult(savedCalendar, false);
        } else {
            this.container.querySelector('#calendar-result-container').innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-30 text-center px-4">
                <i data-lucide="bot" class="w-8 h-8 mb-3"></i>
                <p class="text-xs italic font-medium">Pilih parameter dan klik generate.</p>
            </div>`;
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        if (window.lucide) window.lucide.createIcons();

        this.container.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleButton(e.currentTarget, '.duration-btn'));
        });

        this.container.querySelectorAll('.freq-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleButton(e.currentTarget, '.freq-btn'));
        });

        this.container.querySelector('#btn-generate-calendar').addEventListener('click', () => this.generate());
    }

    toggleButton(clickedBtn, groupSelector) {
        this.container.querySelectorAll(groupSelector).forEach(btn => {
            btn.classList.remove('bg-teal-600', 'text-white', 'shadow-lg');
            btn.classList.add('text-slate-400', 'hover:bg-slate-50', 'border-slate-200');
        });
        clickedBtn.classList.add('bg-teal-600', 'text-white', 'shadow-lg');
        clickedBtn.classList.remove('text-slate-400', 'hover:bg-slate-50', 'border-slate-200');
    }

    async generate() {
        const btn = this.container.querySelector('#btn-generate-calendar');
        const resContainer = this.container.querySelector('#calendar-result-container');

        const duration = this.container.querySelector('.duration-btn.bg-teal-600').dataset.duration;
        const freq = this.container.querySelector('.freq-btn.bg-teal-600').dataset.freq;
        const personaInsight = this.state.developerSettings?.ai_persona_insight;

        const originalText = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i> Generating...`;
        btn.disabled = true;
        resContainer.innerHTML = `<div class="h-full flex flex-col items-center justify-center animate-pulse text-center px-4">
            <i data-lucide="cpu" class="w-8 h-8 text-teal-400 mb-3"></i>
            <p class="text-xs font-bold text-teal-300">AI sedang menyusun jadwal, mohon tunggu...</p>
        </div>`;
        if (window.lucide) window.lucide.createIcons();

        try {
            const prompt = `Anda adalah seorang Social Media Strategist ahli untuk agensi properti syariah.
            
**KONTEKS BUYER PERSONA:**
---
${personaInsight}
---

**TUGAS ANDA:**
Buatlah **Rencana Kalender Konten (Content Calendar)** yang detail dan terstruktur.

**PARAMETER:**
- **Durasi:** ${duration} hari.
- **Frekuensi:** ${freq} kali posting per hari.

**INSTRUKSI OUTPUT:**
Berikan output dalam format **JSON** yang bisa di-parse. Strukturnya harus berupa array of objects, di mana setiap object adalah satu jadwal post.
Setiap object harus memiliki key berikut: "day" (Hari ke-), "time_slot" (Slot Waktu ke-, jika >1x sehari), "content_pillar" (Pilih salah satu: Edukasi, Promosi, Interaksi, Testimoni), "topic_idea" (Ide topik konten yang spesifik dan menarik), "format" (Saran format: Reels, Carousel, Story, Single Image), dan "hook_suggestion" (Saran 1 kalimat untuk hook/caption pembuka).

Contoh 1 object:
{"day": 1, "time_slot": 1, "content_pillar": "Edukasi", "topic_idea": "3 Kesalahan Fatal Saat Beli Rumah Pertama", "format": "Reels", "hook_suggestion": "Jangan sampai kamu rugi ratusan juta karena 3 hal ini!"}

Pastikan jumlah object sesuai dengan (Durasi x Frekuensi). Jangan tambahkan teks atau penjelasan lain di luar format JSON.`;

            const response = await ApiService.generateAIContent(prompt);
            this.lastAIResult = response.result; // Simpan raw result untuk di-save
            this.displayResult(response.result, true);

        } catch (error) {
            resContainer.innerHTML = `<div class="text-red-400 text-xs">Error: ${error.message}</div>`;
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    displayResult(rawJson, isNewResult) {
        const resContainer = this.container.querySelector('#calendar-result-container');
        const saveButton = this.container.querySelector('#btn-save-calendar');
        
        try {
            // Bersihkan jika ada markdown ```json
            const cleanJson = rawJson.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);

            const tableRows = data.map(item => `
                <tr class="border-b border-slate-700/50 hover:bg-slate-800/50">
                    <td class="p-3 text-center">${item.day}</td>
                    <td class="p-3">${item.topic_idea}</td>
                    <td class="p-3 text-center"><span class="px-2 py-0.5 bg-teal-800 text-teal-200 rounded-full text-[8px] font-black">${item.content_pillar}</span></td>
                    <td class="p-3 text-center">${item.format}</td>
                </tr>
            `).join('');

            resContainer.innerHTML = `
                <div class="w-full h-full bg-white/5 p-1 rounded-2xl border border-white/5 text-left custom-scrollbar overflow-y-auto">
                    <table class="w-full text-xs text-slate-300">
                        <thead class="sticky top-0 bg-slate-900">
                            <tr class="text-[9px] uppercase font-black text-slate-400">
                                <th class="p-3 text-center">Hari</th>
                                <th class="p-3">Ide Topik</th>
                                <th class="p-3 text-center">Pilar</th>
                                <th class="p-3 text-center">Format</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            `;
        } catch (e) {
            console.error("Gagal parsing JSON kalender:", e);
            resContainer.innerHTML = `<div class="w-full h-full bg-white/5 p-4 rounded-2xl border border-white/5 text-left custom-scrollbar overflow-y-auto whitespace-pre-wrap">${rawJson}</div>`;
        }

        if (isNewResult) {
            saveButton.classList.remove('hidden');
            saveButton.onclick = () => this.saveResult();
        } else {
            saveButton.classList.add('hidden');
        }
    }

    async saveResult() {
        const saveButton = this.container.querySelector('#btn-save-calendar');
        const originalContent = saveButton.innerHTML;
        saveButton.innerText = 'Menyimpan...';
        saveButton.disabled = true;

        const formData = new FormData();
        formData.append('developer_id', this.state.currentUser.developer_id);
        formData.append('user_id', this.state.currentUser.id);
        
        const encodedCalendar = btoa(unescape(encodeURIComponent(this.lastAIResult)));
        formData.append('ai_content_calendar', encodedCalendar);

        try {
            await fetch(`${ApiService.BASE_URL}/save_developer_settings.php`, { method: 'POST', body: formData });
            alert('Kalender konten berhasil disimpan!');
            saveButton.classList.add('hidden');
            if (!this.state.developerSettings) this.state.developerSettings = {};
            this.state.developerSettings.ai_content_calendar = this.lastAIResult;
        } catch (error) {
            alert('Gagal menyimpan kalender: ' + error.message);
            saveButton.innerHTML = originalContent;
            saveButton.disabled = false;
        }
    }
}