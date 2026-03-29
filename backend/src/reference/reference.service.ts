import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';

@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all published references — used by the public references page
  async findAllPublished() {
    return this.prisma.reference.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get all references including unpublished — used by the admin CMS
  async findAll() {
    return this.prisma.reference.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single reference by ID
  async findOne(id: string) {
    const reference = await this.prisma.reference.findUnique({
      where: { id },
    });

    if (!reference) {
      throw new NotFoundException(`Reference with ID "${id}" not found`);
    }

    return reference;
  }

  // Create a new reference — protected, admin only
  async create(createReferenceDto: CreateReferenceDto, authorId: string) {
    return this.prisma.reference.create({
      data: {
        ...createReferenceDto,
        authorId,
      },
    });
  }

  // Update an existing reference — protected, admin only
  async update(id: string, updateReferenceDto: UpdateReferenceDto) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.reference.update({
      where: { id },
      data: updateReferenceDto,
    });
  }

  // Delete a reference — protected, admin only
  async remove(id: string) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.reference.delete({
      where: { id },
    });
  }
}