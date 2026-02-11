export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/estadisticas');
    return response.data;
  } catch (error) {
    throw error;
  }
};