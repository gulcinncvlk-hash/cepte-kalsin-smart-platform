# TazeKalsin

## What This Is

Gıda israfını önleyen bir platform (Too Good To Go modeli). Marketler son kullanma tarihi yaklaşan ürünleri ve sürpriz paketleri indirimli olarak listeler; tüketiciler rezerve edip QR/PIN kodu ile teslim alır. ASP.NET Core Web API + SQL Server Express backend, tüketici mobil/web istemcisine hizmet verir.

## Core Value

Tüketici bir ürünü rezerve edip marketten QR/PIN ile teslim alabilmeli — stok tutarlılığı bozulmadan, race condition olmadan.

## Requirements

### Validated

- ✓ Tüketici kayıt (email + şifre, BCrypt hash) — Phase 1
- ✓ Tüketici girişi (JWT token) — Phase 1
- ✓ Tüketici profil görüntüleme (/me) — Phase 1

### Active

- [ ] Market ve kategori listesi API'si (tüketiciye)
- [ ] Market başvuru ve admin onay akışı
- [ ] Ürün yönetimi (CRUD, SKT/stok/barkod)
- [ ] Paket (sürpriz kutu) yönetimi ve içerik tanımlama
- [ ] Rezervasyon oluşturma (sp_Rezervasyon_Yapar ile race-condition korumalı)
- [ ] Rezervasyon listeleme ve iptal
- [ ] QR/PIN satış onaylama (sp_QR_Satis_Onayla, sp_QR_Satis_Tamamla)
- [ ] Kurtarılan gıda kg otomatik güncelleme (trigger + SP)
- [ ] Favori ekleme/çıkarma/listeleme
- [ ] Bildirim listeleme ve okundu işaretleme

### Out of Scope

- Ödeme entegrasyonu (iyzico vb.) — v2, MVP'de rezervasyon ücretsiz
- Market mobil uygulaması — web panel bu sprint dışı
- Push notification servisi — Bildirim tablosu var ama SMS/push entegrasyonu yok
- Tüketici profil güncelleme — Auth tablosunda alan yok, şimdilik dışarıda

## Context

- **Stack:** ASP.NET Core 8, ADO.NET (ORM yok), SQL Server Express 2022, BCrypt.Net-Next, JWT Bearer
- **DB:** TazeKalsinDB — 11 tablo, 3 stored procedure (sp_Rezervasyon_Yapar ROWLOCK, sp_QR_Satis_Onayla, sp_QR_Satis_Tamamla), 1 trigger (trg_Rezervasyon_StokDus)
- **Pattern:** Controller → IService (interface) → Service → ADO.NET
- **Test:** xUnit + Moq, şimdilik sadece AuthController test edilmiş
- **Sprint durumu:** Sprint 2 — Auth bitti, kalan modüller yazılacak
- **Backend geliştirici:** Merve Temizler

## Constraints

- **Tech stack:** ADO.NET kalacak, ORM eklenmeyecek
- **DB şeması:** Değişmeyecek, SP'ler ve trigger mevcut — kod buna uyacak
- **Race condition:** Rezervasyon mutlaka sp_Rezervasyon_Yapar SP'si üzerinden yapılacak

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| ADO.NET, ORM yok | Ekip kararı, şema sabit | — Pending |
| Stored procedure ile rezervasyon | ROWLOCK ile eş zamanlı rezervasyon koruması | ✓ Good |
| JWT stateless auth | Refresh token yok, basit tutuldu | — Pending |
| Interface-driven service | Moq ile unit test kolaylığı | ✓ Good |

## Evolution

Bu doküman her faz geçişinde güncellenir.

---
*Last updated: 2026-05-12 after initialization*
