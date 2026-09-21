import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service.js';
import { CreateParticipantDto } from './dto/create-participant.dto.js';
import { UpdateParticipantDto } from './dto/update-participant.dto.js';
import { QueryParticipantDto } from './dto/query-participant.dto.js';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateParticipantDto) {
    return this.participantsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryParticipantDto) {
    return this.participantsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateParticipantDto) {
    return this.participantsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.participantsService.remove(id);
  }
}
