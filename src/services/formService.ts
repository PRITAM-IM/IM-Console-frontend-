import axios from 'axios';
import type { FormTemplate } from '../types/formBuilder';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Axios instance with auth
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============================================
// FORM TEMPLATE API
// ============================================

export const formService = {
    // Get all forms for a project
    getFormsByProject: async (projectId: string): Promise<FormTemplate[]> => {
        const response = await apiClient.get(`/projects/${projectId}/forms`);
        return response.data;
    },

    // Get single form by ID
    getFormById: async (projectId: string, formId: string): Promise<FormTemplate> => {
        const response = await apiClient.get(`/projects/${projectId}/forms/${formId}`);
        return response.data;
    },

    // Create new form
    createForm: async (projectId: string, formData: Partial<FormTemplate>): Promise<FormTemplate> => {
        const response = await apiClient.post(`/projects/${projectId}/forms`, formData);
        return response.data;
    },

    // Update form
    updateForm: async (projectId: string, formId: string, formData: Partial<FormTemplate>): Promise<FormTemplate> => {
        const response = await apiClient.put(`/projects/${projectId}/forms/${formId}`, formData);
        return response.data;
    },

    // Delete form
    deleteForm: async (projectId: string, formId: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/forms/${formId}`);
    },

    // Publish/Unpublish form
    togglePublish: async (projectId: string, formId: string, isPublished: boolean): Promise<FormTemplate> => {
        const response = await apiClient.patch(`/projects/${projectId}/forms/${formId}/publish`, { isPublished });
        return response.data;
    },

    // Duplicate form
    duplicateForm: async (projectId: string, formId: string): Promise<FormTemplate> => {
        const response = await apiClient.post(`/projects/${projectId}/forms/${formId}/duplicate`);
        return response.data;
    },

    // Get public form by slug (no auth required)
    getPublicForm: async (slug: string): Promise<FormTemplate> => {
        const response = await axios.get(`${API_URL}/forms/${slug}`);
        return response.data;
    },

    // Submit form (public, no auth required)
    submitForm: async (slug: string, data: any): Promise<{ message: string; submissionId: string }> => {
        const response = await axios.post(`${API_URL}/forms/${slug}/submit`, data);
        return response.data;
    },

    // Get submissions for a form
    getSubmissions: async (
        projectId: string,
        formId: string,
        options?: { status?: string; limit?: number; skip?: number }
    ): Promise<{ submissions: any[]; total: number; limit: number; skip: number }> => {
        const response = await apiClient.get(`/projects/${projectId}/forms/${formId}/submissions`, {
            params: options,
        });
        return response.data;
    },

    // Get single submission
    getSubmission: async (projectId: string, formId: string, submissionId: string): Promise<any> => {
        const response = await apiClient.get(`/projects/${projectId}/forms/${formId}/submissions/${submissionId}`);
        return response.data;
    },

    // Delete submission
    deleteSubmission: async (projectId: string, formId: string, submissionId: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/forms/${formId}/submissions/${submissionId}`);
    },
};

export default formService;
