# Coding Conventions

**Analysis Date:** 2026-05-12

## Naming Patterns

**Files:**
- PascalCase for all C# source files: `AuthController.cs`, `AuthService.cs`, `IAuthService.cs`
- Interface files prefixed with `I`: `IAuthService.cs`
- Model files named after the type they represent: `AuthResponse.cs`, `LoginRequest.cs`, `RegisterRequest.cs`, `TuketiciDto.cs`
- Test files named `{Subject}Tests.cs`: `AuthControllerTests.cs`

**Classes:**
- PascalCase: `AuthController`, `AuthService`, `AuthResponse`, `TuketiciDto`
- Controller classes suffixed with `Controller`: `AuthController`
- Service implementation classes suffixed with `Service`: `AuthService`
- Interface names prefixed with `I`: `IAuthService`
- DTO classes suffixed with `Dto`: `TuketiciDto`
- Request model classes suffixed with `Request`: `LoginRequest`, `RegisterRequest`

**Methods:**
- Turkish-language domain method names in PascalCase: `EmailMevcutMu`, `KayitOl`, `GirisYap`, `KullaniciBul`, `TokenUret`
- Standard ASP.NET action names in English PascalCase: `Register`, `Login`, `Me`
- Private helper methods in PascalCase: `TokenUret`

**Properties:**
- PascalCase for public properties: `Token`, `Email`, `Ad_Soyad`, `Tuketici_ID`, `Kurtarilan_Gida_Kg`
- Database column names preserved with underscores in DTO/model properties: `Ad_Soyad`, `Tuketici_ID`, `Kurtarilan_Gida_Kg`
- English domain terms stay in English: `Token`, `Email`

**Private Fields:**
- `_camelCase` with underscore prefix for injected dependencies: `_authService`, `_config`, `_connectionString`
- Mock fields in tests follow the same pattern: `_mockService`, `_controller`

**Namespaces:**
- Follow project folder structure: `TazeKalsin.API.Controllers`, `TazeKalsin.API.Services`, `TazeKalsin.API.Models`, `TazeKalsin.Tests`
- File-scoped namespace declarations (C# 10+ style): `namespace TazeKalsin.API.Controllers;`

## Language Mix Convention

The project uses Turkish for domain-specific method names and English for infrastructure/framework code:
- Turkish: business method names (`KayitOl`, `GirisYap`, `EmailMevcutMu`), property names mirroring DB columns (`Ad_Soyad`, `Sifre`)
- English: controller actions (`Register`, `Login`, `Me`), framework constructs, private fields

This is intentional and must be preserved when adding new code.

## Code Style

**Formatting:**
- No `.editorconfig` detected -- formatting follows Visual Studio defaults
- Allman-style braces for class and method bodies
- Single-line if statements without braces for simple guard clauses:

```csharp
if (request.Sifre.Length < 8)
    return BadRequest(new { message = "Sifre en az 8 karakter olmalidir." });
```

- Inline null checks on single lines: `if (user == null) return NotFound();`

**C# Language Features:**
- `net9.0` target framework
- Nullable reference types enabled (`<Nullable>enable</Nullable>`)
- Implicit usings enabled (`<ImplicitUsings>enable</ImplicitUsings>`)
- Null-forgiving operator `!` used when config values are known to exist: `_config["JWT:Secret"]!`
- Nullable return types on service methods that may find nothing: `Task<AuthResponse?>`, `Task<TuketiciDto?>`
- `using var` for all disposable resources (SqlConnection, SqlDataReader)
- `var` for local variables where type is obvious from context
- String default values via `= string.Empty` on all string properties in models

**Dependency Injection:**
- Constructor injection exclusively -- no property injection or service locator
- `AddScoped<IAuthService, AuthService>()` lifetime for services (`TazeKalsin.API/Program.cs` line 50)
- Interfaces always injected, never concrete types

## Import Organization

**Order (as observed in source files):**
1. `System.*` namespaces
2. `Microsoft.*` namespaces
3. Third-party namespaces (e.g., `BCrypt.Net`)
4. Internal project namespaces (`TazeKalsin.API.*`)

**Style:**
- Standard `using` directives at file top
- File-scoped namespaces placed after using directives
- No using alias directives

## Error Handling

**Controller Pattern (`TazeKalsin.API/Controllers/AuthController.cs`):**
- Guard clauses return early with appropriate HTTP result types:
  - `BadRequest(new { message = "..." })` -- validation failures (400)
  - `Conflict(new { message = "..." })` -- duplicate resource (409)
  - `Unauthorized(new { message = "..." })` -- wrong credentials (401)
  - `Unauthorized()` (no body) -- missing or unparseable JWT claims
  - `NotFound()` -- resource not found (404)
  - `Ok(response)` -- success (200)
  - `StatusCode(201, response)` -- creation success (201)
- All error responses use anonymous object `new { message = "..." }` -- never raw strings

**Service Pattern (`TazeKalsin.API/Services/AuthService.cs`):**
- Services return `null` to signal "not found" -- callers check null
- No exceptions thrown for expected domain failures (wrong password, duplicate email)
- All database operations use `await` -- no blocking `.Result` calls

**Missing:**
- No global exception handling middleware in `Program.cs`
- Unhandled exceptions surface as 500 responses with no structured body

## Logging

- No logging framework configured or injected
- No `ILogger<T>` dependency in any class
- No structured logging (Serilog, NLog, etc.) detected

## Comments

- No XML doc comments (`///`) on any class or method
- No inline comments in production code
- Turkish-language string literals in all user-facing error messages

## Model Design

**Request Models** (`TazeKalsin.API/Models/`):
- Plain classes with auto-properties, all initialized to `string.Empty`
- No data annotation attributes (`[Required]`, `[EmailAddress]`) -- validation is manual in the controller
- No record types -- all plain `class` declarations

**DTO/Response Models:**
- Properties mirror database column names including underscores: `Ad_Soyad`, `Tuketici_ID`, `Kurtarilan_Gida_Kg`
- Numeric fields are non-nullable value types defaulting to `0`

## Database Access Pattern

- Raw ADO.NET with `SqlConnection` / `SqlCommand` -- no ORM
- Parameterized queries always used: `cmd.Parameters.AddWithValue("@param", value)`
- `using var` pattern for all connections and readers
- Connection string resolved once in constructor and stored in `_connectionString` field
- Multi-line SQL written as verbatim string literals (`@"..."`)

---

*Convention analysis: 2026-05-12*
