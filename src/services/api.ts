import axios from 'axios';
import { Contact, CreateContactData, UpdateContactData, ApiResponse } from '../types/Contact';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contactService = {
  async getAllContacts(): Promise<Contact[]> {
    const res = await api.get<ApiResponse<Contact[]>>('/contacts');
    return res.data.data || [];
  },
  async createContact(data: CreateContactData): Promise<Contact> {
    const res = await api.post<ApiResponse<Contact>>('/contacts', data);
    return res.data.data!;
  },
  async updateContact(id: number, data: UpdateContactData): Promise<Contact> {
    const res = await api.put<ApiResponse<Contact>>(`/contacts/${id}`, data);
    return res.data.data!;
  },
  async deleteContact(id: number): Promise<void> {
    await api.delete(`/contacts/${id}`);
  },
};
