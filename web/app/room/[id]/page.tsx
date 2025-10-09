import { RoomDetail } from "@/components/room-detail"

interface RoomPageProps {
  params: {
    id: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  return <RoomDetail roomId={params.id} />
}
