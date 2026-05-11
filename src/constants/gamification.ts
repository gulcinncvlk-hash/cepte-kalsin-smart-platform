export const BADGES = [
  {
    id: '1',
    emoji: '🌱',
    title: 'Tohum',
    description: '1 kg gıda kurtar',
    requiredKg: 1,
    color: '#E8F8F2',
    textColor: '#0F6E56',
  },
  {
    id: '2',
    emoji: '🌿',
    title: 'Filiz',
    description: '5 kg gıda kurtar',
    requiredKg: 5,
    color: '#E8F8F2',
    textColor: '#0F6E56',
  },
  {
    id: '3',
    emoji: '🌳',
    title: 'Ağaç',
    description: '15 kg gıda kurtar',
    requiredKg: 15,
    color: '#E8F8F2',
    textColor: '#0F6E56',
  },
  {
    id: '4',
    emoji: '⭐',
    title: 'Kahraman',
    description: '30 kg gıda kurtar',
    requiredKg: 30,
    color: '#FFF8E8',
    textColor: '#C07000',
  },
  {
    id: '5',
    emoji: '🏆',
    title: 'Efsane',
    description: '50 kg gıda kurtar',
    requiredKg: 50,
    color: '#FFF0F0',
    textColor: '#C0392B',
  },
];

export const REWARDS = [
  {
    id: '1',
    emoji: '🎫',
    title: '%5 Ekstra İndirim',
    description: 'Sonraki alışverişinde geçerli',
    requiredPoints: 100,
    type: 'discount',
  },
  {
    id: '2',
    emoji: '🎁',
    title: '%10 Ekstra İndirim',
    description: 'Tüm ürünlerde geçerli',
    requiredPoints: 250,
    type: 'discount',
  },
  {
    id: '3',
    emoji: '👑',
    title: 'VIP Üyelik (1 Ay)',
    description: 'Özel fırsatlara erken erişim',
    requiredPoints: 500,
    type: 'vip',
  },
  {
    id: '4',
    emoji: '🛍️',
    title: 'Ücretsiz Ürün',
    description: "₺50'ye kadar ücretsiz ürün",
    requiredPoints: 750,
    type: 'free_product',
  },
];

export const POINT_RULES = {
  perKgSaved: 10,
  perReservation: 5,
  bonusStreak: 15,
  perAskida: 20,
  discountMultiplier: 2,
};

export const getCurrentBadge = (savedKg: number) => {
  return [...BADGES].reverse().find(b => savedKg >= b.requiredKg) || BADGES[0];
};

export const getNextBadge = (savedKg: number) => {
  return BADGES.find(b => savedKg < b.requiredKg);
};

export const calculatePoints = (savedKg: number, reservations: number) => {
  return savedKg * POINT_RULES.perKgSaved + reservations * POINT_RULES.perReservation;
};

export const getProgressPercent = (savedKg: number) => {
  const current = getCurrentBadge(savedKg);
  const next = getNextBadge(savedKg);
  if (!next) return 100;
  return Math.min(
    ((savedKg - current.requiredKg) / (next.requiredKg - current.requiredKg)) * 100,
    100
  );
};