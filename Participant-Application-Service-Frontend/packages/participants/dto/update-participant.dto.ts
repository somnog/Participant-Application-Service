/** Mirrors UpdateParticipantDto (PATCH /participants/:id). Every field is optional. */
export interface UpdateParticipantDto {
  name?: string;
  email?: string;
  organization?: string;
  phone?: string;
}
