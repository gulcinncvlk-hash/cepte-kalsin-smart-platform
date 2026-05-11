# Testing Patterns

**Analysis Date:** 2026-05-12

## Test Framework

**Runner:**
- xUnit 2.9.2
- Config: `TazeKalsin.Tests/TazeKalsin.Tests.csproj`

**Assertion Library:**
- xUnit built-in (`Assert.*`)

**Mocking Library:**
- Moq 4.20.72

**Coverage Collector:**
- coverlet.collector 6.0.2

**Run Commands:**
```bash
dotnet test                        # Run all tests
dotnet test --logger "console;verbosity=detailed"  # Verbose output
dotnet test --collect:"XPlat Code Coverage"        # Coverage report
```

## Test File Organization

**Location:**
- Separate test project: `TazeKalsin.Tests/`
- All test files at the project root (no subdirectories currently)

**Naming:**
- Test class files: `{ControllerOrService}Tests.cs` -- e.g., `AuthControllerTests.cs`
- Test method names in Turkish, describing scenario and expected result:
  `{Method}_{Scenario}_{ExpectedOutcome}` -- e.g., `Register_SifreCokKisa_400Doner`

**Current Test Files:**
- `TazeKalsin.Tests/AuthControllerTests.cs` -- 6 tests covering AuthController

## Test Structure

**Suite Organization:**
```csharp
public class AuthControllerTests
{
    private readonly Mock<IAuthService> _mockService;
    private readonly AuthController _controller;

    // Constructor used for shared setup (no [SetUp] attribute)
    public AuthControllerTests()
    {
        _mockService = new Mock<IAuthService>();
        _controller = new AuthController(_mockService.Object);
    }

    [Fact]
    public async Task Register_SifreCokKisa_400Doner()
    {
        // Arrange: create request inline
        var request = new RegisterRequest { ... };

        // Act: call controller directly
        var result = await _controller.Register(request);

        // Assert: check result type
        Assert.IsType<BadRequestObjectResult>(result);
    }
}
```

**Patterns:**
- Constructor-based setup (no `[SetUp]` / `IAsyncLifetime`)
- Arrange-Act-Assert structure within each test method (not labeled with comments)
- `[Fact]` attribute for all tests -- no `[Theory]` / `[InlineData]` parameterized tests yet
- All test methods are `async Task`

## Mocking

**Framework:** Moq 4.20.72

**Setup Pattern:**
```csharp
// Return specific value for specific argument
_mockService.Setup(s => s.EmailMevcutMu("var@test.com")).ReturnsAsync(true);

// Return value for any argument of a type
_mockService.Setup(s => s.KayitOl(It.IsAny<RegisterRequest>()))
    .ReturnsAsync(new AuthResponse { Token = "jwt-token", ... });

// Return null (nullable service response)
_mockService.Setup(s => s.GirisYap(It.IsAny<LoginRequest>()))
    .ReturnsAsync((AuthResponse?)null);
```

**What is Mocked:**
- `IAuthService` -- the only dependency of `AuthController`
- Service layer is always mocked; no real database calls in tests

**What is NOT Mocked:**
- `AuthController` itself -- instantiated directly with the mock service
- ASP.NET framework types (`ControllerContext`, `DefaultHttpContext`, `ClaimsPrincipal`) -- set up manually for the `Me` endpoint test

**HttpContext Setup for JWT Claims Tests:**
```csharp
var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "42") };
var identity = new System.Security.Principal.GenericIdentity("test@test.com");
identity.AddClaims(claims);
_controller.ControllerContext = new ControllerContext
{
    HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext
    {
        User = new System.Security.Claims.ClaimsPrincipal(identity)
    }
};
```

## Fixtures and Factories

**Test Data:**
- Inline anonymous object / model instantiation within each test -- no shared factories
- No fixture classes or builder patterns currently

```csharp
var request = new RegisterRequest
{
    Ad_Soyad = "Test Kullanici",
    Email = "test@test.com",
    Sifre = "kisa"
};
```

**Location:**
- No separate fixtures directory -- test data lives inline in each test method

## Coverage

**Requirements:** No enforced coverage threshold detected

**Collector installed:** coverlet.collector 6.0.2 (XML/Cobertura format)

**View Coverage:**
```bash
dotnet test --collect:"XPlat Code Coverage"
# Output: TestResults/{guid}/coverage.cobertura.xml
```

**Current Coverage (observed):**
- `AuthController` -- all 3 action methods covered (Register, Login, Me)
- `AuthService` -- not directly tested (only via mock)
- `Program.cs` -- not tested
- `Models` -- not tested (plain data classes)

## Test Types

**Unit Tests:**
- Scope: controller layer only (`AuthController`)
- Approach: mock the service interface, assert on HTTP result types and status codes
- Location: `TazeKalsin.Tests/AuthControllerTests.cs`

**Integration Tests:**
- Not present -- no `WebApplicationFactory` or `TestServer` usage

**E2E Tests:**
- Not used

## Common Patterns

**Asserting HTTP Result Type:**
```csharp
Assert.IsType<BadRequestObjectResult>(result);
Assert.IsType<ConflictObjectResult>(result);
Assert.IsType<UnauthorizedObjectResult>(result);
Assert.IsType<OkObjectResult>(result);
Assert.IsType<ObjectResult>(result);  // for StatusCode(201, ...)
Assert.Equal(201, ((ObjectResult)result).StatusCode);
```

**Asserting Response Body:**
```csharp
var ok = Assert.IsType<OkObjectResult>(result);
var dto = Assert.IsType<TuketiciDto>(ok.Value);
Assert.Equal(42, dto.Tuketici_ID);
```

**Async Testing:**
```csharp
[Fact]
public async Task MethodName_Scenario_ExpectedResult()
{
    // All controller actions are async -- always await the result
    var result = await _controller.Register(request);
    Assert.IsType<BadRequestObjectResult>(result);
}
```

**Error/Null Path Testing:**
```csharp
// Service returns null to simulate not-found / auth failure
_mockService.Setup(s => s.GirisYap(It.IsAny<LoginRequest>()))
    .ReturnsAsync((AuthResponse?)null);
var result = await _controller.Login(request);
Assert.IsType<UnauthorizedObjectResult>(result);
```

## Adding New Tests

- Add new test classes to `TazeKalsin.Tests/` following the `{Subject}Tests.cs` naming pattern
- Follow Turkish method naming convention: `{Method}_{Scenario}_{ExpectedOutcome}`
- Use constructor-based setup for shared mocks; do not use `[SetUp]` (xUnit does not support it)
- Mock new service interfaces the same way: `new Mock<INewService>()`
- For endpoints using `[Authorize]`, set up `ControllerContext` with a `ClaimsPrincipal` as shown in `Me` test

---

*Testing analysis: 2026-05-12*
