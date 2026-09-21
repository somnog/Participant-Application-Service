import type { Participant } from '@/packages/participants/participant.types';

/** Mirrors enum ApplicationStatus in schema.prisma — lowercase, exactly. */
export const APPLICATION_STATUSES = ['pending', 'approved', 'rejected', 'enrolled'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_COLOR: Record<ApplicationStatus, string> = {
  pending: 'gold',
  approved: 'blue',
  rejected: 'red',
  enrolled: 'green',
};

/** Mirrors model Application in schema.prisma. */
export interface Application {
  id: string;
  status: ApplicationStatus;
  workshopId: string | null;
  track: string | null;
  participantId: string;
  /** The backend includes the participant on list, detail, create and update. */
  participant?: Participant;
  createdAt: string;
  updatedAt: string;
}
