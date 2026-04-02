import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator'
import { Type } from 'class-transformer'

export class SkillGroupDto {
  @IsString()
  category: string

  @IsArray()
  @IsString({ each: true })
  items: string[]
}

export class SocialLinksDto {
  @IsOptional()
  @IsString()
  github?: string

  @IsOptional()
  @IsString()
  linkedin?: string

  @IsOptional()
  @IsString()
  email?: string
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsBoolean()
  availableForWork?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillGroupDto)
  skills?: SkillGroupDto[]

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto
}