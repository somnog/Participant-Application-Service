import type { ApplicationStatus } from '../application.types';

/** Mirrors UpdateApplicationDto (PATCH /applications/:id). */
export interface UpdateApplicationDto {
  status?: ApplicationStatus;
  workshopId?: string;
  track?: string;
}
