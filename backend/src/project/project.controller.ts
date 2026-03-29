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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // GET /projects — public, returns only published projects
  @Get()
  findAll() {
    return this.projectService.findAllPublished();
  }

  // GET /projects/admin — protected, returns all projects including unpublished
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.projectService.findAll();
  }

  // GET /projects/:slug — public, returns a single published project by slug
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projectService.findBySlug(slug);
  }

  // POST /projects — protected, creates a new project
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    // req.user.sub is the user ID from the JWT payload
    return this.projectService.create(createProjectDto, req.user.sub);
  }

  // PATCH /projects/:id — protected, updates a project
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  // DELETE /projects/:id — protected, deletes a project
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}