import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Colors } from '../constants/colors';

export default function NotificationSettingsScreen({ navigation }: any) {
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
  const [discountNotif, setDiscountNotif] = useState(true);
  const [sktNotif, setSktNotif] = useState(true);
  const [reservationNotif, setReservationNotif] = useState(true);
  const [askidaNotif, setAskidaNotif] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    if (status !== 'granted') {
      Alert.alert(
        'Bildirim İzni Gerekli',
        'Bildirimleri açmak için ayarlara gidin.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Ayarlara Git', onPress: () => Linking.openSettings() }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bildirim Ayarları</Text>
      </View>

      <ScrollView style={styles.body}>
        {permissionStatus !== 'granted' && (
          <View style={styles.permCard}>
            <Text style={styles.permIcon}>🔕</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>Bildirimler Kapalı</Text>
              <Text style={styles.permSub}>Bildirimlere izin vererek fırsatları kaçırmayın</Text>
            </View>
            <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
              <Text style={styles.permBtnText}>İzin Ver</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTtl}>Bildirim Tercihleri</Text>
        <View style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconEmoji}>💰</Text>
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>İndirim Bildirimleri</Text>
              <Text style={styles.menuSub}>Yeni indirimli ürünler eklenince bildir</Text>
            </View>
            <Switch value={discountNotif} onValueChange={setDiscountNotif} trackColor={{ true: Colors.primary }} />
          </View>
          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFF0F0' }]}>
              <Text style={styles.menuIconEmoji}>🚨</Text>
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>SKT Uyarıları</Text>
              <Text style={styles.menuSub}>Favori ürünlerin SKT yaklaşınca bildir</Text>
            </View>
            <Switch value={sktNotif} onValueChange={setSktNotif} trackColor={{ true: Colors.primary }} />
          </View>
          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.menuIconEmoji}>📋</Text>
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Rezervasyon Bildirimleri</Text>
              <Text style={styles.menuSub}>Rezervasyon durumu değişince bildir</Text>
            </View>
            <Switch value={reservationNotif} onValueChange={setReservationNotif} trackColor={{ true: Colors.primary }} />
          </View>
          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFF8E8' }]}>
              <Text style={styles.menuIconEmoji}>🤝</Text>
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Askıda Ürün Bildirimleri</Text>
              <Text style={styles.menuSub}>Yeni askıda ürün eklenince bildir</Text>
            </View>
            <Switch value={askidaNotif} onValueChange={setAskidaNotif} trackColor={{ true: Colors.primary }} />
          </View>
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
  permCard: { backgroundColor: '#FFF0F0', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, borderWidth: 1, borderColor: '#FFD5D0' },
  permIcon: { fontSize: 28 },
  permTitle: { fontSize: 14, fontWeight: '900', color: Colors.ink, marginBottom: 3 },
  permSub: { fontSize: 11, color: Colors.ink3, lineHeight: 16 },
  permBtn: { backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  permBtnText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  sectionTtl: { fontSize: 10, fontWeight: '800', color: Colors.ink4, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  menuCard: { backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  menuIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuIconEmoji: { fontSize: 17 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  menuSub: { fontSize: 11, color: Colors.ink3, marginTop: 1 },
});