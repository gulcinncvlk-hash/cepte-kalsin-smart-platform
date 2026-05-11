import { api } from './api';

export const reservationService = {
  create: (tuketic_id: number, urun_id: number, miktar: number = 1) =>
    api.post('/reservations', { tuketic_id, urun_id, miktar }),

  getUserReservations: (userId: number) =>
    api.get(`/reservations/user/${userId}`),

  complete: (pin: string) =>
    api.post('/reservations/complete', { pin }),
};