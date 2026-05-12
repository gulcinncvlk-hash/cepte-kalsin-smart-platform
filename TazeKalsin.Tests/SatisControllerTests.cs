using Microsoft.AspNetCore.Mvc;
using Moq;
using TazeKalsin.API.Controllers;
using TazeKalsin.API.Services;

namespace TazeKalsin.Tests;

public class SatisControllerTests
{
    private readonly Mock<ISatisService> _mock;
    private readonly SatisController _controller;

    public SatisControllerTests()
    {
        _mock = new Mock<ISatisService>();
        _controller = new SatisController(_mock.Object);
    }

    [Fact]
    public async Task SatisiOnayla_BosPIN_400Doner()
    {
        var result = await _controller.SatisiOnayla(new PinRequest(""));
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task SatisiOnayla_GecersizPIN_400Doner()
    {
        _mock.Setup(s => s.SatisiOnayla("000000"))
             .ThrowsAsync(new Exception("Geçersiz PIN kodu"));
        var result = await _controller.SatisiOnayla(new PinRequest("000000"));
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task SatisiOnayla_Basarili_200Doner()
    {
        _mock.Setup(s => s.SatisiOnayla("123456")).ReturnsAsync("Satış onaylandı.");
        var result = await _controller.SatisiOnayla(new PinRequest("123456"));
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task SatisiTamamla_BosPIN_400Doner()
    {
        var result = await _controller.SatisiTamamla(new PinRequest("   "));
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task SatisiTamamla_GecersizPIN_400Doner()
    {
        _mock.Setup(s => s.SatisiTamamla("000000"))
             .ThrowsAsync(new Exception("geçersiz rezervasyon"));
        var result = await _controller.SatisiTamamla(new PinRequest("000000"));
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task SatisiTamamla_Basarili_200Doner()
    {
        _mock.Setup(s => s.SatisiTamamla("123456")).ReturnsAsync("Satış tamamlandı.");
        var result = await _controller.SatisiTamamla(new PinRequest("123456"));
        Assert.IsType<OkObjectResult>(result);
    }
}
