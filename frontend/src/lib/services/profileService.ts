import api from "@/lib/api";
import type { User } from "@/types";

export async function getProfile() {
  const res = await api.get<User>("/auth/me");
  return res.data;
}

export async function updateProfile(data: { full_name?: string; phone?: string }) {
  const res = await api.put<User>("/auth/me", data);
  return res.data;
}

export async function changePassword(data: { current_password: string; new_password: string }) {
  await api.put("/auth/me/password", data);
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post<{ id: string; filename: string; url: string }>("/files/upload?upload_type=resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
