import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import ProgressBar from './ProgressBar';
import { getCurrentBadge, getNextBadge } from '../constants/gamification';

interface Props {
  points: number;
  savedKg: number;
}

export default function PointsCard({ points, savedKg }: Props) {
  const currentBadge = getCurrentBadge(savedKg);
  const nextBadge = getNextBadge(savedKg);
  const progress = nextBadge
    ? ((savedKg - currentBadge.requiredKg) / (nextBadge.requiredKg - currentBadge.requiredKg)) * 100
    : 100;

  return (
    <View style={styles.card}>
      {/* Points Row */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.pointsLabel}>Toplam Puanın</Text>
          <Text style={styles.points}>{points} <Text style={styles.pointsSub}>puan</Text></Text>
        </View>
        <View style={[styles.badgeWrap, { backgroundColor: currentBadge.color }]}>
          <Text style={styles.badgeEmoji}>{currentBadge.emoji}</Text>
          <Text style={[styles.badgeTitle, { color: currentBadge.textColor }]}>{currentBadge.title}</Text>
        </View>
      </View>

      {/* Progress */}
      {nextBadge && (
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>
              {currentBadge.emoji} {currentBadge.title} → {nextBadge.emoji} {nextBadge.title}
            </Text>
            <Text style={styles.progressKg}>{savedKg}/{nextBadge.requiredKg} kg</Text>
          </View>
          <ProgressBar progress={progress} height={8} />
          <Text style={styles.progressHint}>
            {(nextBadge.requiredKg - savedKg).toFixed(1)} kg daha kurtar, bir üst rozete geç!
          </Text>
        </View>
      )}

      {!nextBadge && (
        <View style={styles.maxLevel}>
          <Text style={styles.maxLevelText}>🏆 Maksimum seviyeye ulaştın!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pointsLabel: { fontSize: 11, color: Colors.ink3, fontWeight: '700', marginBottom: 4 },
  points: { fontSize: 32, fontWeight: '900', color: Colors.primary },
  pointsSub: { fontSize: 14, color: Colors.ink3, fontWeight: '600' },
  badgeWrap: { alignItems: 'center', padding: 10, borderRadius: 16 },
  badgeEmoji: { fontSize: 28, marginBottom: 4 },
  badgeTitle: { fontSize: 11, fontWeight: '900' },
  progressSection: { gap: 6 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  progressLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3 },
  progressKg: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  progressHint: { fontSize: 10, color: Colors.ink4, marginTop: 4 },
  maxLevel: { backgroundColor: '#FFF8E8', padding: 10, borderRadius: 12, alignItems: 'center' },
  maxLevelText: { fontSize: 13, fontWeight: '800', color: '#C07000' },
});