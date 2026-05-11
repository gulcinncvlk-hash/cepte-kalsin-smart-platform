import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';
import { mockProducts } from '../constants/mockData';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const categories = ['Tümü', '🥛 Süt', '🍞 Ekmek', '🥩 Et', '🥤 İçecek', '🧀 Peynir'];

export default function HomeScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    productService.getAll()
      .then(data => setProducts(data))
      .catch(() => setProducts(mockProducts))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'Tümü'
    ? products
    : products.filter(p => p.category?.includes(activeCategory.split(' ')[1]));

  const urgent = products.filter(p => p.daysLeft === 0);

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>İyi günler,</Text>
            <Text style={styles.name}>{user?.name || 'Hoş Geldiniz'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
          </TouchableOpacity>
        </View>
        <Text style={styles.loc}>📍 Konumunuza göre · 5 km çevresinde</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchText}>🔍  Ürün veya mağaza ara...</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.banner} onPress={() => navigation.navigate('Gamification')}>
        <View>
          <Text style={styles.bannerTitle}>{user?.points || 0} Puanın Var! 🏆</Text>
          <Text style={styles.bannerSub}>Rozetlerini ve ödüllerini gör</Text>
        </View>
        <View style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Görüntüle</Text>
        </View>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {categories.map(cat => (
          <TouchableOpacity key={cat} style={[styles.catChip, activeCategory === cat && styles.catChipActive]} onPress={() => setActiveCategory(cat)}>
            <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {urgent.length > 0 && (
        <>
          <View style={styles.sectionHdr}>
            <Text style={styles.sectionTtl}>Bugün Son Gün! 🔥</Text>
            <Text style={styles.sectionMore}>Tümü →</Text>
          </View>
          {urgent.map(product => (
            <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { product })}>
              <View style={styles.productImg}><Text style={styles.productEmoji}>{product.emoji}</Text></View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productStore}>📍 {product.store} · {product.distance}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceNew}>₺{product.discountedPrice}</Text>
                  <Text style={styles.priceOld}>₺{product.originalPrice}</Text>
                  <View style={styles.discountBadge}><Text style={styles.discountText}>%{product.discountPercent}</Text></View>
                </View>
                <View style={styles.sktRow}>
                  <View style={styles.sktDotRed} />
                  <Text style={styles.sktTextRed}>Bugün son gün!</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}

      <View style={styles.sectionHdr}>
        <Text style={styles.sectionTtl}>Tüm Fırsatlar</Text>
        <Text style={styles.sectionMore}>Tümü →</Text>
      </View>
      {filtered.map(product => (
        <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { product })}>
          <View style={styles.productImg}><Text style={styles.productEmoji}>{product.emoji}</Text></View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productStore}>📍 {product.store} · {product.distance}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceNew}>₺{product.discountedPrice}</Text>
              <Text style={styles.priceOld}>₺{product.originalPrice}</Text>
              <View style={styles.discountBadge}><Text style={styles.discountText}>%{product.discountPercent}</Text></View>
            </View>
            <View style={styles.sktRow}>
              <View style={[styles.sktDot, product.daysLeft === 0 && styles.sktDotRed]} />
              <Text style={[styles.sktText, product.daysLeft === 0 && styles.sktTextRed]}>
                {product.daysLeft === 0 ? 'Bugün son gün!' : `${product.daysLeft} gün kaldı`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: 12, color: Colors.ink3, fontWeight: '700' },
  header: { backgroundColor: Colors.primaryDark, paddingHorizontal: 18, paddingTop: 54, paddingBottom: 22 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  name: { fontSize: 20, fontWeight: '900', color: '#fff' },
  notifBtn: { width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, backgroundColor: Colors.red, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primaryDark },
  notifBadgeText: { fontSize: 8, color: '#fff', fontWeight: '900' },
  loc: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 14 },
  searchBox: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center' },
  searchText: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  banner: { margin: 14, backgroundColor: Colors.primary, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle: { fontSize: 14, fontWeight: '900', color: '#fff', marginBottom: 3 },
  bannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  bannerBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bannerBtnText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  catRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1.5, borderColor: Colors.ink5, backgroundColor: Colors.surface },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catChipText: { fontSize: 11, fontWeight: '800', color: Colors.ink3 },
  catChipTextActive: { color: '#fff' },
  sectionHdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  sectionTtl: { fontSize: 15, fontWeight: '900', color: Colors.ink },
  sectionMore: { fontSize: 11, color: Colors.primary, fontWeight: '800' },
  productCard: { marginHorizontal: 14, marginBottom: 10, backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 12, flexDirection: 'row', gap: 13 },
  productImg: { width: 56, height: 56, backgroundColor: Colors.primaryLight, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  productEmoji: { fontSize: 28 },
  productInfo: { flex: 1 },
  productName: { fontSize: 13, fontWeight: '900', color: Colors.ink, marginBottom: 2 },
  productStore: { fontSize: 11, color: Colors.ink3, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceNew: { fontSize: 16, fontWeight: '900', color: Colors.primary },
  priceOld: { fontSize: 11, color: Colors.ink4, textDecorationLine: 'line-through' },
  discountBadge: { marginLeft: 'auto', backgroundColor: Colors.primaryLight, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7 },
  discountText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },
  sktRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  sktDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.orange },
  sktDotRed: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.red },
  sktText: { fontSize: 10, color: Colors.orange, fontWeight: '800' },
  sktTextRed: { fontSize: 10, color: Colors.red, fontWeight: '800' },
});