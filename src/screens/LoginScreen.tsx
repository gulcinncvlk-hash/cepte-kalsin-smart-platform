import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('ayse@gmail.com');
  const [password, setPassword] = useState('123456');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('❌ Hata', 'E-posta ve şifre boş olamaz!');
      return;
    }
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      await login(userData);
      navigation.navigate('Main');
    } catch (err: any) {
      Alert.alert('❌ Giriş Başarısız', err.message || 'E-posta veya şifre hatalı.');
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
          <Text style={styles.chipText}>👋  Tekrar Hoş Geldiniz</Text>
        </View>
        <Text style={styles.title}>Giriş Yap</Text>
        <Text style={styles.sub}>Hesabınıza güvenle erişin</Text>

        <Text style={styles.label}>E-POSTA</Text>
        <View style={[styles.inputWrap, focusedField === 'email' && styles.inputFocused]}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <Text style={styles.label}>ŞİFRE</Text>
        <View style={[styles.inputWrap, focusedField === 'password' && styles.inputFocused]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <Text style={styles.forgot}>Şifremi Unuttum →</Text>

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Giriş Yap</Text>
          }
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>🔍  Google ile Giriş</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Hesabın yok mu?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Register')}>
            Kayıt Ol
          </Text>
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
  label: { fontSize: 10, fontWeight: '800', color: Colors.ink3, letterSpacing: 1, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F9F8', borderWidth: 1.5, borderColor: Colors.ink5, borderRadius: 14, paddingHorizontal: 14, marginBottom: 14 },
  inputFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  inputIcon: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, fontSize: 13, color: Colors.ink2, paddingVertical: 13 },
  forgot: { fontSize: 11, color: Colors.primary, fontWeight: '800', textAlign: 'right', marginBottom: 22 },
  btn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.ink5 },
  dividerText: { fontSize: 11, color: Colors.ink4, fontWeight: '700', marginHorizontal: 10 },
  ghostBtn: { borderWidth: 1.5, borderColor: Colors.ink5, padding: 13, borderRadius: 16, alignItems: 'center' },
  ghostBtnText: { fontSize: 14, fontWeight: '800', color: Colors.ink2 },
  footer: { textAlign: 'center', fontSize: 11, color: Colors.ink4, marginTop: 20 },
  footerLink: { color: Colors.primary, fontWeight: '700' },
});