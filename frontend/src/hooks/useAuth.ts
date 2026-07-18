import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types";

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, setUser } = useAuthStore();

  const loginUser = async (data: LoginRequest) => {
    const res = await api.post<TokenResponse>("/auth/login", data);
    login(res.data.user, res.data.accessToken, res.data.refreshToken);
    return res.data;
  };

  const registerUser = async (data: RegisterRequest) => {
    await api.post("/auth/register", data);
  };

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — clear local state anyway
    }
    logout();
  };

  const fetchMe = async () => {
    const res = await api.get<User>("/auth/me");
    setUser(res.data);
    return res.data;
  };

  const updateProfile = async (data: { full_name?: string; phone?: string }) => {
    const res = await api.put<User>("/auth/me", data);
    setUser(res.data);
    return res.data;
  };

  const changePassword = async (data: { current_password: string; new_password: string }) => {
    await api.put("/auth/me/password", data);
  };

  return {
    user,
    token,
    isAuthenticated,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    fetchMe,
    updateProfile,
    changePassword,
    setUser,
    isCandidate: user?.role === "candidate",
    isHR: user?.role === "hr",
    isAdmin: user?.role === "admin",
  };
}
