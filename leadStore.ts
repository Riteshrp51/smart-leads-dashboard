import { create } from 'zustand';
import api from '../utils/api';
import type { Lead, PaginationInfo } from '../types';

interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface LeadState {
  leads: Lead[];
  pagination: PaginationInfo;
  selectedLead: Lead | null;
  loading: boolean;
  actionLoading: boolean; // separate loading state for creations/updates/deletions
  error: string | null;
  filters: LeadFilters;
  
  setFilters: (newFilters: LeadFilters) => void;
  resetFilters: () => void;
  fetchLeads: () => Promise<void>;
  fetchLeadById: (id: string) => Promise<void>;
  createLead: (leadData: { name: string; email: string; source: string; status?: string }) => Promise<boolean>;
  updateLead: (id: string, leadData: { name?: string; email?: string; source?: string; status?: string }) => Promise<boolean>;
  deleteLead: (id: string) => Promise<boolean>;
  clearError: () => void;
}

const initialFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalLeads: 0,
  },
  selectedLead: null,
  loading: false,
  actionLoading: false,
  error: null,
  filters: initialFilters,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      
      // Build query string
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const response = await api.get('/leads', { params });
      const { data, pagination } = response.data;
      
      set({ 
        leads: data, 
        pagination,
        loading: false 
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch leads';
      set({ error: message, loading: false });
    }
  },

  fetchLeadById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/leads/${id}`);
      set({ selectedLead: response.data.data, loading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch lead details';
      set({ error: message, loading: false });
    }
  },

  createLead: async (leadData) => {
    set({ actionLoading: true, error: null });
    try {
      await api.post('/leads', leadData);
      set({ actionLoading: false });
      // Refresh list
      get().fetchLeads();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to create lead';
      set({ error: message, actionLoading: false });
      return false;
    }
  },

  updateLead: async (id, leadData) => {
    set({ actionLoading: true, error: null });
    try {
      const response = await api.put(`/leads/${id}`, leadData);
      
      // Update selected lead state if it is the current one
      const currentSelected = get().selectedLead;
      if (currentSelected && currentSelected._id === id) {
        set({ selectedLead: response.data.data });
      }

      set({ actionLoading: false });
      // Refresh list
      get().fetchLeads();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to update lead';
      set({ error: message, actionLoading: false });
      return false;
    }
  },

  deleteLead: async (id) => {
    set({ actionLoading: true, error: null });
    try {
      await api.delete(`/leads/${id}`);
      set({ actionLoading: false });
      // Refresh list
      get().fetchLeads();
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete lead';
      set({ error: message, actionLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
