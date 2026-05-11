# Requirements — TazeKalsin Backend API

**Project:** TazeKalsin  
**Scope:** Sprint 2 — Tüketici Auth sonrası tüm backend modülleri  
**Date:** 2026-05-12

---

## v1 Requirements

### Authentication (DONE)
- [x] **AUTH-01**: Tüketici email + şifre ile kayıt olabilir (BCrypt hash)
- [x] **AUTH-02**: Tüketici email + şifre ile giriş yapabilir, JWT alır
- [x] **AUTH-03**: Tüketici /me endpoint'i ile profilini görüntüleyebilir

### Market & Kategori
- [ ] **MRKT-01**: Tüketici onaylı marketlerin listesini görüntüleyebilir (GET /api/markets)
- [ ] **MRKT-02**: Tüketici marketi detaylı görüntüleyebilir (konum, saat, ad)
- [ ] **MRKT-03**: Market başvurusu yapılabilir (POST /api/market-basvuru — ad, şehir, yetkili, email)
- [ ] **MRKT-04**: Market başvurusuna belge yüklenebilir (POST /api/market-basvuru/{id}/belge)
- [ ] **MRKT-05**: Kategori listesi görüntülenebilir (GET /api/kategoriler)

### Ürün Yönetimi
- [ ] **URUN-01**: Markete ait ürün listesi görüntülenebilir (GET /api/markets/{id}/urunler)
- [ ] **URUN-02**: Ürün detayı görüntülenebilir (ad, fiyat, SKT, stok, kategori)
- [ ] **URUN-03**: Market ürün ekleyebilir (POST /api/urunler — JWT gerekli)
- [ ] **URUN-04**: Market ürün güncelleyebilir (PUT /api/urunler/{id})
- [ ] **URUN-05**: SKT'ye yakın ürünler filtrelenebilir (GET /api/urunler?skt_yakin=true)

### Paket (Sürpriz Kutu)
- [ ] **PAKT-01**: Aktif paket listesi görüntülenebilir (GET /api/paketler)
- [ ] **PAKT-02**: Market paket oluşturabilir (POST /api/paketler — ad, fiyat, stok, son_satis_saati)
- [ ] **PAKT-03**: Pakete ürün eklenebilir (POST /api/paketler/{id}/urunler)
- [ ] **PAKT-04**: Paket detayı ürün listesiyle birlikte görüntülenebilir

### Rezervasyon
- [ ] **REZV-01**: Tüketici ürün rezerve edebilir — sp_Rezervasyon_Yapar SP çağrısı (race condition korumalı, ROWLOCK)
- [ ] **REZV-02**: Tüketici paket rezerve edebilir — aynı SP, Paket_ID ile
- [ ] **REZV-03**: Rezervasyon sırasında otomatik PIN kodu üretilir (backend)
- [ ] **REZV-04**: Tüketici aktif rezervasyonlarını listeleyebilir (GET /api/rezervasyonlar)
- [ ] **REZV-05**: Tüketici rezervasyonu iptal edebilir (PATCH /api/rezervasyonlar/{id}/iptal)

### QR/PIN Satış Onayı
- [ ] **QRPN-01**: Kasiyer PIN kodu ile satışı onaylayabilir — sp_QR_Satis_Onayla çağrısı (POST /api/satis/onayla)
- [ ] **QRPN-02**: Satış tamamlanabilir — sp_QR_Satis_Tamamla çağrısı (POST /api/satis/tamamla)
- [ ] **QRPN-03**: Satış tamamlandığında Kurtarilan_Gida_Kg +0.5 kg otomatik güncellenir (SP içinde)

### Favori
- [ ] **FAVR-01**: Tüketici ürünü favorilere ekleyebilir (POST /api/favoriler)
- [ ] **FAVR-02**: Tüketici favori listesini görüntüleyebilir (GET /api/favoriler)
- [ ] **FAVR-03**: Tüketici favoriden ürün çıkarabilir (DELETE /api/favoriler/{urun_id})

### Bildirim
- [ ] **BLDR-01**: Tüketici bildirimlerini listeleyebilir (GET /api/bildirimler)
- [ ] **BLDR-02**: Tüketici bildirimi okundu olarak işaretleyebilir (PATCH /api/bildirimler/{id}/oku)
- [ ] **BLDR-03**: Okunmamış bildirim sayısı döndürülebilir (GET /api/bildirimler/sayac)

---

## v2 Requirements (Deferred)

- Ödeme entegrasyonu (iyzico/Stripe)
- Market dashboard (panel)
- Push/SMS bildirim gönderme
- Tüketici profil güncelleme
- Admin paneli (market onaylama arayüzü)
- Ürün fotoğrafı yükleme

---

## Out of Scope

- ORM (Entity Framework, Dapper) — ADO.NET kalacak
- Refresh token mekanizması — JWT stateless, süre dolunca tekrar login
- Market mobil app — bu sprint API only
- Gerçek zamanlı bildirim (SignalR/WebSocket) — DB polling yeterli

---

## Traceability

| Faz | Requirements |
|-----|--------------|
| Phase 1 (Done) | AUTH-01, AUTH-02, AUTH-03 |
| Phase 2 | MRKT-01..05, URUN-01..05 |
| Phase 3 | PAKT-01..04 |
| Phase 4 | REZV-01..05 |
| Phase 5 | QRPN-01..03 |
| Phase 6 | FAVR-01..03, BLDR-01..03 |
