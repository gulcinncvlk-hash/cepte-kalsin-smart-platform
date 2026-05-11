# Codebase Concerns

**Analysis Date:** 2026-05-12

---

## Security Considerations

### Hardcoded JWT Secret in appsettings.json

- **Risk:** The JWT signing key is committed to source control as a placeholder string. `appsettings.json` line 6 contains the value BURAYA_KENDI_GIZLI_ANAHTARINIZI_YAZIN_MIN32KARAKTER. If a developer deploys without replacing it, all tokens can be forged.
- **Files:** `TazeKalsin.API\appsettings.json`
- **Current mitigation:** None -- value is committed in plaintext.
- **Recommendation:** Remove from appsettings.json. Use environment variable `JWT__Secret` or dotnet user-secrets locally, and a secrets manager (Azure Key Vault) for production. Key must be at least 32 bytes of random data.

### Connection String Committed to Repo

- **Risk:** `appsettings.json` contains the SQL Server connection string. Switching to SQL auth (common in CI/CD) would immediately leak credentials if the file is in source control.
- **Files:** `TazeKalsin.API\appsettings.json`
- **Current mitigation:** Uses Windows Integrated Security locally.
- **Recommendation:** Move to dotnet user-secrets or environment variable `ConnectionStrings__TazeKalsinDB` for all non-local environments.

### Swagger Exposed in All Environments (No Environment Guard)

- **Risk:** `Program.cs` calls `app.UseSwagger()` and `app.UseSwaggerUI()` unconditionally (lines 54-55). In production this exposes the full API schema and JWT Bearer input box publicly.
- **Files:** `TazeKalsin.API\Program.cs`
- **Current mitigation:** None.
- **Recommendation:** Wrap in `if (app.Environment.IsDevelopment())` so Swagger is only active locally.

### AllowedHosts Wildcard

- **Risk:** `appsettings.json` sets AllowedHosts to "*", disabling Host header validation and enabling Host header injection attacks.
- **Files:** `TazeKalsin.API\appsettings.json`
- **Current mitigation:** None.
- **Recommendation:** Set to the known production hostname once a deployment domain is decided.

### PIN Code Stored as Plain VARCHAR -- No Rate Limiting on QR Approval

- **Risk:** `Rezervasyon.PIN_Kodu` is stored as `VARCHAR(10)` in plaintext. A 10-character PIN with no rate limiting on `sp_QR_Satis_Onayla` / `sp_QR_Satis_Tamamla` can be brute-forced through any future API endpoint.
- **Files:** `tazekalsin.sql` -- `Rezervasyon` table, sp_QR_Satis_Onayla, sp_QR_Satis_Tamamla
- **Current mitigation:** None.
- **Recommendation:** Hash the PIN before storage, enforce time-based expiry on `Rezervasyon.Durum`, or add an attempt counter with lockout on the API layer.

### No Input Validation Attributes on Request Models

- **Risk:** `RegisterRequest` and `LoginRequest` have no `[Required]`, `[EmailAddress]`, `[MaxLength]`, or `[RegularExpression]` annotations. Empty strings, malformed emails, and excessively long strings pass through to the database.
- **Files:** `TazeKalsin.API\Models\RegisterRequest.cs`, `TazeKalsin.API\Models\LoginRequest.cs`, `TazeKalsin.API\Controllers\AuthController.cs`
- **Current mitigation:** One manual password length check only.
- **Recommendation:** Add `[Required]`, `[EmailAddress]`, `[MaxLength(100)]` on all model fields. `[ApiController]` is already applied so validation runs automatically.

---

## Tech Debt

### Raw ADO.NET with Ordinal Column Reads -- No ORM or Query Abstraction

- **Issue:** All database access uses raw `SqlConnection` / `SqlCommand` / `SqlDataReader` in `AuthService`. Column values are read by numeric ordinal (`reader.GetInt32(0)`, `reader.GetString(1)`) which breaks silently if column order changes.
- **Files:** `TazeKalsin.API\Services\AuthService.cs` (lines 65-67, 86-93)
- **Impact:** Every future service module (Urun, Rezervasyon, Paket) will require the same boilerplate. A column reorder causes a silent runtime bug with no compile-time warning.
- **Fix approach:** Switch to named reads: `reader.GetString(reader.GetOrdinal("Ad_Soyad"))`. For new modules adopt Dapper which maps named columns automatically.

