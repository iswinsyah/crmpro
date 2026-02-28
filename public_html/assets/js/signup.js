import { ApiService } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const developerSelect = document.getElementById('developer-select');
    const signupForm = document.getElementById('signup-form');
    const signupButton = document.getElementById('btn-signup');

    // 1. Populate Developer List
    try {
        const developers = await ApiService.getDevelopers();
        developerSelect.innerHTML = '<option value="">-- Pilih Perusahaan --</option>'; // Clear loading text
        developers.forEach(dev => {
            const option = document.createElement('option');
            option.value = dev.id;
            option.textContent = dev.nama_perusahaan;
            developerSelect.appendChild(option);
        });
    } catch (error) {
        developerSelect.innerHTML = '<option value="">Gagal memuat data</option>';
        console.error('Failed to load developers:', error);
    }

    // 2. Handle Form Submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalButtonText = signupButton.innerHTML;
        signupButton.innerHTML = 'Mendaftarkan...';
        signupButton.disabled = true;

        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await ApiService.signup(data);
            alert(response.message);
            window.location.href = 'login.html'; // Redirect to login page on success
        } catch (error) {
            alert('Gagal mendaftar: ' + error.message);
            signupButton.innerHTML = originalButtonText;
            signupButton.disabled = false;
        }
    });
    
    if(window.lucide) window.lucide.createIcons();
});