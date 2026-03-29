import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

// PartialType makes all fields from CreateProjectDto optional
// This means you can send only the fields you want to update
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}