### No Repository Pattern -- Business Logic Mixed with Data Access

- **Issue:** `AuthService` directly opens SQL connections and executes queries. No data access layer separation. Future service classes will replicate this pattern.
- **Files:** `TazeKalsin.API\Services\AuthService.cs`
- **Impact:** The real `AuthService` is untestable without a live database. All existing tests mock `IAuthService` but the implementation has zero isolation from SQL.
- **Fix approach:** Introduce per-entity repository interfaces (e.g. `ITuketiciRepository`) wrapping data access. Services depend on the repository interface, not `SqlConnection` directly.

### Race Condition Between EmailMevcutMu and KayitOl (TOCTOU)

- **Issue:** `AuthController.Register` calls `EmailMevcutMu` then `KayitOl` as two separate round-trips with no transaction. Two simultaneous registrations with the same email can both pass the check before either INSERT completes.
- **Files:** `TazeKalsin.API\Controllers\AuthController.cs` (lines 23-30), `TazeKalsin.API\Services\AuthService.cs` (lines 31-51)
- **Impact:** The UNIQUE constraint on `Tuketici.Email` prevents data corruption, but the app receives an unhandled `SqlException` (error 2627) instead of a clean 409.
- **Fix approach:** Remove the pre-check. Catch `SqlException` number 2627 in `KayitOl` and return a conflict error. This is the TOCTOU-safe pattern.

### JWT Secret Read Twice from Configuration

- **Issue:** `Program.cs` reads `builder.Configuration["JWT:Secret"]` into `jwtSecret` (line 34), but `AuthService.TokenUret` reads `_config["JWT:Secret"]` again independently (line 99).
- **Files:** `TazeKalsin.API\Program.cs` (line 34), `TazeKalsin.API\Services\AuthService.cs` (line 99)
- **Impact:** Minor now; becomes a maintenance hazard if the config key name ever changes.
- **Fix approach:** Create a strongly-typed `JwtSettings` options class and inject `IOptions<JwtSettings>` into `AuthService`.

### Swashbuckle Pinned at 6.9.0 Due to Documented OpenAPI Conflict

- **Issue:** Commit `c53085d` records a forced downgrade of Swashbuckle to 6.9.0 to resolve an OpenAPI version conflict. The project is pinned below the current release.
- **Files:** `TazeKalsin.API\TazeKalsin.API.csproj` (line 13)
- **Impact:** Missing Swashbuckle fixes; may block upgrade when ASP.NET Core 9 Swashbuckle support matures.
- **Fix approach:** Re-evaluate upgrade to Swashbuckle 7.x or switch to built-in `Microsoft.AspNetCore.OpenApi` (included in .NET 9) which eliminates the third-party dependency.

### Two Conflicting Stored Procedures for the Same Operation

- **Issue:** `tazekalsin.sql` contains both `sp_QR_Satis_Onayla` and `sp_QR_Satis_Tamamla`. Both look up a PIN, update Rezervasyon.Durum to Tamamlandi, and increment Kurtarilan_Gida_Kg by 0.5. `sp_QR_Satis_Tamamla` uses `WITH (UPDLOCK, ROWLOCK)` and ISNULL guards; `sp_QR_Satis_Onayla` does not. Both exist in the schema.
- **Files:** `tazekalsin.sql` (lines 402-450 and 451-499)
- **Impact:** Calling the wrong procedure produces subtly different behaviour (missing locking, potential NULL error). Dead code in the schema creates confusion for new developers.
- **Fix approach:** Drop `sp_QR_Satis_Onayla`. Use only `sp_QR_Satis_Tamamla`. Document the decision in the migration script.

---

## Known Bugs

### Unhandled SqlException on Concurrent Duplicate Email Registration

