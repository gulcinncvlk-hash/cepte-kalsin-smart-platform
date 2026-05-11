import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: '👤', label: 'Kişisel Bilgiler', sub: 'Ad, soyad, telefon', color: Colors.primaryLight, screen: 'PersonalInfo' },
    { icon: '📋', label: 'Rezervasyonlarım', sub: 'Aktif rezervasyonlar', color: '#EFF6FF', screen: 'Reservation' },
    { icon: '📍', label: 'Konumum', sub: 'Konum ayarları', color: '#EFF6FF', screen: 'LocationSettings' },
    { icon: '🔔', label: 'Bildirim Ayarları', sub: 'SKT uyarıları, indirimler', color: '#FFF8E8', badge: '3', screen: 'NotificationSettings' },
    { icon: '🏆', label: 'Rozetlerim', sub: `${user?.points || 0} puan`, color: Colors.primaryLight, screen: 'Gamification' },
    { icon: '🌱', label: 'Tasarruf Geçmişim', sub: `₺${user?.totalSaving || 0} tasarruf sağlandı`, color: Colors.primaryLight },
    { icon: '🗑️', label: 'Çıkış Yap', color: '#FFF0F0', action: () => { logout(); navigation.navigate('Splash'); } },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Kullanıcı'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user?.totalShopping || 0}</Text>
            <Text style={styles.statLbl}>Alışveriş</Text>
          </View>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={styles.statNum}>₺{user?.totalSaving || 0}</Text>
            <Text style={styles.statLbl}>Tasarruf</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user?.savedKg || 0}kg</Text>
            <Text style={styles.statLbl}>Kurtarıldı</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.pointsBanner} onPress={() => navigation.navigate('Gamification')}>
        <Text style={styles.pointsBannerLeft}>🪙 {user?.points || 0} puan</Text>
        <Text style={styles.pointsBannerRight}>Ödül kullan →</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTtl}>Hesap & Ayarlar</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => item.action ? item.action() : item.screen && navigation.navigate(item.screen)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Text style={styles.menuIconEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.label}</Text>
                {item.sub && <Text style={styles.menuSub}>{item.sub}</Text>}
              </View>
              {item.badge && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { backgroundColor: Colors.primaryDark, paddingHorizontal: 18, paddingTop: 54, paddingBottom: 28, alignItems: 'center' },
  avatar: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 40 },
  name: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 3 },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 18 },
  stats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  stat: { flex: 1, padding: 12, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  statNum: { fontSize: 20, fontWeight: '900', color: '#fff' },
  statLbl: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 0.5 },
  pointsBanner: { margin: 16, backgroundColor: Colors.primary, borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsBannerLeft: { fontSize: 15, fontWeight: '900', color: '#fff' },
  pointsBannerRight: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.8)' },
  section: { marginHorizontal: 16 },
  sectionTtl: { fontSize: 10, fontWeight: '800', color: Colors.ink4, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  menuCard: { backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  menuIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  menuIconEmoji: { fontSize: 17 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  menuSub: { fontSize: 11, color: Colors.ink3, marginTop: 1 },
  menuBadge: { backgroundColor: Colors.red, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 100 },
  menuBadgeText: { fontSize: 10, color: '#fff', fontWeight: '900' },
  menuArrow: { fontSize: 18, color: Colors.ink4 },
});