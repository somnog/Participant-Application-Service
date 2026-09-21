import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { QueryApplicationDto } from './dto/query-application.dto.js';
import { BulkStatusDto } from './dto/bulk-status.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApplicationDto) {
    // Verify participant exists
    const participant = await this.prisma.participant.findFirst({
      where: { id: dto.participantId, isActive: true },
    });
    if (!participant) {
      throw new NotFoundException(`Participant with id "${dto.participantId}" not found`);
    }
    return this.prisma.application.create({
      data: dto,
      include: { participant: true },
    });
  }

  async findAll(query: QueryApplicationDto) {
    const { status, workshopId, track, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (workshopId) where.workshopId = workshopId;
    if (track) where.track = track;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: { participant: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.application.count({ where }),
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
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { participant: true },
    });
    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found`);
    }
    return application;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    await this.findOne(id);
    return this.prisma.application.update({
      where: { id },
      data: dto,
      include: { participant: true },
    });
  }

  async bulkUpdateStatus(dto: BulkStatusDto) {
    const result = await this.prisma.application.updateMany({
      where: { id: { in: dto.ids } },
      data: { status: dto.status as any },
    });
    return { updated: result.count };
  }
}