- **Symptoms:** If two requests register the same email simultaneously, `KayitOl` throws an unhandled `SqlException` (unique constraint violation) surfacing as 500 Internal Server Error instead of 409 Conflict.
- **Files:** `TazeKalsin.API\Services\AuthService.cs` (line 47)
- **Trigger:** Concurrent POST `/api/auth/register` with the same email, or any direct POST bypassing the controller check.
- **Workaround:** None. The UNIQUE constraint prevents data corruption but the API response is wrong.

### Me Endpoint: Sub Claim Mapping Is Fragile Under MapInboundClaims = false

- **Symptoms:** `AuthController.Me` reads user ID via `User.FindFirstValue(ClaimTypes.NameIdentifier)` (line 47). `AuthService.TokenUret` writes the claim as `JwtRegisteredClaimNames.Sub` (line 105). Works today because ASP.NET Core maps sub to ClaimTypes.NameIdentifier by default (MapInboundClaims = true). If MapInboundClaims is set to false, Me silently returns 401 for all authenticated users.
- **Files:** `TazeKalsin.API\Controllers\AuthController.cs` (line 47), `TazeKalsin.API\Services\AuthService.cs` (line 105)
- **Workaround:** Currently works with defaults. Fix by using `User.FindFirstValue(JwtRegisteredClaimNames.Sub)` in the controller, or explicitly setting `MapInboundClaims = false` in JWT options and updating the controller accordingly.

---

## Performance Bottlenecks

### No Index on Rezervasyon.PIN_Kodu

- **Problem:** Both QR stored procedures query Rezervasyon WHERE PIN_Kodu = @p_PIN_Kodu. There is no index on this column -- every PIN lookup is a full table scan.
- **Files:** `tazekalsin.sql` -- `Rezervasyon` table (lines 238-253)
- **Cause:** Schema exported from SSMS without adding non-clustered indexes on high-frequency lookup columns.
- **Improvement path:** `CREATE NONCLUSTERED INDEX IX_Rezervasyon_PINKodu ON Rezervasyon (PIN_Kodu);`

### No Index on Bildirim.Tuketici_ID

- **Problem:** Fetching notifications for a user requires a full table scan on `Bildirim`.
- **Files:** `tazekalsin.sql` -- `Bildirim` table (lines 107-119)
- **Improvement path:** `CREATE NONCLUSTERED INDEX IX_Bildirim_TuketiciID ON Bildirim (Tuketici_ID);`

### No Index on Urun.Market_ID or Urun.SKT

- **Problem:** Product listings filtered by market or expiry date -- the core query of the platform -- will do full table scans on `Urun`.
- **Files:** `tazekalsin.sql` -- `Urun` table (lines 281-296)
- **Improvement path:** `CREATE NONCLUSTERED INDEX IX_Urun_MarketID_SKT ON Urun (Market_ID, SKT);`

---

## Fragile Areas

### Trigger trg_Rezervasyon_StokDus Silently No-Ops on Paket Reservations

- **Files:** `tazekalsin.sql` (lines 563-576)
- **Why fragile:** The trigger decrements `Urun.Stok_Miktari` via INNER JOIN inserted ON Urun.Urun_ID = inserted.Urun_ID. The CHK_Urun_Veya_Paket constraint allows Urun_ID IS NULL when Paket_ID IS NOT NULL. When a Paket-based reservation is inserted, the INNER JOIN produces no rows -- stock is never decremented and no error is raised. There is no corresponding stock logic for Paket.Stok_Adedi.
- **Safe modification:** Before building Paket-based reservation endpoints, extend the trigger or replace with explicit SP logic to handle `Paket_ID` paths. Add an integration test asserting Paket.Stok_Adedi decrements on Paket reservations.
- **Test coverage:** None.

### sp_QR_Satis_Onayla Lacks Row-Level Locking

- **Files:** `tazekalsin.sql` (lines 412-450)
- **Why fragile:** Unlike `sp_QR_Satis_Tamamla`, this procedure does not use `WITH (UPDLOCK, ROWLOCK)` on its SELECT. Under concurrent PIN submissions the same reservation can be processed twice.
- **Safe modification:** Do not call `sp_QR_Satis_Onayla`. Use only `sp_QR_Satis_Tamamla`.

### Kurtarilan_Gida_Kg Hardcoded to +0.5 Per Transaction

