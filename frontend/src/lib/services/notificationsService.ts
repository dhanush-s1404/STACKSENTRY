import api from "@/lib/api";
import type { Notification } from "@/types";

export interface PaginatedNotifications {
  items: Notification[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export async function getNotifications(params?: { is_read?: boolean; page?: number; per_page?: number }) {
  const res = await api.get<PaginatedNotifications>("/notifications", { params });
  return res.data;
}

export async function markNotificationRead(id: string) {
  const res = await api.put<Notification>(`/notifications/${id}`, { is_read: true });
  return res.data;
}

export async function markAllNotificationsRead() {
  await api.put("/notifications/read-all");
}

export async function deleteNotification(id: string) {
  await api.delete(`/notifications/${id}`);
}
