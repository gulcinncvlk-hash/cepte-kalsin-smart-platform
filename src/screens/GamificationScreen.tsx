import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import PointsCard from '../components/PointsCard';
import ProgressBar from '../components/ProgressBar';
import { BADGES, REWARDS, calculatePoints } from '../constants/gamification';
import { mockUser } from '../constants/mockData';

export default function GamificationScreen() {
  const [activeTab, setActiveTab] = useState<'badges' | 'rewards'>('badges');
  const points = calculatePoints(mockUser.savedKg, mockUser.totalShopping);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rozetlerim 🏆</Text>
        <Text style={styles.sub}>Gıda kurtararak puan kazan, ödül al!</Text>
      </View>

      {/* Points Card */}
      <PointsCard points={points} savedKg={mockUser.savedKg} />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🌱</Text>
          <Text style={styles.statNum}>{mockUser.savedKg}kg</Text>
          <Text style={styles.statLbl}>Kurtarılan Gıda</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🛍️</Text>
          <Text style={styles.statNum}>{mockUser.totalShopping}</Text>
          <Text style={styles.statLbl}>Rezervasyon</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💰</Text>
          <Text style={styles.statNum}>₺{mockUser.totalSaving}</Text>
          <Text style={styles.statLbl}>Tasarruf</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'badges' && styles.tabActive]}
          onPress={() => setActiveTab('badges')}
        >
          <Text style={[styles.tabText, activeTab === 'badges' && styles.tabTextActive]}>🏅 Rozetler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rewards' && styles.tabActive]}
          onPress={() => setActiveTab('rewards')}
        >
          <Text style={[styles.tabText, activeTab === 'rewards' && styles.tabTextActive]}>🎁 Ödüller</Text>
        </TouchableOpacity>
      </View>

      {/* Badges */}
      {activeTab === 'badges' && (
        <View style={styles.section}>
          {BADGES.map(badge => {
            const isUnlocked = mockUser.savedKg >= badge.requiredKg;
            const progress = Math.min((mockUser.savedKg / badge.requiredKg) * 100, 100);
            return (
              <View key={badge.id} style={[styles.badgeCard, !isUnlocked && styles.badgeCardLocked]}>
                <View style={[styles.badgeIconWrap, { backgroundColor: isUnlocked ? badge.color : '#F3F4F6' }]}>
                  <Text style={[styles.badgeEmoji, !isUnlocked && styles.locked]}>{badge.emoji}</Text>
                </View>
                <View style={styles.badgeInfo}>
                  <View style={styles.badgeTitleRow}>
                    <Text style={[styles.badgeTitle, !isUnlocked && styles.lockedText]}>{badge.title}</Text>
                    {isUnlocked && (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedText}>✓ Kazanıldı</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.badgeDesc}>{badge.description}</Text>
                  {!isUnlocked && (
                    <View style={styles.badgeProgress}>
                      <ProgressBar progress={progress} height={6} color={badge.textColor} />
                      <Text style={styles.badgeProgressText}>{mockUser.savedKg}/{badge.requiredKg} kg</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Rewards */}
      {activeTab === 'rewards' && (
        <View style={styles.section}>
          <View style={styles.pointsHint}>
            <Text style={styles.pointsHintText}>💡 Mevcut puanın: <Text style={styles.pointsHintBold}>{points} puan</Text></Text>
          </View>
          {REWARDS.map(reward => {
            const canRedeem = points >= reward.requiredPoints;
            return (
              <View key={reward.id} style={[styles.rewardCard, !canRedeem && styles.rewardCardLocked]}>
                <View style={styles.rewardLeft}>
                  <Text style={styles.rewardEmoji}>{reward.emoji}</Text>
                  <View style={styles.rewardInfo}>
                    <Text style={[styles.rewardTitle, !canRedeem && styles.lockedText]}>{reward.title}</Text>
                    <Text style={styles.rewardDesc}>{reward.description}</Text>
                    <View style={styles.rewardPointsRow}>
                      <Text style={styles.rewardPoints}>🪙 {reward.requiredPoints} puan</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.redeemBtn, !canRedeem && styles.redeemBtnLocked]}
                  disabled={!canRedeem}
                >
                  <Text style={[styles.redeemText, !canRedeem && styles.redeemTextLocked]}>
                    {canRedeem ? 'Kullan' : `${reward.requiredPoints - points} puan eksik`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 18, paddingTop: 54 },
  title: { fontSize: 26, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  sub: { fontSize: 12, color: Colors.ink3 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)',
    padding: 14, alignItems: 'center',
  },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statNum: { fontSize: 16, fontWeight: '900', color: Colors.ink, marginBottom: 2 },
  statLbl: { fontSize: 9, fontWeight: '700', color: Colors.ink4, textTransform: 'uppercase', textAlign: 'center' },
  tabs: {
    flexDirection: 'row', backgroundColor: '#F3F4F6',
    borderRadius: 12, padding: 3, marginHorizontal: 16, marginBottom: 14,
  },
  tab: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  tabText: { fontSize: 13, fontWeight: '800', color: Colors.ink3 },
  tabTextActive: { color: Colors.primary },
  section: { paddingHorizontal: 16, gap: 10, paddingBottom: 30 },
  badgeCard: {
    backgroundColor: Colors.surface, borderRadius: 18,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)',
    padding: 14, flexDirection: 'row', gap: 14, alignItems: 'center',
  },
  badgeCardLocked: { opacity: 0.7 },
  badgeIconWrap: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badgeEmoji: { fontSize: 30 },
  locked: { opacity: 0.4 },
  badgeInfo: { flex: 1 },
  badgeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  badgeTitle: { fontSize: 15, fontWeight: '900', color: Colors.ink },
  lockedText: { color: Colors.ink4 },
  unlockedBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 7 },
  unlockedText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },
  badgeDesc: { fontSize: 11, color: Colors.ink3, marginBottom: 6 },
  badgeProgress: { gap: 4 },
  badgeProgressText: { fontSize: 10, color: Colors.ink4, fontWeight: '600' },
  pointsHint: { backgroundColor: Colors.primaryLight, padding: 12, borderRadius: 12, marginBottom: 4 },
  pointsHintText: { fontSize: 12, color: Colors.primaryDark, fontWeight: '700' },
  pointsHintBold: { fontWeight: '900' },
  rewardCard: {
    backgroundColor: Colors.surface, borderRadius: 18,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)',
    padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  rewardCardLocked: { opacity: 0.65 },
  rewardLeft: { flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 },
  rewardEmoji: { fontSize: 30 },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 14, fontWeight: '900', color: Colors.ink, marginBottom: 2 },
  rewardDesc: { fontSize: 11, color: Colors.ink3, marginBottom: 4 },
  rewardPointsRow: { flexDirection: 'row' },
  rewardPoints: { fontSize: 11, fontWeight: '800', color: Colors.orange },
  redeemBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 12,
  },
  redeemBtnLocked: { backgroundColor: '#F3F4F6' },
  redeemText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  redeemTextLocked: { color: Colors.ink4, fontSize: 10 },
});