- **Files:** `tazekalsin.sql` -- both QR stored procedures (lines 433, 480)
- **Why fragile:** The environmental impact score increments by a fixed 0.5 kg regardless of actual product weight, quantity, or category. This is a placeholder with no business logic backing it. Any UI displaying this as an accurate measurement is misleading.
- **Safe modification:** Stored procedures must eventually accept or calculate actual weight. Document as an estimate in all UI copy until fixed.

### OpenAPI Spec Shows All Request Fields as Nullable

- **Files:** `tazekalsin-api.json` (lines 89-96, 100-115)
- **Why fragile:** The generated spec marks all request body fields (`email`, `sifre`, `ad_Soyad`) as nullable: true. This contradicts intended validation and will mislead client code generators. It is a symptom of missing `[Required]` annotations on model classes.
- **Safe modification:** Add `[Required]` annotations to model properties and regenerate the spec.

---

## Test Coverage Gaps

### AuthService Implementation Is Not Tested

- **What is not tested:** The actual database-calling implementation `AuthService` has zero test coverage. All existing tests mock `IAuthService` and test only controller routing logic.
- **Files:** `TazeKalsin.API\Services\AuthService.cs` -- no corresponding test file exists.
- **Risk:** Bugs in SQL queries, BCrypt calls, token generation, and connection handling go undetected until manual testing.
- **Priority:** High.

### Me Endpoint Edge Cases Not Tested

- **What is not tested:** Missing claim, `int.TryParse` failure on claim value, and `KullaniciBul` returning null are all untested paths in `AuthController.Me`.
- **Files:** `TazeKalsin.Tests\AuthControllerTests.cs`
- **Risk:** The 401 (missing/bad claim) and 404 (user not found) paths are exercised only by manual Swagger testing.
- **Priority:** Medium.

### No Integration Tests for Stored Procedures or Trigger

- **What is not tested:** `sp_Rezervasyon_Yapar`, `sp_QR_Satis_Tamamla`, `trg_Rezervasyon_StokDus` -- all core transaction logic -- have no automated tests.
- **Files:** `tazekalsin.sql`
- **Risk:** Race condition handling, stock decrement, and PIN validation logic can only be verified by manual SSMS execution.
- **Priority:** High.

### No Negative-Path or Boundary Tests for Register Validation

- **What is not tested:** Empty password, null request body, missing email field, invalid email format, strings exceeding column width limits.
- **Files:** `TazeKalsin.Tests\AuthControllerTests.cs`
- **Risk:** Malformed inputs reach the database layer unfiltered.
- **Priority:** Medium.

---

## Scaling Limits

### SQL Server Express Edition

- **Current capacity:** SQL Server Express is capped at 10 GB and does not support SQL Server Agent. The `Bildirim` (notifications) system and any scheduled expiry-cleanup jobs have no automated runner on Express.
- **Limit:** At high reservation volume the 10 GB cap may be reached. No scheduled jobs means expired reservations and past-SKT products accumulate without cleanup.
- **Scaling path:** Migrate to SQL Server Standard/Developer edition or Azure SQL for production. Express is acceptable for development and early testing.

### No Caching Layer

- **Current capacity:** Every API request opens a new `SqlConnection`. Product listings, category lookups, and market reference data (all mostly read-only) hit the database on every call.
- **Limit:** Under concurrent user load, unindexed queries block the connection pool. `Microsoft.Data.SqlClient` handles connection pooling automatically but long-running table scans exhaust it.
- **Scaling path:** Add `IMemoryCache` for reference data (Kategori, Market lists). Add indexes (see Performance section) before adding any list endpoints.

---

## Dependencies at Risk

### Swashbuckle.AspNetCore Pinned at 6.9.0

- **Risk:** Pinned below current stable release due to a documented OpenAPI version conflict (commit `c53085d`). May lag on .NET 9 compatibility fixes.
- **Impact:** Swagger UI functionality gaps; potential incompatibility on future ASP.NET Core minor version updates.
- **Migration plan:** Evaluate Swashbuckle 7.x or switch to the built-in `Microsoft.AspNetCore.OpenApi` (included in .NET 9) to eliminate the third-party Swagger dependency.

---

*Concerns audit: 2026-05-12*
