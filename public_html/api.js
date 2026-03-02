const API_BASE_URL = 'api/';

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Unknown server error');
    }
    return response.json();
}

export const ApiService = {
    // --- Authentication ---
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return handleResponse(response);
    },

    async signup(userData) {
        const response = await fetch(`${API_BASE_URL}signup.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    // --- Data Fetching ---
    async getDevelopers() {
        const response = await fetch(`${API_BASE_URL}get_developers.php`);
        return handleResponse(response);
    },

    async getLeads(userId) {
        const response = await fetch(`${API_BASE_URL}leads.php?action=list&user_id=${userId}`);
        return handleResponse(response);
    },

    // --- Data Mutation ---
    async createLead(formData) {
        const response = await fetch(`${API_BASE_URL}leads.php?action=create`, {
            method: 'POST',
            body: formData
        });
        return handleResponse(response);
    },

    async updateLeadStatus(id, status) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('status', status);
        
        const response = await fetch(`${API_BASE_URL}leads.php?action=update_status`, {
            method: 'POST',
            body: formData
        });
        return handleResponse(response);
    },
};