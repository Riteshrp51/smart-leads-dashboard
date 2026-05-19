export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: User | string; // populated User or its ID string
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalLeads: number;
}
