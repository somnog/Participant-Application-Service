/** Mirrors CreateParticipantDto (POST /participants). */
export interface CreateParticipantDto {
  name: string;
  email: string;
  organization?: string;
  phone?: string;
}
