import { ApplicationDetails } from '@/packages/applications/components/ApplicationDetails';

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApplicationDetails id={id} />;
}
