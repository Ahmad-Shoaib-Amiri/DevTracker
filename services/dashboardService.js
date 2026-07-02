import api from "@/lib/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export const getDashboardLists = async () => {
  const response = await api.get("/dashboard/lists");
  return response.data;
};