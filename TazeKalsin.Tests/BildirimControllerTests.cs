using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using System.Security.Principal;
using TazeKalsin.API.Controllers;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.Tests;

public class BildirimControllerTests
{
    private readonly Mock<IBildirimService> _mock;
    private readonly BildirimController _controller;

    public BildirimControllerTests()
    {
        _mock = new Mock<IBildirimService>();
        _controller = new BildirimController(_mock.Object);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = KullaniciOlustur(3) }
        };
    }

    [Fact]
    public async Task BildirimleriGetir_200Doner()
    {
        _mock.Setup(s => s.BildirimleriGetir(3)).ReturnsAsync(new List<BildirimDto>());
        var result = await _controller.BildirimleriGetir();
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task OkunmamisSayisi_SayiDoner()
    {
        _mock.Setup(s => s.OkunmamisSayisi(3)).ReturnsAsync(5);
        var result = await _controller.OkunmamisSayisi();
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task OkunduIsaretle_Basarili_200Doner()
    {
        _mock.Setup(s => s.OkunduIsaretle(3, 10)).ReturnsAsync(true);
        var result = await _controller.OkunduIsaretle(10);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task OkunduIsaretle_Bulunamadi_404Doner()
    {
        _mock.Setup(s => s.OkunduIsaretle(3, 99)).ReturnsAsync(false);
        var result = await _controller.OkunduIsaretle(99);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    private static ClaimsPrincipal KullaniciOlustur(int tuketiciId)
    {
        var identity = new GenericIdentity("test@test.com");
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, tuketiciId.ToString()));
        return new ClaimsPrincipal(identity);
    }
}
