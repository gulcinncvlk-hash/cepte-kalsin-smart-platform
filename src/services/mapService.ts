export interface NearbyStore {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: string;
  emoji: string;
  productCount: number;
  hours: string;
  chain: string;
}

const STORE_CHAINS = ['A101', 'BIM', 'SOK'];

const getEmoji = (name: string) => {
  if (name.toUpperCase().includes('A101')) return '🏪';
  if (name.toUpperCase().includes('BIM') || name.toUpperCase().includes('BİM')) return '🏬';
  if (name.toUpperCase().includes('SOK') || name.toUpperCase().includes('ŞOK')) return '🏪';
  return '🏪';
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
};

const fetchChain = async (chain: string, latitude: number, longitude: number, radiusMeters: number) => {
  const query = `[out:json][timeout:10];(node["name"~"${chain}",i](around:${radiusMeters},${latitude},${longitude});way["name"~"${chain}",i](around:${radiusMeters},${latitude},${longitude}););out center 15;`;

  const endpoints = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!response.ok) continue;
      const text = await response.text();
      if (text.trim().startsWith('<')) continue;
      const data = JSON.parse(text);
      return data.elements || [];
    } catch (e) {
      continue;
    }
  }
  return [];
};

export const getNearbyStores = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<NearbyStore[]> => {
  const radiusMeters = radiusKm * 1000;
  const allStores: NearbyStore[] = [];

  for (const chain of STORE_CHAINS) {
    const elements = await fetchChain(chain, latitude, longitude, radiusMeters);
    const chainStores: NearbyStore[] = elements
      .map((el: any) => {
        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        if (!lat || !lon) return null;
        const name = el.tags?.name || chain;
        return {
          id: `${el.type}-${el.id}`,
          name,
          latitude: lat,
          longitude: lon,
          distance: calculateDistance(latitude, longitude, lat, lon),
          emoji: getEmoji(name),
          productCount: 0,
          hours: el.tags?.opening_hours || '07:00 – 22:00',
          chain,
        };
      })
      .filter(Boolean);

    allStores.push(...chainStores);
  }

  if (allStores.length === 0) {
    // Hiçbir API çalışmadıysa kullanıcı konumuna yakın mock data döndür
    return [
      { id: '1', name: 'A101 Yakın Şube', latitude: latitude + 0.002, longitude: longitude + 0.001, distance: '0.3km', emoji: '🏪', productCount: 3, hours: '07:00 – 22:00', chain: 'A101' },
      { id: '2', name: 'BİM Yakın Şube', latitude: latitude + 0.005, longitude: longitude - 0.003, distance: '0.8km', emoji: '🏬', productCount: 1, hours: '07:30 – 22:00', chain: 'BİM' },
      { id: '3', name: 'ŞOK Yakın Şube', latitude: latitude + 0.008, longitude: longitude - 0.005, distance: '1.4km', emoji: '🏪', productCount: 2, hours: '08:00 – 22:00', chain: 'ŞOK' },
      { id: '4', name: 'A101 Merkez', latitude: latitude - 0.004, longitude: longitude + 0.003, distance: '1.1km', emoji: '🏪', productCount: 0, hours: '07:00 – 22:00', chain: 'A101' },
      { id: '5', name: 'BİM Mahalle', latitude: latitude - 0.007, longitude: longitude - 0.004, distance: '1.9km', emoji: '🏬', productCount: 2, hours: '07:30 – 22:00', chain: 'BİM' },
      { id: '6', name: 'ŞOK Çarşı', latitude: latitude + 0.012, longitude: longitude + 0.008, distance: '2.3km', emoji: '🏪', productCount: 1, hours: '08:00 – 22:00', chain: 'ŞOK' },
    ];
  }

  return allStores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};