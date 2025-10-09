import { RoomDetail } from "@/components/room-detail";

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  return <RoomDetail roomId={id} />;
}
