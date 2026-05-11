import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Colors } from '../constants/colors';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [reserving, setReserving] = useState(false);

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${product.latitude},${product.longitude}`;
    Linking.openURL(url);
  };

  const handleReserve = () => {
    setReserving(true);
    setTimeout(() => {
      setReserving(false);
      navigation.navigate('Reservation', { product });
    }, 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.imgWrap}>
          <Text style={styles.emoji}>{product.emoji}</Text>
        </View>
        <Text style={styles.storeChip}>📍 {product.store}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.sktRow}>
          <View style={[styles.sktBadge, product.daysLeft === 0 && styles.sktBadgeRed]}>
            <Text style={styles.sktBadgeText}>
              {product.daysLeft === 0 ? '🔴 Bugün son gün!' : `🟡 ${product.daysLeft} gün kaldı`}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body}>
        {/* Price */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceNew}>₺{product.discountedPrice}<Text style={styles.priceNewSub}>,00</Text></Text>
            <Text style={styles.priceOld}>₺{product.originalPrice},00 normal fiyat</Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>%{product.discountPercent}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📦</Text>
            <Text style={styles.infoVal}>{product.stock}</Text>
            <Text style={styles.infoLbl}>Stok</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoVal}>{product.expiryDate}</Text>
            <Text style={styles.infoLbl}>SKT</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoVal}>{product.distance}</Text>
            <Text style={styles.infoLbl}>Mesafe</Text>
          </View>
        </View>

        {/* Reservation Info */}
        <View style={styles.reserveInfoCard}>
          <Text style={styles.reserveInfoIcon}>ℹ️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.reserveInfoTitle}>Nasıl çalışır?</Text>
            <Text style={styles.reserveInfoText}>Ürünü rezerve et, mağazaya git ve indirimli fiyatla al. Rezervasyon 3 saat geçerlidir.</Text>
          </View>
        </View>

        {/* Tags */}
        <Text style={styles.sectionTtl}>Etiketler</Text>
        <View style={styles.tags}>
          <View style={styles.tag}><Text style={styles.tagText}>{product.category}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>🏷️ İndirimli</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>🌱 İsrafı Önle</Text></View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity style={[styles.favBtn, isFavorite && styles.favBtnActive]} onPress={() => setIsFavorite(!isFavorite)}>
          <Text style={{ fontSize: 22 }}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapsBtn} onPress={openMaps}>
          <Text style={styles.mapsBtnText}>🗺️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reserveBtn} onPress={handleReserve}>
          <Text style={styles.reserveBtnText}>{reserving ? '⏳ Rezerve ediliyor...' : '✅  Rezerve Et'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { backgroundColor: Colors.primaryDark, paddingHorizontal: 18, paddingTop: 54, paddingBottom: 28, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  backText: { fontSize: 18, color: '#fff' },
  imgWrap: { width: 110, height: 110, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 18, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  emoji: { fontSize: 58 },
  storeChip: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '700', marginBottom: 8 },
  name: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 10 },
  sktRow: { flexDirection: 'row' },
  sktBadge: { backgroundColor: 'rgba(243,156,18,0.85)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 },
  sktBadgeRed: { backgroundColor: 'rgba(231,76,60,0.85)' },
  sktBadgeText: { fontSize: 11, color: '#fff', fontWeight: '900' },
  body: { flex: 1, padding: 16 },
  priceCard: { backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  priceNew: { fontSize: 30, fontWeight: '900', color: Colors.primary },
  priceNewSub: { fontSize: 14, color: Colors.ink4, fontWeight: '700' },
  priceOld: { fontSize: 12, color: Colors.ink4, textDecorationLine: 'line-through', marginTop: 2 },
  discountBadge: { marginLeft: 'auto', backgroundColor: Colors.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  discountText: { fontSize: 18, fontWeight: '900', color: Colors.primaryDark },
  infoRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  infoItem: { flex: 1, backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 12, alignItems: 'center' },
  infoIcon: { fontSize: 18, marginBottom: 5 },
  infoVal: { fontSize: 12, fontWeight: '900', color: Colors.ink, marginBottom: 2, textAlign: 'center' },
  infoLbl: { fontSize: 9, fontWeight: '700', color: Colors.ink4, textTransform: 'uppercase', letterSpacing: 0.5 },
  reserveInfoCard: { backgroundColor: Colors.primaryLight, borderRadius: 14, padding: 14, flexDirection: 'row', gap: 10, marginBottom: 14, borderWidth: 1, borderColor: Colors.primaryMid },
  reserveInfoIcon: { fontSize: 18 },
  reserveInfoTitle: { fontSize: 12, fontWeight: '900', color: Colors.primaryDark, marginBottom: 3 },
  reserveInfoText: { fontSize: 11, color: Colors.primaryDark, lineHeight: 16, opacity: 0.8 },
  sectionTtl: { fontSize: 13, fontWeight: '900', color: Colors.ink, marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 100 },
  tagText: { fontSize: 11, fontWeight: '700', color: Colors.ink2 },
  cta: { flexDirection: 'row', gap: 8, padding: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  favBtn: { width: 50, height: 50, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.ink5, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  favBtnActive: { backgroundColor: '#FFF0F0', borderColor: Colors.red },
  mapsBtn: { width: 50, height: 50, backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  mapsBtnText: { fontSize: 22 },
  reserveBtn: { flex: 1, backgroundColor: Colors.primary, padding: 14, borderRadius: 14, alignItems: 'center' },
  reserveBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});