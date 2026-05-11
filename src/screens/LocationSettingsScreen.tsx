import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

export default function LocationSettingsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [savedLocation, setSavedLocation] = useState<any>(null);
  const [manualAddress, setManualAddress] = useState('');

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const loc = await AsyncStorage.getItem('userLocation');
      if (loc) setSavedLocation(JSON.parse(loc));
    } catch (e) {}
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Konum İzni Gerekli',
          'Konumunuzu almak için izin vermeniz gerekiyor.',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Ayarlara Git', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      const locationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address: `${address?.district || ''}, ${address?.city || ''}`,
        street: address?.street || '',
        city: address?.city || '',
      };
      await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));
      setSavedLocation(locationData);
      Alert.alert('✅ Konum Kaydedildi!', `${locationData.address} olarak kaydedildi.`);
    } catch (e) {
      Alert.alert('❌ Hata', 'Konum alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const saveManualLocation = async () => {
    if (!manualAddress.trim()) {
      Alert.alert('❌ Hata', 'Adres boş olamaz!');
      return;
    }
    const locationData = { address: manualAddress, latitude: null, longitude: null };
    await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));
    setSavedLocation(locationData);
    Alert.alert('✅ Konum Kaydedildi!', `${manualAddress} olarak kaydedildi.`);
    setManualAddress('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Konumum</Text>
      </View>

      <ScrollView style={styles.body}>
        {savedLocation && (
          <View style={styles.savedCard}>
            <Text style={styles.savedIcon}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.savedTitle}>Kayıtlı Konum</Text>
              <Text style={styles.savedAddress}>{savedLocation.address}</Text>
            </View>
            <View style={styles.savedBadge}>
              <Text style={styles.savedBadgeText}>✓ Aktif</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTtl}>Otomatik Konum</Text>
        <View style={styles.card}>
          <Text style={styles.cardDesc}>GPS ile mevcut konumunuzu otomatik olarak alın</Text>
          <TouchableOpacity style={styles.gpsBtn} onPress={getCurrentLocation} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.gpsBtnText}>📍  Konumumu Al</Text>
            }
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTtl}>Manuel Konum Gir</Text>
        <View style={styles.card}>
          <Text style={styles.cardDesc}>Adresinizi manuel olarak girin</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Örn: Esenyurt, İstanbul"
              value={manualAddress}
              onChangeText={setManualAddress}
            />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={saveManualLocation}>
            <Text style={styles.saveBtnText}>✓  Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 54, paddingBottom: 18, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  backBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: '#fff' },
  title: { fontSize: 20, fontWeight: '900', color: '#fff' },
  body: { flex: 1, padding: 16 },
  savedCard: { backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, borderWidth: 1, borderColor: Colors.primaryMid },
  savedIcon: { fontSize: 28 },
  savedTitle: { fontSize: 11, fontWeight: '800', color: Colors.primaryDark, marginBottom: 3 },
  savedAddress: { fontSize: 14, fontWeight: '900', color: Colors.primaryDark },
  savedBadge: { backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  savedBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  sectionTtl: { fontSize: 10, fontWeight: '800', color: Colors.ink4, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  card: { backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 16, marginBottom: 16 },
  cardDesc: { fontSize: 13, color: Colors.ink3, marginBottom: 14 },
  gpsBtn: { backgroundColor: Colors.primary, padding: 14, borderRadius: 13, alignItems: 'center' },
  gpsBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  inputWrap: { backgroundColor: '#F7F9F8', borderWidth: 1.5, borderColor: Colors.ink5, borderRadius: 12, paddingHorizontal: 14, marginBottom: 12 },
  input: { fontSize: 14, color: Colors.ink2, paddingVertical: 12 },
  saveBtn: { backgroundColor: Colors.primary, padding: 14, borderRadius: 13, alignItems: 'center' },
  saveBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});
