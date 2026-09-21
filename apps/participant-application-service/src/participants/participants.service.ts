import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateParticipantDto } from './dto/create-participant.dto.js';
import { UpdateParticipantDto } from './dto/update-participant.dto.js';
import { QueryParticipantDto } from './dto/query-participant.dto.js';

@Injectable()
export class ParticipantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateParticipantDto) {
    return this.prisma.participant.create({ data: dto });
  }

  async findAll(query: QueryParticipantDto) {
    const { search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.participant.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      this.prisma.participant.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const participant = await this.prisma.participant.findFirst({
      where: { id, isActive: true },
      include: { applications: true },
    });
    if (!participant) {
      throw new NotFoundException(`Participant with id "${id}" not found`);
    }
    return participant;
  }

  async update(id: string, dto: UpdateParticipantDto) {
    await this.findOne(id);
    return this.prisma.participant.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.participant.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
