import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/colors';

export default function PersonalInfoScreen({ navigation }: any) {
  const [name, setName] = useState('Ayşe');
  const [surname, setSurname] = useState('Kaya');
  const [email, setEmail] = useState('ayse@gmail.com');
  const [phone, setPhone] = useState('0532 123 45 67');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    Alert.alert('✅ Kaydedildi', 'Bilgileriniz güncellendi!');
    setEditing(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Kişisel Bilgiler</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={styles.editBtn}>{editing ? 'İptal' : 'Düzenle'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👩</Text>
            </View>
            {editing && (
              <TouchableOpacity style={styles.changePhotoBtn}>
                <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTtl}>Hesap Bilgileri</Text>
          <View style={styles.card}>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>AD</Text>
              <TextInput
                style={[styles.fieldInput, !editing && styles.fieldInputDisabled]}
                value={name}
                onChangeText={setName}
                editable={editing}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>SOYAD</Text>
              <TextInput
                style={[styles.fieldInput, !editing && styles.fieldInputDisabled]}
                value={surname}
                onChangeText={setSurname}
                editable={editing}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>E-POSTA</Text>
              <TextInput
                style={[styles.fieldInput, !editing && styles.fieldInputDisabled]}
                value={email}
                onChangeText={setEmail}
                editable={editing}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>TELEFON</Text>
              <TextInput
                style={[styles.fieldInput, !editing && styles.fieldInputDisabled]}
                value={phone}
                onChangeText={setPhone}
                editable={editing}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {editing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>✓  Değişiklikleri Kaydet</Text>
            </TouchableOpacity>
          )}

          <View style={styles.dangerCard}>
            <Text style={styles.dangerTitle}>Tehlikeli Bölge</Text>
            <TouchableOpacity style={styles.dangerBtn} onPress={() => Alert.alert('Hesabı Sil', 'Bu işlem geri alınamaz!', [{ text: 'İptal', style: 'cancel' }, { text: 'Sil', style: 'destructive' }])}>
              <Text style={styles.dangerBtnText}>🗑️  Hesabı Sil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 54, paddingBottom: 18, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: '#fff' },
  title: { fontSize: 20, fontWeight: '900', color: '#fff' },
  editBtn: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.8)' },
  body: { flex: 1, padding: 16 },
  avatarWrap: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  avatar: { width: 88, height: 88, backgroundColor: Colors.primaryLight, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 3, borderColor: Colors.primaryMid },
  avatarEmoji: { fontSize: 44 },
  changePhotoBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 100 },
  changePhotoText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  sectionTtl: { fontSize: 10, fontWeight: '800', color: Colors.ink4, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  card: { backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: 16 },
  fieldWrap: { padding: 14 },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: Colors.ink4, letterSpacing: 1, marginBottom: 5 },
  fieldInput: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  fieldInputDisabled: { color: Colors.ink2 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.04)' },
  saveBtn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  saveBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  dangerCard: { backgroundColor: '#FFF0F0', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FFD5D0', marginBottom: 30 },
  dangerTitle: { fontSize: 12, fontWeight: '800', color: Colors.red, marginBottom: 10 },
  dangerBtn: { backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FFD5D0' },
  dangerBtnText: { fontSize: 13, fontWeight: '800', color: Colors.red },
});