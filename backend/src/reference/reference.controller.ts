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
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ReferenceService } from './reference.service';

@Controller('references')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  // GET /references — public, returns only published references
  @Get()
  findAll() {
    return this.referenceService.findAllPublished();
  }

  // GET /references/admin — protected, returns all references including unpublished
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.referenceService.findAll();
  }

  // GET /references/:id — public, returns a single reference by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referenceService.findOne(id);
  }

  // POST /references — protected, creates a new reference
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReferenceDto: CreateReferenceDto, @Request() req) {
    return this.referenceService.create(createReferenceDto, req.user.sub);
  }

  // PATCH /references/:id — protected, updates a reference
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReferenceDto: UpdateReferenceDto,
  ) {
    return this.referenceService.update(id, updateReferenceDto);
  }

  // DELETE /references/:id — protected, deletes a reference
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referenceService.remove(id);
  }
}