import api from '@/shared/ipconfig';
import { clean } from '@/shared/errors';
import type { PaginatedResponse } from '@/shared/pagination';
import type { Application } from './application.types';
import type { CreateApplicationDto } from './dto/create-application.dto';
import type { UpdateApplicationDto } from './dto/update-application.dto';
import type { QueryApplicationDto } from './dto/query-application.dto';
import type { BulkStatusDto } from './dto/bulk-status.dto';

/** One function per route in applications.controller.ts. */
export const applicationsService = {
  create: (dto: CreateApplicationDto) =>
    api.post<Application>('/applications', clean(dto)).then((r) => r.data),

  findAll: (query: QueryApplicationDto = {}) =>
    api
      .get<PaginatedResponse<Application>>('/applications', { params: clean(query) })
      .then((r) => r.data),

  findOne: (id: string) => api.get<Application>(`/applications/${id}`).then((r) => r.data),

  update: (id: string, dto: UpdateApplicationDto) =>
    api.patch<Application>(`/applications/${id}`, clean(dto)).then((r) => r.data),

  bulkUpdateStatus: (dto: BulkStatusDto) =>
    api.post<{ updated: number }>('/applications/bulk-status', dto).then((r) => r.data),
};
