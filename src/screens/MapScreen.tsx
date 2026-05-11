import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '../constants/colors';
import { getNearbyStores, NearbyStore } from '../services/mapService';

export default function MapScreen({ navigation }: any) {
  const [location, setLocation] = useState<any>(null);
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [loading, setLoading] = useState(true);
  const [loadingStores, setLoadingStores] = useState(false);

  const filters = ['Tümü', 'A101', 'BİM', 'ŞOK'];

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Konum İzni Gerekli',
            'Yakınımdaki marketleri görmek için konum izni vermeniz gerekiyor.',
            [
              { text: 'İptal', style: 'cancel' },
              { text: 'Ayarlara Git', onPress: () => Linking.openSettings() }
            ]
          );
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(loc.coords);
        setLoadingStores(true);
        const nearbyStores = await getNearbyStores(loc.coords.latitude, loc.coords.longitude, 5);
        setStores(nearbyStores);
        setLoadingStores(false);
      } catch (e) {
        console.log('Konum hatası:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredStores = activeFilter === 'Tümü'
    ? stores
    : stores.filter(s => s.name.includes(activeFilter));

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Konum alınıyor...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yakınımdaki Marketler</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchText}>🔍  Konum veya market ara...</Text>
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 41.0092,
          longitude: location?.longitude || 28.9794,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredStores.map(store => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            onPress={() => setSelectedStore(store)}
          >
            <View style={[styles.markerWrap, selectedStore?.id === store.id && styles.markerWrapActive]}>
              <Text style={styles.markerEmoji}>{store.emoji}</Text>
              <Text style={[styles.markerText, selectedStore?.id === store.id && styles.markerTextActive]}>
                {store.name.split(' ')[0]}
                {store.productCount > 0 ? ` · ${store.productCount} ürün` : ' · 0 ürün'}
              </Text>
            </View>
            <View style={[styles.markerTail, selectedStore?.id === store.id && styles.markerTailActive]} />
          </Marker>
        ))}
      </MapView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.countRow}>
        {loadingStores ? (
          <View style={styles.countLoading}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.countLoadingText}>Çevredeki marketler aranıyor...</Text>
          </View>
        ) : (
          <Text style={styles.countText}>
            📍 5km çevresinde <Text style={styles.countBold}>{filteredStores.length} market</Text> bulundu
          </Text>
        )}
      </View>

      <ScrollView style={styles.storeList}>
        {filteredStores.length === 0 && !loadingStores && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyText}>Bu filtre için market bulunamadı</Text>
          </View>
        )}
        {filteredStores.map(store => (
          <TouchableOpacity
            key={store.id}
            style={[styles.storeCard, selectedStore?.id === store.id && styles.storeCardActive]}
            onPress={() => setSelectedStore(store)}
          >
            <View style={styles.storeIcon}>
              <Text style={styles.storeEmoji}>{store.emoji}</Text>
            </View>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeMeta}>📍 {store.distance} · {store.hours}</Text>
              <View style={styles.badges}>
                <View style={[styles.badge, store.productCount === 0 && styles.badgeGray]}>
                  <Text style={[styles.badgeText, store.productCount === 0 && styles.badgeTextGray]}>
                    {store.productCount > 0 ? `${store.productCount} indirimli ürün` : '0 ürün'}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: 12, color: Colors.ink3, fontWeight: '700' },
  header: {
    backgroundColor: Colors.surface,
    padding: 18, paddingTop: 54,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  title: { fontSize: 20, fontWeight: '900', color: Colors.ink, marginBottom: 10 },
  searchBox: {
    backgroundColor: '#F7F9F8', borderWidth: 1.5,
    borderColor: Colors.ink5, borderRadius: 14, padding: 10,
  },
  searchText: { fontSize: 12, color: Colors.ink3 },
  map: { height: 240 },
  markerWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 10, padding: 6,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4,
  },
  markerWrapActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  markerEmoji: { fontSize: 14 },
  markerText: { fontSize: 10, fontWeight: '800', color: Colors.ink },
  markerTextActive: { color: '#fff' },
  markerTail: {
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: Colors.surface, alignSelf: 'center',
  },
  markerTailActive: { borderTopColor: Colors.primary },
  filterRow: {
    backgroundColor: Colors.surface, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  chip: {
    paddingHorizontal: 13, paddingVertical: 6, borderRadius: 100,
    borderWidth: 1.5, borderColor: Colors.ink5, backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryMid },
  chipText: { fontSize: 11, fontWeight: '800', color: Colors.ink3 },
  chipTextActive: { color: Colors.primaryDark },
  countRow: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  countLoading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countLoadingText: { fontSize: 12, color: Colors.ink3, fontWeight: '600' },
  countText: { fontSize: 12, color: Colors.ink3, fontWeight: '600' },
  countBold: { fontWeight: '900', color: Colors.primary },
  storeList: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 14, color: Colors.ink3, fontWeight: '700' },
  storeCard: {
    marginHorizontal: 14, marginTop: 10,
    backgroundColor: Colors.surface, borderRadius: 18,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)',
    padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center',
  },
  storeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  storeIcon: {
    width: 46, height: 46, backgroundColor: Colors.primaryLight,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  storeEmoji: { fontSize: 22 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 13, fontWeight: '900', color: Colors.ink, marginBottom: 2 },
  storeMeta: { fontSize: 11, color: Colors.ink3, marginBottom: 5 },
  badges: { flexDirection: 'row', gap: 5 },
  badge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  badgeGray: { backgroundColor: '#F3F4F6' },
  badgeText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },
  badgeTextGray: { color: Colors.ink4 },
  arrow: { fontSize: 20, color: Colors.ink4 },
});