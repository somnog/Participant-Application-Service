/** Mirrors QueryParticipantDto (GET /participants). */
export const PARTICIPANT_SORT_FIELDS = ['name', 'email', 'organization', 'createdAt'] as const;
export type ParticipantSortField = (typeof PARTICIPANT_SORT_FIELDS)[number];

export interface QueryParticipantDto {
  search?: string;
  sortBy?: ParticipantSortField;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
