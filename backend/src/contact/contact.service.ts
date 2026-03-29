import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all contact messages — protected, admin only
  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single message by ID — protected, admin only
  async findOne(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }

    return message;
  }

  // Send a contact message — public, anyone can contact
  async create(createContactDto: CreateContactDto) {
    return this.prisma.contactMessage.create({
      data: createContactDto,
    });
  }

  // Mark a message as read — protected, admin only
  async markAsRead(id: string) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  // Delete a message — protected, admin only
  async remove(id: string) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}