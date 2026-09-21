import type { ApplicationStatus } from '../application.types';

/** Mirrors QueryApplicationDto (GET /applications). */
export interface QueryApplicationDto {
  status?: ApplicationStatus;
  workshopId?: string;
  track?: string;
  page?: number;
  limit?: number;
}
