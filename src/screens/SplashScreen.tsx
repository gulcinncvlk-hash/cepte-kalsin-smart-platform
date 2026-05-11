import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

export default function SplashScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Text style={styles.logoEmoji}>🛒</Text>
      </View>
      <View style={styles.tagWrap}>
        <Text style={styles.tag}>GIDA TASARRUF UYGULAMASI</Text>
      </View>
      <Text style={styles.title}>Cepte Kalsın</Text>
      <Text style={styles.sub}>SKT yaklaşan ürünleri fırsata çevir, israfı önle</Text>
      <View style={styles.featureRow}>
        <View style={styles.featureItem}><Text style={styles.featureEmoji}>💰</Text><Text style={styles.featureText}>İndirimli Ürünler</Text></View>
        <View style={styles.featureItem}><Text style={styles.featureEmoji}>🌱</Text><Text style={styles.featureText}>İsrafı Önle</Text></View>
        <View style={styles.featureItem}><Text style={styles.featureEmoji}>🏆</Text><Text style={styles.featureText}>Puan Kazan</Text></View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.btnText}>🚀  Hemen Başla</Text>
      </TouchableOpacity>
      <Text style={styles.link}>Hesabın var mı? <Text style={styles.linkBold} onPress={() => navigation.navigate('Login')}>Giriş Yap</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryXDark, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logoWrap: { width: 90, height: 90, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  logoEmoji: { fontSize: 44 },
  tagWrap: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 100, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  tag: { fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 34, fontWeight: '900', color: '#fff', marginBottom: 10 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  featureRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  featureItem: { alignItems: 'center', gap: 6 },
  featureEmoji: { fontSize: 22 },
  featureText: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '700', textAlign: 'center' },
  btn: { width: '100%', backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 14 },
  btnText: { fontSize: 15, fontWeight: '900', color: Colors.primaryDark },
  link: { fontSize: 12, color: 'rgba(255,255,255,0.55)' },
  linkBold: { color: 'rgba(255,255,255,0.9)', fontWeight: '800' },
});