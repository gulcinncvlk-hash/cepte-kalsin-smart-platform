import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { mockNotifications } from '../constants/mockData';

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filters = ['Tümü', 'İndirimler', 'Son Gün', 'Rezervasyon'];

  const filtered = activeFilter === 'Tümü'
    ? notifications
    : notifications.filter(n => {
        if (activeFilter === 'İndirimler') return n.tag.includes('İndirim') || n.tag.includes('Süt') || n.tag.includes('Et') || n.tag.includes('İçecek');
        if (activeFilter === 'Son Gün') return n.urgent;
        if (activeFilter === 'Rezervasyon') return n.tag.includes('Rezervasyon');
        return true;
      });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Bildirimler</Text>
            <Text style={styles.sub}>{notifications.filter(n => n.unread).length} okunmamış bildirim</Text>
          </View>
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <Text style={styles.markAllText}>Tümünü Okundu Say</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filter, activeFilter === f && styles.filterActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Bu kategoride bildirim yok</Text>
        </View>
      )}

      {filtered.map(notif => (
        <View key={notif.id} style={[styles.card, notif.unread && styles.cardUnread]}>
          <View style={styles.cardTop}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrap, notif.urgent && styles.iconWrapRed]}>
                <Text style={styles.icon}>{notif.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  {notif.unread && <View style={styles.unreadDot} />}
                  <Text style={styles.cardTitle}>{notif.title}</Text>
                </View>
                <Text style={styles.body}>{notif.body}</Text>
                <View style={[styles.tag, notif.urgent && styles.tagUrgent]}>
                  <Text style={[styles.tagText, notif.urgent && styles.tagTextUrgent]}>{notif.tag}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.time}>{notif.time}</Text>
          </View>
        </View>
      ))}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 18, paddingTop: 54, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  sub: { fontSize: 12, color: Colors.ink3 },
  markAllBtn: { backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  markAllText: { fontSize: 11, fontWeight: '800', color: Colors.primaryDark },
  filterRow: { flexDirection: 'row', gap: 8, padding: 14, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  filter: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, borderWidth: 1.5, borderColor: Colors.ink5 },
  filterActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryMid },
  filterText: { fontSize: 11, fontWeight: '800', color: Colors.ink3 },
  filterTextActive: { color: Colors.primaryDark },
  card: { marginHorizontal: 14, marginTop: 10, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 14 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: Colors.primary, backgroundColor: '#FAFFFE' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cardLeft: { flexDirection: 'row', gap: 10, flex: 1 },
  iconWrap: { width: 36, height: 36, backgroundColor: Colors.primaryLight, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconWrapRed: { backgroundColor: '#FFF0F0' },
  icon: { fontSize: 17 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  unreadDot: { width: 7, height: 7, backgroundColor: Colors.primary, borderRadius: 4 },
  cardTitle: { fontSize: 13, fontWeight: '900', color: Colors.ink },
  body: { fontSize: 12, color: Colors.ink3, lineHeight: 17, marginBottom: 8 },
  tag: { alignSelf: 'flex-start', backgroundColor: Colors.primaryLight, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 7 },
  tagUrgent: { backgroundColor: '#FFF0F0' },
  tagText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },
  tagTextUrgent: { color: Colors.red },
  time: { fontSize: 10, color: Colors.ink4, fontWeight: '600', flexShrink: 0 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: '700', color: Colors.ink3 },
});