import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { Colors } from '../constants/colors';
import { mockProducts } from '../constants/mockData';

const mockAskida = [
  { id: '1', product: mockProducts[0], donor: 'Ayşe K.', date: '2 sa önce', store: 'A101 Saadetdere', storeAddress: 'Saadetdere Mah. 123. Sok. No:5', deadline: 'Bugün 22:00' },
  { id: '2', product: mockProducts[1], donor: 'Mehmet Y.', date: '5 sa önce', store: 'BİM Bahçeyolu', storeAddress: 'Bahçeyolu Mah. 45. Sok. No:12', deadline: 'Bugün 22:00' },
  { id: '3', product: mockProducts[3], donor: 'Fatma S.', date: 'Dün', store: 'ŞOK Üç Evler', storeAddress: 'Üç Evler Mah. 78. Sok. No:3', deadline: 'Bugün 22:00' },
];

export default function AskidaUrunScreen() {
  const [activeTab, setActiveTab] = useState<'al' | 'birak'>('birak');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [takenItems, setTakenItems] = useState<string[]>([]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const selectedProductData = mockProducts.find(p => p.id === selectedProduct);
  const availableItems = mockAskida.filter(item => !takenItems.includes(item.id));

  const handleTake = (item: any) => {
    Alert.alert(
      '🎁 Ürünü Al',
      `${item.product.name} ürününü almak istiyorsunuz.\n\n📍 Mağaza: ${item.store}\n📌 Adres: ${item.storeAddress}\n⏰ Son alım: ${item.deadline}\n\nMağazaya gidip bu ürünü ücretsiz alabilirsiniz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: '🗺️ Yol Tarifi Al',
          onPress: () => {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.store)}`;
            Linking.openURL(url);
          }
        },
        {
          text: '✅ Alacağım',
          onPress: () => {
            setTakenItems(prev => [...prev, item.id]);
            Alert.alert('✅ Kaydedildi!', `${item.store} adresine gidip ${item.product.name} ürününü alabilirsiniz.\n\nSon alım saati: ${item.deadline}`);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>🤝</Text>
        </View>
        <Text style={styles.title}>Askıda Ürün</Text>
        <Text style={styles.sub}>İndirimli ürün satın al, ihtiyaç sahibi biri için bırak</Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Bu nasıl çalışır?</Text>
        <View style={styles.infoRow}><Text style={styles.infoStep}>1️⃣</Text><Text style={styles.infoText}>İndirimli bir ürün seç ve ödeme yap</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoStep}>2️⃣</Text><Text style={styles.infoText}>Ürün havuza eklenir, ihtiyaç sahipleri görür</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoStep}>3️⃣</Text><Text style={styles.infoText}>İhtiyaç sahibi mağazadan gün içinde ücretsiz alır</Text></View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statEmoji}>🤝</Text><Text style={styles.statNum}>124</Text><Text style={styles.statLbl}>Bırakılan{'\n'}Ürün</Text></View>
        <View style={styles.statCard}><Text style={styles.statEmoji}>💚</Text><Text style={styles.statNum}>89</Text><Text style={styles.statLbl}>Ulaşan{'\n'}Kişi</Text></View>
        <View style={styles.statCard}><Text style={styles.statEmoji}>📦</Text><Text style={styles.statNum}>{availableItems.length}</Text><Text style={styles.statLbl}>Şu An{'\n'}Havuzda</Text></View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'birak' && styles.tabActive]} onPress={() => { setActiveTab('birak'); setStep('select'); }}>
          <Text style={[styles.tabText, activeTab === 'birak' && styles.tabTextActive]}>💚 Ürün Bırak</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'al' && styles.tabActive]} onPress={() => setActiveTab('al')}>
          <Text style={[styles.tabText, activeTab === 'al' && styles.tabTextActive]}>🎁 Ürün Al</Text>
        </TouchableOpacity>
      </View>

      {/* BIRAK TAB */}
      {activeTab === 'birak' && (
        <View style={styles.section}>
          {step === 'success' ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successTitle}>Teşekkürler!</Text>
              <Text style={styles.successSub}>Ürünün havuza eklendi. Biri için büyük fark yarattın 💚</Text>
              <View style={styles.successPoints}><Text style={styles.successPointsText}>+20 puan kazandın! 🪙</Text></View>
              <TouchableOpacity style={styles.successBtn} onPress={() => {
                setStep('select');
                setSelectedProduct(null);
                setNote('');
                setCardNumber('');
                setCardName('');
                setCardExpiry('');
                setCardCvv('');
              }}>
                <Text style={styles.successBtnText}>Tekrar Bırak</Text>
              </TouchableOpacity>
            </View>
          ) : step === 'payment' ? (
            <View style={styles.paymentCard}>
              <Text style={styles.paymentTitle}>💳 Ödeme</Text>
              <View style={styles.paymentProduct}>
                <View style={styles.paymentImg}><Text style={{ fontSize: 26 }}>{selectedProductData?.emoji}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentName}>{selectedProductData?.name}</Text>
                  <Text style={styles.paymentStore}>{selectedProductData?.store}</Text>
                </View>
                <Text style={styles.paymentPrice}>₺{selectedProductData?.discountedPrice}</Text>
              </View>
              <View style={styles.paymentDivider} />

              <Text style={styles.cardSectionTitle}>Kart Bilgileri</Text>

              <View style={styles.cardInput}>
                <Text style={styles.cardInputLabel}>KART NUMARASI</Text>
                <TextInput
                  style={styles.cardInputField}
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChangeText={t => setCardNumber(t.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.cardInput}>
                <Text style={styles.cardInputLabel}>KART ÜZERİNDEKİ İSİM</Text>
                <TextInput
                  style={styles.cardInputField}
                  placeholder="AD SOYAD"
                  value={cardName}
                  onChangeText={setCardName}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.cardRow}>
                <View style={[styles.cardInput, { flex: 1 }]}>
                  <Text style={styles.cardInputLabel}>SON KULLANIM</Text>
                  <TextInput
                    style={styles.cardInputField}
                    placeholder="AA/YY"
                    value={cardExpiry}
                    onChangeText={t => {
                      const cleaned = t.replace(/\D/g,'');
                      if (cleaned.length <= 2) setCardExpiry(cleaned);
                      else setCardExpiry(cleaned.slice(0,2) + '/' + cleaned.slice(2,4));
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.cardInput, { flex: 1 }]}>
                  <Text style={styles.cardInputLabel}>CVV</Text>
                  <TextInput
                    style={styles.cardInputField}
                    placeholder="000"
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.paymentDivider} />
              <View style={styles.paymentRow}>
                <Text style={[styles.paymentLbl, { fontWeight: '900', color: Colors.ink }]}>Toplam</Text>
                <Text style={[styles.paymentVal, { fontWeight: '900', fontSize: 18, color: Colors.primary }]}>₺{selectedProductData?.discountedPrice}</Text>
              </View>

              <TouchableOpacity style={styles.paymentBtn} onPress={() => {
                if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                  Alert.alert('❌ Eksik Bilgi', 'Lütfen tüm kart bilgilerini doldurun.');
                  return;
                }
                if (cardNumber.replace(/\s/g,'').length < 16) {
                  Alert.alert('❌ Hatalı Kart', 'Geçerli bir kart numarası girin.');
                  return;
                }
                setStep('success');
              }}>
                <Text style={styles.paymentBtnText}>💳  Ödemeyi Tamamla</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backPayBtn} onPress={() => setStep('select')}>
                <Text style={styles.backPayBtnText}>← Geri Dön</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTtl}>Hangi ürünü bırakmak istersin?</Text>
              {mockProducts.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.productCard, selectedProduct === product.id && styles.productCardSelected]}
                  onPress={() => setSelectedProduct(product.id)}
                >
                  <View style={styles.productImg}><Text style={styles.productEmoji}>{product.emoji}</Text></View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productStore}>{product.store}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceNew}>₺{product.discountedPrice}</Text>
                      <Text style={styles.priceOld}>₺{product.originalPrice}</Text>
                      <View style={styles.discountBadge}><Text style={styles.discountText}>%{product.discountPercent}</Text></View>
                    </View>
                  </View>
                  <View style={[styles.radioBtn, selectedProduct === product.id && styles.radioBtnActive]}>
                    {selectedProduct === product.id && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}

              {selectedProduct && (
                <>
                  <Text style={styles.sectionTtl}>Not bırak (İsteğe bağlı)</Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="Örn: Geçmiş olsun, iyi günler dilerim 💚"
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                  />
                  <TouchableOpacity style={styles.donateBtn} onPress={() => setStep('payment')}>
                    <Text style={styles.donateBtnText}>Devam Et →</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      )}

      {/* AL TAB */}
      {activeTab === 'al' && (
        <View style={styles.section}>
          <View style={styles.privacyCard}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyTitle}>Gizlilik Koruması</Text>
              <Text style={styles.privacyText}>Kim aldığın kayıt altına alınmaz. Kimseye bildirilmez.</Text>
            </View>
          </View>

          <View style={styles.deadlineCard}>
            <Text style={styles.deadlineIcon}>⏰</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.deadlineTitle}>Gün İçinde Al</Text>
              <Text style={styles.deadlineText}>Ürünleri bugün mağaza kapanmadan almanız gerekiyor.</Text>
            </View>
          </View>

          <Text style={styles.sectionTtl}>Havuzdaki Ürünler ({availableItems.length})</Text>

          {availableItems.map(item => (
            <View key={item.id} style={styles.askidaCard}>
              <View style={styles.productImg}><Text style={styles.productEmoji}>{item.product.emoji}</Text></View>
              <View style={styles.askidaInfo}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productStore}>📍 {item.store}</Text>
                <Text style={styles.askidaDeadline}>⏰ Son alım: {item.deadline}</Text>
                <Text style={styles.askidaDonor}>💚 {item.donor} tarafından bırakıldı · {item.date}</Text>
              </View>
              <TouchableOpacity style={styles.getBtn} onPress={() => handleTake(item)}>
                <Text style={styles.getBtnText}>Al</Text>
              </TouchableOpacity>
            </View>
          ))}

          {availableItems.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>Şu an havuzda ürün yok</Text>
              <Text style={styles.emptySub}>Yakında eklenecek</Text>
            </View>
          )}
        </View>
      )}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, padding: 24, paddingTop: 54, alignItems: 'center' },
  headerIcon: { width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  headerEmoji: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 6 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 18 },
  infoCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)' },
  infoTitle: { fontSize: 13, fontWeight: '900', color: Colors.ink, marginBottom: 12 },
  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'flex-start' },
  infoStep: { fontSize: 16 },
  infoText: { fontSize: 12, color: Colors.ink3, flex: 1, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 14, alignItems: 'center' },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statNum: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  statLbl: { fontSize: 9, fontWeight: '700', color: Colors.ink4, textTransform: 'uppercase', textAlign: 'center', marginTop: 2 },
  tabs: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 3, marginHorizontal: 16, marginBottom: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  tabText: { fontSize: 13, fontWeight: '800', color: Colors.ink3 },
  tabTextActive: { color: Colors.primary },
  section: { paddingHorizontal: 16, paddingBottom: 40, gap: 10 },
  sectionTtl: { fontSize: 11, fontWeight: '800', color: Colors.ink4, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 },
  productCard: { backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  productCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  productImg: { width: 52, height: 52, backgroundColor: Colors.primaryLight, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  productEmoji: { fontSize: 26 },
  productInfo: { flex: 1 },
  productName: { fontSize: 13, fontWeight: '900', color: Colors.ink, marginBottom: 2 },
  productStore: { fontSize: 11, color: Colors.ink3, marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceNew: { fontSize: 14, fontWeight: '900', color: Colors.primary },
  priceOld: { fontSize: 11, color: Colors.ink4, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7 },
  discountText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },
  radioBtn: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.ink5, alignItems: 'center', justifyContent: 'center' },
  radioBtnActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  noteInput: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.ink5, borderRadius: 14, padding: 14, fontSize: 13, color: Colors.ink2, textAlignVertical: 'top', minHeight: 80 },
  donateBtn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 16, alignItems: 'center' },
  donateBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  paymentCard: { backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 20, gap: 12 },
  paymentTitle: { fontSize: 18, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  paymentProduct: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentImg: { width: 52, height: 52, backgroundColor: Colors.primaryLight, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  paymentName: { fontSize: 14, fontWeight: '900', color: Colors.ink },
  paymentStore: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  paymentPrice: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  paymentDivider: { height: 1, backgroundColor: Colors.ink5 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentLbl: { fontSize: 13, color: Colors.ink3, fontWeight: '600' },
  paymentVal: { fontSize: 13, fontWeight: '800', color: Colors.ink },
  cardSectionTitle: { fontSize: 13, fontWeight: '900', color: Colors.ink, marginBottom: 4 },
  cardInput: { backgroundColor: '#F7F9F8', borderWidth: 1.5, borderColor: Colors.ink5, borderRadius: 12, padding: 12 },
  cardInputLabel: { fontSize: 9, fontWeight: '800', color: Colors.ink4, letterSpacing: 1, marginBottom: 5 },
  cardInputField: { fontSize: 15, color: Colors.ink },
  cardRow: { flexDirection: 'row', gap: 10 },
  paymentBtn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 14, alignItems: 'center' },
  paymentBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  backPayBtn: { alignItems: 'center', padding: 10 },
  backPayBtnText: { fontSize: 13, color: Colors.ink3, fontWeight: '700' },
  successCard: { backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.primaryMid, padding: 28, alignItems: 'center', gap: 8 },
  successEmoji: { fontSize: 52, marginBottom: 4 },
  successTitle: { fontSize: 24, fontWeight: '900', color: Colors.ink },
  successSub: { fontSize: 13, color: Colors.ink3, textAlign: 'center', lineHeight: 20 },
  successPoints: { backgroundColor: Colors.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginTop: 4 },
  successPointsText: { fontSize: 13, fontWeight: '900', color: Colors.primaryDark },
  successBtn: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 13, borderRadius: 14, marginTop: 8 },
  successBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  privacyCard: { backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
  privacyIcon: { fontSize: 22 },
  privacyTitle: { fontSize: 13, fontWeight: '900', color: '#1D4ED8', marginBottom: 2 },
  privacyText: { fontSize: 11, color: '#3B82F6', lineHeight: 16 },
  deadlineCard: { backgroundColor: '#FFF8E8', borderRadius: 14, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FDE68A' },
  deadlineIcon: { fontSize: 22 },
  deadlineTitle: { fontSize: 13, fontWeight: '900', color: '#92400E', marginBottom: 2 },
  deadlineText: { fontSize: 11, color: '#B45309', lineHeight: 16 },
  askidaCard: { backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  askidaInfo: { flex: 1 },
  askidaDeadline: { fontSize: 10, color: Colors.orange, fontWeight: '800', marginTop: 2 },
  askidaDonor: { fontSize: 10, color: Colors.primary, fontWeight: '700', marginTop: 2 },
  getBtn: { backgroundColor: Colors.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  getBtnText: { fontSize: 13, fontWeight: '900', color: Colors.primaryDark },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, fontWeight: '900', color: Colors.ink },
  emptySub: { fontSize: 12, color: Colors.ink3, marginTop: 4 },
});