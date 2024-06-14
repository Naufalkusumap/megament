import axios from 'axios';

// Membuat instance axios
const api = axios.create({
  baseURL: 'http://34.101.96.10:8005/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fungsi untuk mengatur header Authorization
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Fungsi untuk mendapatkan riwayat tracker
export const getTrackerHistory = async (trackerId, take = 10, page = 1) => {
  try {
    const response = await api.get(`/trackers/history/${trackerId}`, {
      params: { take, page }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tracker history:', error);
    throw error;
  }
};

// Fungsi untuk memanggil data aset yang disetujui
export const getAssets = async () => {
  try {
    const response = await api.get('/assets/approved');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    throw error;
  }
};

// Fungsi untuk memanggil data aset yang belum disetujui
export const getUnapprovedAssets = async () => {
  try {
    const response = await api.get('/assets/unapproved');
    console.log("API response:", response.data); // Log respons API
    return response.data;
  } catch (error) {
    console.error('Failed to fetch unapproved assets:', error);
    throw error;
  }
};

// Fungsi untuk menambahkan aset baru
export const addAsset = async (data) => {
  try {
    const response = await api.post('/assets', data); // Menghapus trailing slash
    return response.data;
  } catch (error) {
    console.error('Failed to add asset:', error);
    throw error;
  }
};

// Fungsi untuk mengunggah gambar aset
export const uploadAssetImage = async (id, image) => {
  try {
    const formData = new FormData();
    formData.append('file', image);

    const response = await api.post(`/assets/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload asset image:', error);
    throw error;
  }
};

// Fungsi untuk menyetujui aset
export const approveAsset = async (id) => {
  try {
    const response = await api.post(`/assets/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Failed to approve asset:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan data history
export const getHistory = async (trackerId, take = 10, page = 1) => {
  try {
    const response = await api.get(`/trackers/history/${trackerId}`, {
      params: { take, page }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    throw error;
  }
};

// Fungsi untuk menolak aset (menghapus aset)
export const declineAsset = async (id) => {
  try {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to decline asset:', error);
    throw error;
  }
};

export default api;
