# TazeKalsin — Roadmap

## Phase 1: Tüketici Auth ✓ DONE
**Goal:** Tüketici kayıt, giriş ve profil endpoint'leri
**Status:** Completed
**Requirements:** AUTH-01, AUTH-02, AUTH-03

## Phase 2: Market & Kategori API
**Goal:** Market listesi, market detayı, başvuru akışı ve kategori endpoint'leri
**Requirements:** MRKT-01, MRKT-02, MRKT-03, MRKT-04, MRKT-05
**Success Criteria:**
1. GET /api/markets onaylı marketleri döndürür
2. POST /api/market-basvuru yeni başvuru oluşturur
3. GET /api/kategoriler tüm kategorileri döndürür

## Phase 3: Ürün Yönetimi
**Goal:** Ürün CRUD, SKT filtresi
**Requirements:** URUN-01, URUN-02, URUN-03, URUN-04, URUN-05
**Success Criteria:**
1. GET /api/markets/{id}/urunler markete ait ürünleri döndürür
2. POST /api/urunler yeni ürün ekler (JWT gerekli)
3. SKT filtresi çalışır

## Phase 4: Paket (Sürpriz Kutu)
**Goal:** Paket CRUD, paket-ürün ilişkisi
**Requirements:** PAKT-01, PAKT-02, PAKT-03, PAKT-04
**Success Criteria:**
1. GET /api/paketler aktif paketleri döndürür
2. POST /api/paketler paket oluşturur
3. Paket detayı ürün listesiyle birlikte gelir

## Phase 5: Rezervasyon
**Goal:** sp_Rezervasyon_Yapar ile race-condition korumalı rezervasyon
**Requirements:** REZV-01, REZV-02, REZV-03, REZV-04, REZV-05
**Success Criteria:**
1. POST /api/rezervasyonlar SP üzerinden rezervasyon yapar, PIN döndürür
2. Eş zamanlı rezervasyon isteğinde stok koruması çalışır
3. GET /api/rezervasyonlar tüketici rezervasyonlarını listeler
4. İptal endpoint'i Durum'u 'Iptal' yapar

## Phase 6: QR/PIN Satış Onayı
**Goal:** Kasa işlemi — sp_QR_Satis_Onayla ve sp_QR_Satis_Tamamla
**Requirements:** QRPN-01, QRPN-02, QRPN-03
**Success Criteria:**
1. POST /api/satis/onayla geçerli PIN ile satışı onaylar
2. Kurtarilan_Gida_Kg +0.5 güncellenir
3. Geçersiz/süresi dolmuş PIN 400 döndürür

## Phase 7: Favori & Bildirim
**Goal:** Tüketici favori ve bildirim özellikleri
**Requirements:** FAVR-01, FAVR-02, FAVR-03, BLDR-01, BLDR-02, BLDR-03
**Success Criteria:**
1. Favori ekleme/çıkarma/listeleme çalışır
2. Bildirim listesi ve okundu işaretleme çalışır
3. Okunmamış bildirim sayacı doğru döner
