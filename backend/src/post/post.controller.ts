import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // GET /posts — public, returns only published posts
  @Get()
  findAll() {
    return this.postService.findAllPublished();
  }

  // GET /posts/admin — protected, returns all posts including unpublished
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.postService.findAll();
  }

  // GET /posts/:slug — public, returns a single post by slug
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  // POST /posts — protected, creates a new post
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.create(createPostDto, req.user.sub);
  }

  // PATCH /posts/:id — protected, updates a post
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  // DELETE /posts/:id — protected, deletes a post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}