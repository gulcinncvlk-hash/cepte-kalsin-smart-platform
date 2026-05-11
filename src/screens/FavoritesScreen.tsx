import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

export default function FavoritesScreen({ navigation }: any) {
  const [favorites, setFavorites] = useState<any[]>([]);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorilerim</Text>
        <Text style={styles.sub}>Takip ettiğin ürünler · {favorites.length} ürün</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyText}>Henüz favori ürün yok</Text>
          <Text style={styles.emptySub}>Ürün detayında ❤️ butonuna bas</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.emptyBtnText}>Ürünlere Göz At →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTtl}>{favorites.length} Favori Ürün</Text>
          {favorites.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.item}
              onPress={() => navigation.navigate('ProductDetail', { product })}
            >
              <View style={styles.itemImg}>
                <Text style={styles.itemEmoji}>{product.emoji}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{product.name}</Text>
                <Text style={styles.itemStore}>{product.store}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceNew}>₺{product.discountedPrice}</Text>
                  <Text style={styles.priceOld}>₺{product.originalPrice}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>%{product.discountPercent}</Text>
                  </View>
                </View>
                <View style={styles.sktRow}>
                  <View style={[styles.sktDot, product.daysLeft === 0 && styles.sktDotRed]} />
                  <Text style={[styles.sktText, product.daysLeft === 0 && styles.sktTextRed]}>
                    {product.daysLeft === 0 ? 'Bugün son gün!' : `${product.daysLeft} gün kaldı`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.heartBtn} onPress={() => removeFavorite(product.id)}>
                <Text style={styles.heartIcon}>❤️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </>
      )}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 18, paddingTop: 54 },
  title: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  sub: { fontSize: 12, color: Colors.ink3 },
  sectionTtl: { fontSize: 11, fontWeight: '800', color: Colors.ink4, letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: 16, paddingBottom: 8 },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginBottom: 8 },
  emptySub: { fontSize: 13, color: Colors.ink3, textAlign: 'center', marginBottom: 24 },
  emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { fontSize: 13, fontWeight: '900', color: '#fff' },
  item: { marginHorizontal: 14, marginBottom: 8, backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  itemImg: { width: 52, height: 52, backgroundColor: '#FFF0F0', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { fontSize: 26 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '900', color: Colors.ink, marginBottom: 2 },
  itemStore: { fontSize: 11, color: Colors.ink3, marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceNew: { fontSize: 14, fontWeight: '900', color: Colors.primary },
  priceOld: { fontSize: 11, color: Colors.ink4, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7 },
  discountText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },
  sktRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  sktDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.orange },
  sktDotRed: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.red },
  sktText: { fontSize: 10, color: Colors.orange, fontWeight: '800' },
  sktTextRed: { color: Colors.red },
  heartBtn: { width: 34, height: 34, backgroundColor: '#FFF0F0', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  heartIcon: { fontSize: 16 },
});