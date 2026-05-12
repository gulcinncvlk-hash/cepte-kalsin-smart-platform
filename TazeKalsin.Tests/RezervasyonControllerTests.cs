using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using System.Security.Principal;
using TazeKalsin.API.Controllers;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.Tests;

public class RezervasyonControllerTests
{
    private readonly Mock<IRezervasyonService> _mock;
    private readonly RezervasyonController _controller;

    public RezervasyonControllerTests()
    {
        _mock = new Mock<IRezervasyonService>();
        _controller = new RezervasyonController(_mock.Object);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = KullaniciOlustur(1) }
        };
    }

    [Fact]
    public async Task RezervasyonYap_MiktarSifir_400Doner()
    {
        var request = new RezervasyonYapRequest { Urun_ID = 1, Miktar = 0 };
        var result = await _controller.RezervasyonYap(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RezervasyonYap_ArgumentException_400Doner()
    {
        _mock.Setup(s => s.RezervasyonYap(1, It.IsAny<RezervasyonYapRequest>()))
             .ThrowsAsync(new ArgumentException("Urun_ID veya Paket_ID belirtilmelidir."));
        var request = new RezervasyonYapRequest { Miktar = 1 };
        var result = await _controller.RezervasyonYap(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RezervasyonYap_StokTukenmis_409Doner()
    {
        _mock.Setup(s => s.RezervasyonYap(1, It.IsAny<RezervasyonYapRequest>()))
             .ThrowsAsync(new InvalidOperationException("Bu paket tükenmiştir."));
        var request = new RezervasyonYapRequest { Paket_ID = 5, Miktar = 1 };
        var result = await _controller.RezervasyonYap(request);
        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task RezervasyonYap_Basarili_201Doner()
    {
        var dto = new RezervasyonDto { Islem_ID = 10, PIN_Kodu = "123456" };
        _mock.Setup(s => s.RezervasyonYap(1, It.IsAny<RezervasyonYapRequest>())).ReturnsAsync(dto);
        var request = new RezervasyonYapRequest { Urun_ID = 1, Miktar = 1 };
        var result = await _controller.RezervasyonYap(request);
        var obj = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, obj.StatusCode);
    }

    [Fact]
    public async Task RezervasyonlariGetir_200Doner()
    {
        _mock.Setup(s => s.RezervasyonlariGetir(1)).ReturnsAsync(new List<RezervasyonDto>());
        var result = await _controller.RezervasyonlariGetir();
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task RezervasyonIptal_Bulunamadi_404Doner()
    {
        _mock.Setup(s => s.RezervasyonIptal(1, 99)).ReturnsAsync(false);
        var result = await _controller.RezervasyonIptal(99);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task RezervasyonIptal_Basarili_200Doner()
    {
        _mock.Setup(s => s.RezervasyonIptal(1, 5)).ReturnsAsync(true);
        var result = await _controller.RezervasyonIptal(5);
        Assert.IsType<OkObjectResult>(result);
    }

    private static ClaimsPrincipal KullaniciOlustur(int tuketiciId)
    {
        var identity = new GenericIdentity("test@test.com");
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, tuketiciId.ToString()));
        return new ClaimsPrincipal(identity);
    }
}
