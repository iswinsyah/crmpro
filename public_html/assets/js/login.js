import { ApiService } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('btn-login');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalButtonText = loginButton.innerHTML;
        loginButton.innerHTML = 'Memverifikasi...';
        loginButton.disabled = true;

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await ApiService.login(data.username, data.password);
            
            // Simpan data user di localStorage untuk digunakan di halaman utama
            localStorage.setItem('mgo_user', JSON.stringify(response.user));
            
            window.location.href = 'index.php'; // Redirect to dashboard
        } catch (error) {
            alert('Login Gagal: ' + error.message);
            loginButton.innerHTML = originalButtonText;
            loginButton.disabled = false;
        }
    });
});