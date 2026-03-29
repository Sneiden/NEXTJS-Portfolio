import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all published posts — used by the public blog page
  async findAllPublished() {
    return this.prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get all posts including unpublished — used by the admin CMS
  async findAll() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single post by slug — used by the public post detail page
  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return post;
  }

  // Get a single post by ID — used by the admin CMS
  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return post;
  }

  // Create a new post — protected, admin only
  async create(createPostDto: CreatePostDto, authorId: string) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId,
      },
    });
  }

  // Update an existing post — protected, admin only
  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  // Delete a post — protected, admin only
  async remove(id: string) {
    await this.findOne(id); // Throws 404 if not found

    return this.prisma.post.delete({
      where: { id },
    });
  }
}