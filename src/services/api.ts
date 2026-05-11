const BASE_URL = 'https://ceptekalsin-api.onrender.com/api';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },
};