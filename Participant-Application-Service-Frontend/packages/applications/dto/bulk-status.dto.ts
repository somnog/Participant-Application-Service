import type { ApplicationStatus } from '../application.types';

/** Mirrors BulkStatusDto (POST /applications/bulk-status). */
export interface BulkStatusDto {
  ids: string[];
  status: ApplicationStatus;
}
