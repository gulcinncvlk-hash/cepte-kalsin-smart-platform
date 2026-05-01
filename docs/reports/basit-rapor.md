# TazeKalsin - Basit Rapor

Bu rapor, yazılımcı olmayan ekip üyelerine projedeki ilerlemeden basit ve anlaşılır bir şekilde haberdar etmek için yazılmıştır.

## Son Task Özeti

### Task 6 — Kayıt Endpoint'i ve Testler Eklendi ✅
"Kayıt ol" özelliği yazıldı. Önce testler yazıldı (TDD yöntemi) — yani önce "ne bekliyoruz" tanımlandı, sonra kod yazıldı. 3 test: kısa şifre reddi, mevcut email reddi, başarılı kayıt. Hepsi geçti.

### Task 5 — Uygulama Ayarları Tamamlandı ✅
Uygulamanın nasıl başlayacağı ve hangi güvenlik kurallarını uygulayacağı yapılandırıldı. JWT token doğrulama sistemi aktif edildi. Swagger test arayüzü de token ile çalışacak şekilde ayarlandı.

### Task 4 — Servis Katmanı Şablonu Oluşturuldu ✅

Uygulamanın "iş yapan" kısmının şablonu hazırlandı. Kayıt ol, giriş yap, kullanıcı bul gibi işlemlerin listesi çıkarıldı. İçleri henüz boş — bir sonraki aşamalarda gerçek veritabanı kodları yazılacak.

**Neler yapıldı:**
- AuthService.cs dosyası oluşturuldu (kimlik doğrulama işlemleri için)
- IAuthService.cs arayüzü tanımlandı (4 fonksiyon)
- Services klasörü oluşturuldu ve düzenlendi
- Build doğrulandı (hatasız derleme)

### Task 3 — Veri Yapıları Tanımlandı ✅

Uygulamanın kullanacağı veri kalıpları oluşturuldu. Kayıt formundan ne alınacağı (ad, email, şifre), giriş formundan ne alınacağı (email, şifre) ve kullanıcıya ne gösterileceği (token, kullanıcı bilgisi) tanımlandı.

**Neler yapıldı:**
- RegisterRequest modeli: Kayıt işlemi için ad-soyad, email, şifre alanları
- LoginRequest modeli: Giriş işlemi için email ve şifre alanları
- AuthResponse modeli: Giriş/kayıttan sonra geri dönülecek token ve kullanıcı bilgileri
- TuketiciDto modeli: Tüketici bilgilerini tutacak yapı
- Build doğrulandı (hatasız derleme)

### Task 2 — Bağlantı Ayarları Yapıldı ✅

Uygulamanın veritabanına nasıl bağlanacağı ve güvenlik anahtarları bir yapılandırma dosyasına kaydedildi. Bu sayede uygulama SQL Server'a bağlanabilecek ve JWT token üretebilecek.

**Neler yapıldı:**
- Veritabanı bağlantısı ayarlandı (SQL Server SQLEXPRESS)
- JWT güvenlik anahtarı ve ayarları yapılandırıldı
- Logg ayarları ve API erişim kuralları belirlendi
- Tüm ayarlar `appsettings.json` dosyasına kaydedildi

### Task 1 — Proje Klasörü Kuruldu ✅

Bilgisayarda "TazeKalsin.API" adında bir yazılım projesi açıldı. İçine şifreleme ve veritabanı bağlantısı için gerekli araçlar yüklendi. Proje derlenerek çalıştığı doğrulandı.

**Neler yapıldı:**
- Yazılım projesinin yapısı oluşturuldu
- 5 tane yazılım kütüphanesi (paket) indirilip kuruldu:
  - JWT tokens için kimlik doğrulama sistemi
  - Şifreler için güvenli depolama sistemi
  - Veritabanı bağlantısı için SQL araçları
  - API belgesi oluşturma sistemi
- Proje derlenmiş (build), çalışması doğrulandı

## Kaldığımız Yer

- **Son adım:** Task 6 tamamlandı
- **Bir sonraki adım:** Task 7 (giriş endpoint'i)

## Zaman Çizelgesi

- **Başlangıç:** 2026-05-01
- **Task 1 Tamamlanma:** 2026-05-01
- **Task 2 Tamamlanma:** 2026-05-01
- **Task 3 Tamamlanma:** 2026-05-01
- **Task 4 Tamamlanma:** 2026-05-01
- **Task 5 Tamamlanma:** 2026-05-01
- **Task 6 Tamamlanma:** 2026-05-01

---

*Teknik ayrıntılar için `teknik-rapor.md` dosyasını okuyun.*
