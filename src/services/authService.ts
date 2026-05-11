import { api } from './api';

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (ad: string, soyad: string, email: string, password: string, telefon: string) =>
    api.post('/auth/register', { ad, soyad, email, password, telefon }),
};