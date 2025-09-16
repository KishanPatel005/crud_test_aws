import axios from 'axios';
import { Contact, CreateContactData, UpdateContactData, ApiResponse } from '../types/Contact';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contactService = {
  // Get all contacts
  async getAllContacts(): Promise<Contact[]> {
    const response = await api.get<ApiResponse<Contact[]>>('/contacts');
    return response.data.data || [];
  },

  // Get single contact
  async getContactById(id: number): Promise<Contact> {
    const response = await api.get<ApiResponse<Contact>>(`/contacts/${id}`);
    if (!response.data.data) {
      throw new Error('Contact not found');
    }
    return response.data.data;
  },

  // Create new contact
  async createContact(data: CreateContactData): Promise<Contact> {
    const response = await api.post<ApiResponse<Contact>>('/contacts', data);
    if (!response.data.data) {
      throw new Error('Failed to create contact');
    }
    return response.data.data;
  },

  // Update contact
  async updateContact(id: number, data: UpdateContactData): Promise<Contact> {
    const response = await api.put<ApiResponse<Contact>>(`/contacts/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update contact');
    }
    return response.data.data;
  },

  // Delete contact
  async deleteContact(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/contacts/${id}`);
  },
};
