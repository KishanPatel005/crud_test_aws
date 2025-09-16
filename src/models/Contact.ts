import prisma from '../config/database';
import { Contact, CreateContactData, UpdateContactData } from '../types/Contact';

export class ContactModel {
  static async findAll(): Promise<Contact[]> {
    return await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async findById(id: number): Promise<Contact | null> {
    return await prisma.contact.findUnique({
      where: { id }
    });
  }

  static async create(data: CreateContactData): Promise<Contact> {
    return await prisma.contact.create({
      data: {
        name: data.name,
        phone: data.phone
      }
    });
  }

  static async update(id: number, data: UpdateContactData): Promise<Contact> {
    return await prisma.contact.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone
      }
    });
  }

  static async delete(id: number): Promise<Contact> {
    return await prisma.contact.delete({
      where: { id }
    });
  }
}
