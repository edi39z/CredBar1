import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export async function createNotification({
  userId,
  roomId,
  type,
  title,
  message,
}: {
  userId: number;
  roomId?: number;
  type: NotificationType;
  title: string;
  message: string;
}) {
  return await prisma.notification.create({
    data: {
      userId,
      roomId,
      type,
      title,
      message,
      priority: "NORMAL",
    },
  });
}