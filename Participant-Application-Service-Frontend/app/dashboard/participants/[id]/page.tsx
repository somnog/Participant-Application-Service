import { ParticipantDetails } from '@/packages/participants/components/ParticipantDetails';

export default async function ParticipantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ParticipantDetails id={id} />;
}
