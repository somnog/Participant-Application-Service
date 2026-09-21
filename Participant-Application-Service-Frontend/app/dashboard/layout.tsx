import type { ReactNode } from 'react';
import { DashboardShell } from '@/packages/layout/DashboardShell';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
