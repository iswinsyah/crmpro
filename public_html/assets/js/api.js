/**
 * API Service Module
 */
const API_BASE_URL = '/api'; // Disesuaikan untuk server produksi (Hostinger)

export class ApiService {
    
    static async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }
        return await response.json();
    }

    static async getLeads(role, userId) {
        try {
            const url = `${API_BASE_URL}/leads.php?action=list&role=${encodeURIComponent(role)}&user_id=${encodeURIComponent(userId)}`;
            const response = await fetch(url);
            return await this.handleResponse(response);
        } catch (error) {
            console.error("API Error (getLeads):", error);
            return []; 
        }
    }

    static async createLead(leadData) {
        try {
            const formData = new FormData();
            for (const key in leadData) {
                formData.append(key, leadData[key]);
            }

            const response = await fetch(`${API_BASE_URL}/leads.php?action=create`, {
                method: 'POST',
                body: formData
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("API Error (createLead):", error);
            throw error;
        }
    }

    static async updateLeadStatus(leadId, newStatus) {
        try {
            const formData = new FormData();
            formData.append('id', leadId);
            formData.append('status', newStatus);

            const response = await fetch(`${API_BASE_URL}/leads.php?action=update_status`, {
                method: 'POST',
                body: formData
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("API Error (updateLeadStatus):", error);
            throw error;
        }
    }

    static async generateAIContent(prompt) {
        try {
            const response = await fetch(`${API_BASE_URL}/gemini.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt })
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("API Error (generateAIContent):", error);
            throw error;
        }
    }
}