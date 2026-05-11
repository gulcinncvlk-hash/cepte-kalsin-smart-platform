<!-- refreshed: 2026-05-12 -->
# Architecture

**Analysis Date:** 2026-05-12

## System Overview

```text
+-------------------------------------------------------------+
|                     HTTP Request Layer                      |
|              (ASP.NET Core Minimal Hosting)                 |
|              TazeKalsin.API/Program.cs                      |
+-----------------------------+-------------------------------+
                              |
               JWT Bearer Middleware
               Authorization Middleware
                              |
                              v
+-------------------------------------------------------------+
|                   Controller Layer                          |
|       TazeKalsin.API/Controllers/AuthController.cs          |
|  POST /api/auth/register  POST /api/auth/login  GET /me     |
+-----------------------------+-------------------------------+
                              |  IAuthService (interface)
                              v
+-------------------------------------------------------------+
|                    Service Layer                            |
|          TazeKalsin.API/Services/AuthService.cs             |
|  EmailMevcutMu  KayitOl  GirisYap  KullaniciBul  TokenUret |
+-----------------------------+-------------------------------+
                              |  Raw ADO.NET (SqlConnection)
                              v
+-------------------------------------------------------------+
|                   Data Layer (SQL Server)                   |
|  Table: Tuketici (Tuketici_ID, Ad_Soyad, Email,             |
|                   Sifre_Hash, Kurtarilan_Gida_Kg)           |
|  Connection: appsettings.json -> TazeKalsinDB               |
+-------------------------------------------------------------+
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Program.cs | DI registration, middleware pipeline, JWT config | `TazeKalsin.API/Program.cs` |
| AuthController | HTTP routing, input validation, HTTP status codes | `TazeKalsin.API/Controllers/AuthController.cs` |
| IAuthService | Service contract (interface) | `TazeKalsin.API/Services/IAuthService.cs` |
| AuthService | Business logic, DB access, JWT generation, BCrypt | `TazeKalsin.API/Services/AuthService.cs` |
| RegisterRequest | Request DTO for registration | `TazeKalsin.API/Models/RegisterRequest.cs` |
| LoginRequest | Request DTO for login | `TazeKalsin.API/Models/LoginRequest.cs` |
| AuthResponse | Response DTO carrying JWT token + user info | `TazeKalsin.API/Models/AuthResponse.cs` |
| TuketiciDto | Read DTO for consumer profile data | `TazeKalsin.API/Models/TuketiciDto.cs` |
| AuthControllerTests | xUnit controller unit tests with Moq | `TazeKalsin.Tests/AuthControllerTests.cs` |

## Pattern Overview

**Overall:** Vertical Slice / Layered Monolith (single-feature slice)

**Key Characteristics:**
- Controller -> Interface -> Service -> ADO.NET (no ORM, no repository layer)
- Interface-driven service abstraction enabling unit test mocking via Moq
- Scoped lifetime for IAuthService/AuthService (registered in DI per request)
- All DB access is raw ADO.NET with parameterized SqlCommand -- no Entity Framework
- JWT tokens are self-contained; no refresh token mechanism exists

## Layers

**Presentation Layer:**
- Purpose: Accept HTTP requests, perform basic input guards, return HTTP status codes
- Location: `TazeKalsin.API/Controllers/`
- Contains: AuthController.cs -- one controller, three endpoints
- Depends on: IAuthService, TazeKalsin.API.Models
- Used by: External HTTP clients

**Service Layer:**
- Purpose: Business logic, password hashing, JWT generation, database queries
- Location: `TazeKalsin.API/Services/`
- Contains: IAuthService.cs (interface), AuthService.cs (implementation)
- Depends on: Microsoft.Data.SqlClient, BCrypt.Net-Next, Microsoft.IdentityModel.Tokens, IConfiguration
- Used by: AuthController

**Model Layer:**
- Purpose: Strongly typed request/response shapes; no validation attributes currently
- Location: `TazeKalsin.API/Models/`
- Contains: RegisterRequest.cs, LoginRequest.cs, AuthResponse.cs, TuketiciDto.cs
- Depends on: Nothing
- Used by: Controllers and Services

**Data Layer:**
- Purpose: SQL Server persistence via raw ADO.NET inside AuthService
- Location: Embedded in `TazeKalsin.API/Services/AuthService.cs`
- Contains: Inline SqlConnection + SqlCommand calls
- Depends on: Microsoft.Data.SqlClient, connection string from appsettings.json
- Used by: AuthService methods only

## Data Flow

### POST /api/auth/register

1. HTTP POST body deserialized to RegisterRequest (`TazeKalsin.API/Models/RegisterRequest.cs`)
2. Controller checks request.Sifre.Length < 8 -> 400 if too short (`AuthController.cs:23`)
3. Controller calls _authService.EmailMevcutMu(email) -> 409 if already exists (`AuthController.cs:27`)
4. Controller calls _authService.KayitOl(request) (`AuthService.cs:31`)
5. AuthService hashes password with BCrypt, inserts row into Tuketici table, retrieves new SCOPE_IDENTITY() ID
6. AuthService.TokenUret() generates HS256 JWT with claims: sub (Tuketici_ID), email, name (`AuthService.cs:97`)
7. Returns AuthResponse { Token, Ad_Soyad, Email } with HTTP 201

### POST /api/auth/login

1. HTTP POST body deserialized to LoginRequest (`TazeKalsin.API/Models/LoginRequest.cs`)
2. Controller calls _authService.GirisYap(request) (`AuthService.cs:53`)
3. AuthService queries Tuketici by email, calls BCrypt.Verify against stored hash
4. Returns null on mismatch -> Controller returns 401
5. On success, TokenUret() generates JWT and returns AuthResponse with HTTP 200

### GET /api/auth/me (Authenticated)

1. JWT Bearer middleware validates token, populates User claims principal
2. Controller extracts ClaimTypes.NameIdentifier (Tuketici_ID) from claims (`AuthController.cs:47`)
3. Calls _authService.KullaniciBul(tuketiciId) (`AuthService.cs:75`)
4. Queries Tuketici for Tuketici_ID, Ad_Soyad, Email, Kurtarilan_Gida_Kg
5. Returns TuketiciDto with HTTP 200, or 404 if not found

**State Management:**
- Stateless -- all state in JWT claims and SQL Server; no server-side session

## Key Abstractions

**IAuthService:**
- Purpose: Service contract that decouples the controller from the concrete implementation
- Examples: `TazeKalsin.API/Services/IAuthService.cs`
- Pattern: Interface + Scoped DI registration (Program.cs:50)

**AuthResponse / TuketiciDto:**
- Purpose: Separate write-path response shape (AuthResponse) from read-path shape (TuketiciDto)
- Examples: `TazeKalsin.API/Models/AuthResponse.cs`, `TazeKalsin.API/Models/TuketiciDto.cs`
- Pattern: DTO -- no domain model class; data mapped directly from SqlDataReader

## Entry Points

**HTTP API:**
- Location: `TazeKalsin.API/Program.cs`
- Triggers: dotnet run launches Kestrel; app.MapControllers() registers all [ApiController] routes
- Responsibilities: Builds DI container, registers JWT auth, wires Swagger, starts web server

**Swagger UI:**
- Location: Served at /swagger (enabled unconditionally -- no environment guard)
- Triggers: Any HTTP request to /swagger
- Responsibilities: Interactive API documentation with Bearer token support

## Architectural Constraints

- **Threading:** ASP.NET Core async I/O; all service methods are async Task<T>; no blocking calls
- **Global state:** IConfiguration injected via DI -- no module-level static singletons
- **ORM:** None -- all SQL is hand-written inline inside AuthService; no query builder or migration tooling
- **No repository layer:** AuthService directly opens SqlConnection; the service IS the data access layer
- **Single table:** Only the Tuketici table is accessed; schema defined externally in tazekalsin.sql

## Anti-Patterns

### Business logic mixed with data access in AuthService

**What happens:** AuthService (`TazeKalsin.API/Services/AuthService.cs`) performs both JWT token generation and raw SQL queries in the same class.
**Why it is wrong:** Makes the service harder to unit test at the data layer; adding a new data source or caching layer requires rewriting the service.
**Do this instead:** Introduce a repository interface (e.g., ITuketiciRepository) that AuthService calls, keeping SQL isolated and separately mockable.

### Swagger enabled unconditionally in production pipeline

**What happens:** Program.cs lines 54-55 call app.UseSwagger() and app.UseSwaggerUI() with no app.Environment.IsDevelopment() guard.
**Why it is wrong:** Exposes full API schema and interactive console in production environments.
**Do this instead:** Wrap both calls in if (app.Environment.IsDevelopment()) in `TazeKalsin.API/Program.cs`.

### Inline SQL strings without a query layer

**What happens:** SQL strings are hardcoded directly in AuthService methods (AuthService.cs:38, AuthService.cs:58, AuthService.cs:80).
**Why it is wrong:** Schema changes require hunting through service code; no compile-time safety.
**Do this instead:** Extract SQL constants to a static class or use a micro-ORM such as Dapper.

## Error Handling

**Strategy:** Controller-level guard clauses returning typed IActionResult responses; no global exception middleware present.

**Patterns:**
- Password too short: inline if in controller -> BadRequest (`AuthController.cs:23`)
- Duplicate email: service check -> Conflict (`AuthController.cs:27`)
- Invalid credentials: service returns null -> Unauthorized (`AuthController.cs:37`)
- User not found by ID: service returns null -> NotFound (`AuthController.cs:52`)
- No try/catch blocks -- unhandled SqlException or network errors propagate as HTTP 500

## Cross-Cutting Concerns

**Logging:** Default ASP.NET Core ILogger infrastructure configured in appsettings.json; no explicit log calls in service or controller code.
**Validation:** Manual inline guards in AuthController only (password length, email uniqueness); no [Required], [EmailAddress], or FluentValidation attributes on models.
**Authentication:** JWT Bearer via Microsoft.AspNetCore.Authentication.JwtBearer; token validated on every [Authorize] endpoint; issuer, audience, and signing key configured in appsettings.json under JWT:*.

---

*Architecture analysis: 2026-05-12*
