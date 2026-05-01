using Microsoft.AspNetCore.Mvc;
using Moq;
using TazeKalsin.API.Controllers;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.Tests;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _mockService;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _mockService = new Mock<IAuthService>();
        _controller = new AuthController(_mockService.Object);
    }

    [Fact]
    public async Task Register_SifreCokKisa_400Doner()
    {
        var request = new RegisterRequest
        {
            Ad_Soyad = "Test Kullanıcı",
            Email = "test@test.com",
            Sifre = "kisa"
        };

        var result = await _controller.Register(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_EmailZatenVar_409Doner()
    {
        _mockService.Setup(s => s.EmailMevcutMu("var@test.com")).ReturnsAsync(true);
        var request = new RegisterRequest
        {
            Ad_Soyad = "Test Kullanıcı",
            Email = "var@test.com",
            Sifre = "Sifre1234"
        };

        var result = await _controller.Register(request);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task Register_GecerliIstek_201Doner()
    {
        _mockService.Setup(s => s.EmailMevcutMu("yeni@test.com")).ReturnsAsync(false);
        _mockService.Setup(s => s.KayitOl(It.IsAny<RegisterRequest>()))
            .ReturnsAsync(new AuthResponse { Token = "jwt-token", Ad_Soyad = "Test", Email = "yeni@test.com" });

        var request = new RegisterRequest
        {
            Ad_Soyad = "Test Kullanıcı",
            Email = "yeni@test.com",
            Sifre = "Sifre1234"
        };

        var result = await _controller.Register(request);

        Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, ((ObjectResult)result).StatusCode);
    }

    [Fact]
    public async Task Login_YanlisKimlik_401Doner()
    {
        _mockService.Setup(s => s.GirisYap(It.IsAny<LoginRequest>()))
            .ReturnsAsync((AuthResponse?)null);

        var request = new LoginRequest { Email = "yok@test.com", Sifre = "YanlisPass1" };

        var result = await _controller.Login(request);

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Login_DogruKimlik_200Doner()
    {
        _mockService.Setup(s => s.GirisYap(It.IsAny<LoginRequest>()))
            .ReturnsAsync(new AuthResponse { Token = "jwt-token", Ad_Soyad = "Test", Email = "test@test.com" });

        var request = new LoginRequest { Email = "test@test.com", Sifre = "Dogru1234" };

        var result = await _controller.Login(request);

        Assert.IsType<OkObjectResult>(result);
    }
}
