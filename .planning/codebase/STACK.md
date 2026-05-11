# Technology Stack

**Analysis Date:** 2026-05-12

## Languages

**Primary:**
- C# 13 (implicit, .NET 9) - All API and test code

**Secondary:**
- T-SQL - Database schema, stored procedures, triggers (tazekalsin.sql)

## Runtime

**Environment:**
- .NET 9.0 (net9.0 target framework in both projects)

**Package Manager:**
- NuGet (via <PackageReference> in .csproj files)
- Lockfile: Not present (no packages.lock.json detected)

## Frameworks

**Core:**
- ASP.NET Core 9 (via Microsoft.NET.Sdk.Web) - Web API host, routing, DI, middleware
  - TazeKalsin.API/TazeKalsin.API.csproj

**Testing:**
- xunit 2.9.2 - Test runner and assertion library
- Moq 4.20.72 - Mocking framework for unit tests
- Microsoft.NET.Test.Sdk 17.12.0 - Test host
- xunit.runner.visualstudio 2.8.2 - Visual Studio test runner integration
- coverlet.collector 6.0.2 - Code coverage collection
  - TazeKalsin.Tests/TazeKalsin.Tests.csproj

**Build/Dev:**
- Visual Studio 2022 (solution format version 17, TazeKalsin.sln)
- Swashbuckle.AspNetCore 6.9.0 - Swagger/OpenAPI documentation generation
  - Note: Downgraded from a higher version to 6.9.0 to resolve OpenAPI version conflicts

## Key Dependencies

**Critical:**
- Microsoft.AspNetCore.Authentication.JwtBearer 9.0.6 - JWT Bearer token authentication middleware; required for all [Authorize] endpoints
- Microsoft.Data.SqlClient 7.0.1 - SQL Server database driver; used directly (no ORM) in TazeKalsin.API/Services/AuthService.cs
- BCrypt.Net-Next 4.1.0 - Password hashing and verification; used in TazeKalsin.API/Services/AuthService.cs for KayitOl and GirisYap

**Infrastructure:**
- Microsoft.IdentityModel.Tokens (transitive via JwtBearer) - JWT token creation and validation in TazeKalsin.API/Services/AuthService.cs

## Configuration

**Environment:**
- Configured via TazeKalsin.API/appsettings.json (base) and TazeKalsin.API/appsettings.Development.json (dev overrides)
- No .env file present — all configuration through ASP.NET Core built-in IConfiguration
- Key configs required:
  - ConnectionStrings:TazeKalsinDB — SQL Server connection string
  - JWT:Secret — Symmetric signing key (min 32 characters)
  - JWT:Issuer — Token issuer claim value
  - JWT:Audience — Token audience claim value
  - JWT:ExpiryDays — Token lifetime in days (default: 7)

**Build:**
- TazeKalsin.API/TazeKalsin.API.csproj — API project build config
- TazeKalsin.Tests/TazeKalsin.Tests.csproj — Test project build config (IsPackable=false)
- TazeKalsin.sln — Solution file tying both projects together
- TazeKalsin.API/Properties/ — Launch profiles (launchSettings.json)

## Platform Requirements

**Development:**
- .NET 9 SDK
- SQL Server (Express edition configured: .\SQLEXPRESS) or any SQL Server instance
- Visual Studio 2022 or VS Code with C# Dev Kit

**Production:**
- Any platform supporting .NET 9 runtime (Windows, Linux, macOS)
- SQL Server 2019 or later (compatibility level 160 = SQL Server 2022 per schema)
- Database: TazeKalsinDB created from tazekalsin.sql

---

*Stack analysis: 2026-05-12*
