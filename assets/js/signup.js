import { ApiService } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const developerSelect = document.getElementById('developer-select');
    const signupForm = document.getElementById('signup-form');
    const signupButton = document.getElementById('btn-signup');
    const roleSelect = document.getElementById('role-select');
    const existingDeveloperContainer = document.getElementById('existing-developer-container');
    const newDeveloperContainer = document.getElementById('new-developer-container');
    const newDeveloperInput = newDeveloperContainer.querySelector('input'); // Only one input now

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

    // 2. Handle Role Change to Show/Hide Fields
    roleSelect.addEventListener('change', (e) => {
        const selectedRole = e.target.value;
        if (selectedRole === 'Developer') {
            // Show new company fields, make them required, hide existing company dropdown
            existingDeveloperContainer.classList.add('hidden');
            newDeveloperContainer.classList.remove('hidden');
            developerSelect.required = false;
            newDeveloperInput.required = true;
        } else {
            // Show existing company dropdown, make it required, hide new company fields
            existingDeveloperContainer.classList.remove('hidden');
            newDeveloperContainer.classList.add('hidden');
            developerSelect.required = true;
            newDeveloperInput.required = false;
        }
    });
    // Trigger change on load to set initial state correctly
    roleSelect.dispatchEvent(new Event('change'));

    // 3. Handle Form Submission
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