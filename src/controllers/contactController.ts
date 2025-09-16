import { Request, Response } from 'express';
import { ContactModel } from '../models/Contact';
import { ApiResponse, CreateContactData, UpdateContactData } from '../types/Contact';

export class ContactController {
  // Get all contacts
  static async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await ContactModel.findAll();
      const response: ApiResponse<typeof contacts> = {
        success: true,
        data: contacts
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error fetching contacts',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // Get single contact
  static async getContactById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contactId = parseInt(id);
      
      if (isNaN(contactId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid contact ID'
        };
        res.status(400).json(response);
        return;
      }

      const contact = await ContactModel.findById(contactId);
      
      if (!contact) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Contact not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof contact> = {
        success: true,
        data: contact
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error fetching contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // Create new contact
  static async createContact(req: Request, res: Response): Promise<void> {
    try {
      const { name, phone }: CreateContactData = req.body;

      if (!name || !phone) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Name and phone are required'
        };
        res.status(400).json(response);
        return;
      }

      const contact = await ContactModel.create({ name, phone });
      
      const response: ApiResponse<typeof contact> = {
        success: true,
        message: 'Contact created successfully',
        data: contact
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error creating contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }

  // Update contact
  static async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, phone }: UpdateContactData = req.body;
      const contactId = parseInt(id);

      if (isNaN(contactId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid contact ID'
        };
        res.status(400).json(response);
        return;
      }

      if (!name || !phone) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Name and phone are required'
        };
        res.status(400).json(response);
        return;
      }

      const contact = await ContactModel.update(contactId, { name, phone });
      
      const response: ApiResponse<typeof contact> = {
        success: true,
        message: 'Contact updated successfully',
        data: contact
      };
      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Contact not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error updating contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }

  // Delete contact
  static async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contactId = parseInt(id);

      if (isNaN(contactId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid contact ID'
        };
        res.status(400).json(response);
        return;
      }

      await ContactModel.delete(contactId);
      
      const response: ApiResponse<null> = {
        success: true,
        message: 'Contact deleted successfully'
      };
      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Contact not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error deleting contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }
}
