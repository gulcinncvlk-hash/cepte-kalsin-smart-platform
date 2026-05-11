import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { authService } from '../services/authService';

export default function RegisterScreen({ navigation }: any) {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!ad || !soyad || !email || !password || !telefon) {
      Alert.alert('❌ Hata', 'Tüm alanları doldurun!');
      return;
    }
    if (password.trim() !== passwordConfirm.trim()) {
      Alert.alert('❌ Hata', 'Şifreler eşleşmiyor!');
      return;
    }
    if (password.length < 6) {
      Alert.alert('❌ Hata', 'Şifre en az 6 karakter olmalı!');
      return;
    }
    setLoading(true);
    try {
      await authService.register(ad, soyad, email, password, telefon);
      Alert.alert('✅ Kayıt Başarılı!', 'Hesabınız oluşturuldu. Giriş yapabilirsiniz.', [
        { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      Alert.alert('❌ Kayıt Başarısız', err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <View style={styles.chip}>
          <Text style={styles.chipText}>🎉  Yeni Hesap Oluştur</Text>
        </View>
        <Text style={styles.title}>Kayıt Ol</Text>
        <Text style={styles.sub}>Bilgilerinizi girerek hesap oluşturun</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>AD</Text>
            <View style={[styles.inputWrap, focusedField === 'ad' && styles.inputFocused]}>
              <TextInput style={styles.input} placeholder="Ayşe" value={ad} onChangeText={setAd} onFocus={() => setFocusedField('ad')} onBlur={() => setFocusedField(null)} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>SOYAD</Text>
            <View style={[styles.inputWrap, focusedField === 'soyad' && styles.inputFocused]}>
              <TextInput style={styles.input} placeholder="Kaya" value={soyad} onChangeText={setSoyad} onFocus={() => setFocusedField('soyad')} onBlur={() => setFocusedField(null)} />
            </View>
          </View>
        </View>

        <Text style={styles.label}>E-POSTA</Text>
        <View style={[styles.inputWrap, focusedField === 'email' && styles.inputFocused]}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput style={styles.input} placeholder="ornek@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
        </View>

        <Text style={styles.label}>TELEFON</Text>
        <View style={[styles.inputWrap, focusedField === 'telefon' && styles.inputFocused]}>
          <Text style={styles.inputIcon}>📱</Text>
          <TextInput style={styles.input} placeholder="0532 123 45 67" value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" onFocus={() => setFocusedField('telefon')} onBlur={() => setFocusedField(null)} />
        </View>

        <Text style={styles.label}>ŞİFRE</Text>
        <View style={[styles.inputWrap, focusedField === 'password' && styles.inputFocused]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput style={styles.input} placeholder="En az 6 karakter" value={password} onChangeText={setPassword} secureTextEntry onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
        </View>

        <Text style={styles.label}>ŞİFRE TEKRAR</Text>
        <View style={[styles.inputWrap, focusedField === 'passwordConfirm' && styles.inputFocused]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput style={styles.input} placeholder="Şifrenizi tekrar girin" value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry onFocus={() => setFocusedField('passwordConfirm')} onBlur={() => setFocusedField(null)} />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Kayıt Ol</Text>
          }
        </TouchableOpacity>

        <Text style={styles.footer}>
          Zaten hesabın var mı?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>Giriş Yap</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 20 },
  backText: { fontSize: 14, color: Colors.primary, fontWeight: '800' },
  chip: { backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, alignSelf: 'flex-start', marginBottom: 18, borderWidth: 1, borderColor: Colors.primaryMid },
  chipText: { fontSize: 11, fontWeight: '800', color: Colors.primaryDark },
  title: { fontSize: 28, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  sub: { fontSize: 13, color: Colors.ink3, marginBottom: 28 },
  row: { flexDirection: 'row', gap: 10 },
  label: { fontSize: 10, fontWeight: '800', color: Colors.ink3, letterSpacing: 1, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F9F8', borderWidth: 1.5, borderColor: Colors.ink5, borderRadius: 14, paddingHorizontal: 14, marginBottom: 14 },
  inputFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  inputIcon: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, fontSize: 13, color: Colors.ink2, paddingVertical: 13 },
  btn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 16, alignItems: 'center', marginBottom: 16, marginTop: 8 },
  btnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  footer: { textAlign: 'center', fontSize: 11, color: Colors.ink4, marginTop: 10, marginBottom: 40 },
  footerLink: { color: Colors.primary, fontWeight: '700' },
});