import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Public — frontend fetches this to render Hero + About
  @Get()
  getProfile() {
    return this.profileService.getProfile()
  }

  // Protected — only admin CMS can update
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateProfile(@Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(dto)
  }
}