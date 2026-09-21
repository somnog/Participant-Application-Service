import api from '@/shared/ipconfig';
import { clean } from '@/shared/errors';
import type { PaginatedResponse } from '@/shared/pagination';
import type { Participant } from './participant.types';
import type { CreateParticipantDto } from './dto/create-participant.dto';
import type { UpdateParticipantDto } from './dto/update-participant.dto';
import type { QueryParticipantDto } from './dto/query-participant.dto';

/** One function per route in participants.controller.ts. */
export const participantsService = {
  create: (dto: CreateParticipantDto) =>
    api.post<Participant>('/participants', clean(dto)).then((r) => r.data),

  findAll: (query: QueryParticipantDto = {}) =>
    api
      .get<PaginatedResponse<Participant>>('/participants', { params: clean(query) })
      .then((r) => r.data),

  findOne: (id: string) => api.get<Participant>(`/participants/${id}`).then((r) => r.data),

  update: (id: string, dto: UpdateParticipantDto) =>
    api.patch<Participant>(`/participants/${id}`, clean(dto)).then((r) => r.data),

  /** Soft delete: the backend sets isActive = false and answers 204. */
  remove: (id: string) => api.delete<void>(`/participants/${id}`).then(() => undefined),
};
