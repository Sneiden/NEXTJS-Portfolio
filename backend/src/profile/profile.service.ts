import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { Prisma } from '../../generated/prisma/client'

const PROFILE_ID = 'singleton'

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile() {
    const profile = await this.prisma.profile.findUnique({
      where: { id: PROFILE_ID },
    })

    if (!profile) {
      throw new NotFoundException('Profile not found. Run the seed script first.')
    }

    return profile
  }

  async updateProfile(dto: UpdateProfileDto) {

    const skills = dto.skills
      ? (dto.skills as unknown as Prisma.InputJsonValue)
      : undefined

    const socialLinks = dto.socialLinks
      ? (dto.socialLinks as unknown as Prisma.InputJsonValue)
      : undefined

    return this.prisma.profile.upsert({
      where: { id: PROFILE_ID },
      update: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.availableForWork !== undefined && { availableForWork: dto.availableForWork }),
        ...(skills !== undefined && { skills }),
        ...(socialLinks !== undefined && { socialLinks }),
      },
      create: {
        id: PROFILE_ID,
        name: dto.name ?? '',
        title: dto.title ?? '',
        bio: dto.bio ?? '',
        imageUrl: dto.imageUrl ?? '',
        availableForWork: dto.availableForWork ?? true,
        skills: (dto.skills ?? []) as unknown as Prisma.InputJsonValue,
        socialLinks: (dto.socialLinks ?? {}) as unknown as Prisma.InputJsonValue,
      },
    })
  }
}