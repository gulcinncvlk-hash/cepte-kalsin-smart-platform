using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using System.Security.Principal;
using TazeKalsin.API.Controllers;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.Tests;

public class FavoriControllerTests
{
    private readonly Mock<IFavoriService> _mock;
    private readonly FavoriController _controller;

    public FavoriControllerTests()
    {
        _mock = new Mock<IFavoriService>();
        _controller = new FavoriController(_mock.Object);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = KullaniciOlustur(7) }
        };
    }

    [Fact]
    public async Task FavorileriGetir_200Doner()
    {
        _mock.Setup(s => s.FavorileriGetir(7)).ReturnsAsync(new List<UrunDto>());
        var result = await _controller.FavorileriGetir();
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task FavoriEkle_201Doner()
    {
        _mock.Setup(s => s.FavoriEkle(7, 3)).Returns(Task.CompletedTask);
        var result = await _controller.FavoriEkle(3);
        var obj = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, obj.StatusCode);
    }

    [Fact]
    public async Task FavoriKaldir_Bulunamadi_404Doner()
    {
        _mock.Setup(s => s.FavoriKaldir(7, 99)).ReturnsAsync(false);
        var result = await _controller.FavoriKaldir(99);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task FavoriKaldir_Basarili_200Doner()
    {
        _mock.Setup(s => s.FavoriKaldir(7, 3)).ReturnsAsync(true);
        var result = await _controller.FavoriKaldir(3);
        Assert.IsType<OkObjectResult>(result);
    }

    private static ClaimsPrincipal KullaniciOlustur(int tuketiciId)
    {
        var identity = new GenericIdentity("test@test.com");
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, tuketiciId.ToString()));
        return new ClaimsPrincipal(identity);
    }
}
