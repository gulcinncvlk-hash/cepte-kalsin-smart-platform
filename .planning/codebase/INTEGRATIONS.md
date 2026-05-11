# External Integrations

**Analysis Date:** 2026-05-12

## APIs & External Services

None detected. The API has no outbound HTTP calls to third-party services. All business logic is handled internally against the SQL Server database.

## Data Storage

**Databases:**
- SQL Server (Express in development: .\SQLEXPRESS)
  - Database name: TazeKalsinDB
  - Connection config key: ConnectionStrings:TazeKalsinDB in TazeKalsin.API/appsettings.json
  - Client: Microsoft.Data.SqlClient 7.0.1 — raw ADO.NET (no ORM, no Entity Framework)
  - All queries written as inline SQL strings in TazeKalsin.API/Services/AuthService.cs
  - Critical database objects defined in tazekalsin.sql:

**Tables:**
- dbo.Tuketici — Consumer accounts (ID, Ad_Soyad, Email, Sifre_Hash, Kurtarilan_Gida_Kg)
- dbo.Market — Store/market entries (ID, name, address, geolocation, hours, approval status)
- dbo.Market_Basvuru — Market onboarding applications
- dbo.Basvuru_Belge — Documents attached to market applications
- dbo.Urun — Individual food products (price, discounted price, expiry date, stock, barcode, category)
- dbo.Paket — Surprise food packages (grouped products, normal/discounted price, stock)
- dbo.Paket_Urun_Detay — Junction table: which products are in which package
- dbo.Rezervasyon — Reservations (consumer buys a product or package, generates PIN code)
- dbo.Favori — Consumer favourites (Tuketici x Urun junction)
- dbo.Bildiri — Notifications sent to consumers
- dbo.Kategori — Product categories

**Stored Procedures:**
- dbo.sp_Rezervasyon_Yapar — Creates a reservation with row-level locking (UPDLOCK, ROWLOCK) and stock validation
- dbo.sp_QR_Satis_Tamamla — Cashier confirms QR/PIN sale; updates reservation status to Tamamlandi and increments consumer eco-score
- dbo.sp_QR_Satis_Onayla — Alternative QR approval flow (simpler, without row lock on read)

**Triggers:**
- dbo.trg_Rezervasyon_StokDus — AFTER INSERT on Rezervasyon; automatically decrements Urun.Stok_Miktari by the reserved quantity

**File Storage:**
- Local filesystem only — Basvuru_Belge.Dosya_Yolu stores a varchar(255) path string; no cloud storage integration present

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Custom — self-managed JWT implementation, no external identity provider (no Azure AD, Auth0, Keycloak, etc.)
  - Implementation: TazeKalsin.API/Services/AuthService.cs (TokenUret method)
  - Algorithm: HMAC-SHA256 symmetric signing
  - Secret key source: JWT:Secret configuration value (TazeKalsin.API/appsettings.json)
  - Token claims: sub (Tuketici_ID), email, name (Ad_Soyad)
  - Token lifetime: configurable via JWT:ExpiryDays (default 7 days)
  - Validation configured in TazeKalsin.API/Program.cs: issuer, audience, signing key, and lifetime all validated
  - Passwords hashed with BCrypt (BCrypt.Net-Next 4.1.0); bcrypt cost factor uses library default

## Monitoring & Observability

**Error Tracking:**
- None detected — no Sentry, Application Insights, or similar SDK present

**Logs:**
- ASP.NET Core built-in logging via ILogger (Microsoft.Extensions.Logging)
- Log levels configured in appsettings.json: Default=Information, Microsoft.AspNetCore=Warning
- Database stored procedures use T-SQL PRINT statements for internal diagnostic messages (not surfaced to API callers)

## CI/CD & Deployment

**Hosting:**
- Not configured — no Dockerfile, docker-compose, Azure/AWS/GCP deployment manifests, or GitHub Actions workflows detected

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars / config keys:**
- ConnectionStrings:TazeKalsinDB — SQL Server connection string
- JWT:Secret — Must be at least 32 characters; placeholder value in appsettings.json must be replaced before deployment
- JWT:Issuer — Token issuer (default: TazeKalsinAPI)
- JWT:Audience — Token audience (default: TazeKalsinApp)
- JWT:ExpiryDays — Token expiry in days (default: 7)

**Secrets location:**
- Currently stored in TazeKalsin.API/appsettings.json (plain text, committed to repo with placeholder value)
- No secrets manager (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault) in use
- The JWT:Secret placeholder BURAYA_KENDI_GIZLI_ANAHTARINIZI_YAZIN_MIN32KARAKTER must be replaced with a real secret before any deployment

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## API Surface (from OpenAPI spec tazekalsin-api.json)

Current published endpoints (OpenAPI 3.0.1):
- POST /api/auth/register — Consumer registration; accepts RegisterRequest (Ad_Soyad, Email, Sifre)
- POST /api/auth/login — Consumer login; accepts LoginRequest (Email, Sifre)
- GET  /api/auth/me — Get current authenticated consumer profile; requires Bearer JWT token

All endpoints defined in TazeKalsin.API/Controllers/AuthController.cs.

---

*Integration audit: 2026-05-12*
