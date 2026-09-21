import type { Application } from '@/packages/applications/application.types';

/** Mirrors model Participant in apps/participant-application-service/prisma/schema.prisma */
export interface Participant {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** Only returned by GET /participants/:id */
  applications?: Application[];
}
