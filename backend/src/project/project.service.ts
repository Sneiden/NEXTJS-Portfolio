import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all published projects — used by the public portfolio page
  async findAllPublished() {
    return this.prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get all projects including unpublished — used by the admin CMS
  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single project by slug — used by the public project detail page
  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }

    return project;
  }

  // Get a single project by ID — used by the admin CMS
  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  // Create a new project — protected, admin only
  async create(createProjectDto: CreateProjectDto, authorId: string) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        authorId,
      },
    });
  }

  // Update an existing project — protected, admin only
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  // Delete a project — protected, admin only
  async remove(id: string) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.project.delete({
      where: { id },
    });
  }
}