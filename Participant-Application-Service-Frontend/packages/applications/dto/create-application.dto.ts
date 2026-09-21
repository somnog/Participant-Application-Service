import type { ApplicationStatus } from '../application.types';

/** Mirrors CreateApplicationDto (POST /applications). */
export interface CreateApplicationDto {
  participantId: string;
  workshopId?: string;
  track?: string;
  status?: ApplicationStatus;
}
