import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { mockReservations } from '../constants/mockData';

export default function ReservationScreen({ route, navigation }: any) {
  const newProduct = route?.params?.product;
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 saat saniye cinsinden

  useEffect(() => {
    if (!newProduct) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rezervasyonlarım</Text>
      </View>

      <ScrollView style={styles.body}>
        {/* New Reservation */}
        {newProduct && (
          <>
            <Text style={styles.sectionTtl}>🟢 Yeni Rezervasyon</Text>
            <View style={styles.activeCard}>
              <View style={styles.activeCardTop}>
                <View style={styles.productImg}>
                  <Text style={styles.productEmoji}>{newProduct.emoji}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{newProduct.name}</Text>
                  <Text style={styles.productStore}>{newProduct.store}</Text>
                  <Text style={styles.productPrice}>₺{newProduct.discountedPrice}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Aktif</Text>
                </View>
              </View>

              {/* QR Code placeholder */}
              <View style={styles.qrWrap}>
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrIcon}>📱</Text>
                  <Text style={styles.qrText}>QR Kod</Text>
                  <Text style={styles.qrCode}>CPK-{Math.floor(Math.random() * 9000 + 1000)}</Text>
                </View>
                <Text style={styles.qrHint}>Bu kodu mağaza kasasında göster</Text>
              </View>

              {/* Timer */}
              <View style={styles.timerWrap}>
                <Text style={styles.timerLabel}>⏳ Kalan Süre</Text>
                <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
                <Text style={styles.timerSub}>Rezervasyon 3 saat geçerlidir</Text>
              </View>

              <TouchableOpacity style={styles.mapsBtn}>
                <Text style={styles.mapsBtnText}>🗺️  Mağazaya Git</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Past Reservations */}
        <Text style={styles.sectionTtl}>📋 Geçmiş Rezervasyonlar</Text>
        {mockReservations.map(res => (
          <View key={res.id} style={[styles.historyCard, res.status === 'active' && styles.historyCardActive]}>
            <View style={styles.productImg}>
              <Text style={styles.productEmoji}>{res.product.emoji}</Text>
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.productName}>{res.product.name}</Text>
              <Text style={styles.productStore}>{res.product.store}</Text>
              <Text style={styles.historyTime}>🕐 {res.reservedAt} – {res.expiresAt}</Text>
              <Text style={styles.historyCode}>Kod: {res.code}</Text>
            </View>
            <View style={[styles.historyBadge, res.status === 'completed' && styles.historyBadgeCompleted]}>
              <Text style={[styles.historyBadgeText, res.status === 'completed' && styles.historyBadgeTextCompleted]}>
                {res.status === 'active' ? 'Aktif' : res.status === 'completed' ? 'Tamamlandı' : 'İptal'}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 30 }} />
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
  sectionTtl: { fontSize: 11, fontWeight: '800', color: Colors.ink4, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },
  activeCard: { backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.primaryMid, padding: 16, marginBottom: 16 },
  activeCardTop: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 },
  productImg: { width: 52, height: 52, backgroundColor: Colors.primaryLight, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  productEmoji: { fontSize: 26 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '900', color: Colors.ink, marginBottom: 2 },
  productStore: { fontSize: 11, color: Colors.ink3, marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: '900', color: Colors.primary },
  statusBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '900', color: Colors.primaryDark },
  qrWrap: { alignItems: 'center', marginBottom: 16 },
  qrPlaceholder: { width: 140, height: 140, backgroundColor: '#F3F4F6', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.ink5, borderStyle: 'dashed', marginBottom: 8 },
  qrIcon: { fontSize: 40, marginBottom: 6 },
  qrText: { fontSize: 11, color: Colors.ink4, fontWeight: '700' },
  qrCode: { fontSize: 14, fontWeight: '900', color: Colors.ink, marginTop: 4 },
  qrHint: { fontSize: 11, color: Colors.ink3, textAlign: 'center' },
  timerWrap: { backgroundColor: Colors.primaryLight, borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 14 },
  timerLabel: { fontSize: 11, color: Colors.primaryDark, fontWeight: '700', marginBottom: 4 },
  timerValue: { fontSize: 36, fontWeight: '900', color: Colors.primary, letterSpacing: 2 },
  timerSub: { fontSize: 10, color: Colors.ink3, marginTop: 4 },
  mapsBtn: { backgroundColor: Colors.blue, padding: 14, borderRadius: 14, alignItems: 'center' },
  mapsBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  historyCard: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 8 },
  historyCardActive: { borderColor: Colors.primaryMid },
  historyInfo: { flex: 1 },
  historyTime: { fontSize: 10, color: Colors.ink4, marginTop: 3 },
  historyCode: { fontSize: 10, color: Colors.primary, fontWeight: '800', marginTop: 2 },
  historyBadge: { backgroundColor: '#FFF0F0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  historyBadgeCompleted: { backgroundColor: Colors.primaryLight },
  historyBadgeText: { fontSize: 10, fontWeight: '900', color: Colors.red },
  historyBadgeTextCompleted: { color: Colors.primaryDark },
});