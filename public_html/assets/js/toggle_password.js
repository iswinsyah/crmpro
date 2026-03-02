document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', function (e) {
        const btn = e.target.closest('.toggle-password-btn');
        if (!btn) return;

        const container = btn.closest('.relative');
        const input = container.querySelector('input');
        const iconEye = btn.querySelector('.icon-eye');
        const iconEyeSlash = btn.querySelector('.icon-eye-slash');

        if (input.type === 'password') {
            input.type = 'text';
            iconEye.classList.add('hidden');
            iconEyeSlash.classList.remove('hidden');
        } else {
            input.type = 'password';
            iconEye.classList.remove('hidden');
            iconEyeSlash.classList.add('hidden');
        }
    });
});