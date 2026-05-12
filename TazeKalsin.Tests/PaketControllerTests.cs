using Microsoft.AspNetCore.Mvc;
using Moq;
using TazeKalsin.API.Controllers;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.Tests;

public class PaketControllerTests
{
    private readonly Mock<IPaketService> _mock;
    private readonly PaketController _controller;

    public PaketControllerTests()
    {
        _mock = new Mock<IPaketService>();
        _controller = new PaketController(_mock.Object);
    }

    [Fact]
    public async Task PaketGetir_Bulunamadi_404Doner()
    {
        _mock.Setup(s => s.PaketGetir(99)).ReturnsAsync((PaketDto?)null);
        var result = await _controller.PaketGetir(99);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task PaketGetir_Basarili_200Doner()
    {
        _mock.Setup(s => s.PaketGetir(1)).ReturnsAsync(new PaketDto { Paket_ID = 1 });
        var result = await _controller.PaketGetir(1);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task PaketOlustur_AdiBos_400Doner()
    {
        var request = new PaketOlusturRequest
        {
            Paket_Adi = "",
            Normal_Fiyat = 100, Indirimli_Fiyat = 50, Stok_Adedi = 5
        };
        var result = await _controller.PaketOlustur(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task PaketOlustur_IndirimliYuksek_400Doner()
    {
        var request = new PaketOlusturRequest
        {
            Paket_Adi = "Kutu",
            Normal_Fiyat = 50, Indirimli_Fiyat = 60, Stok_Adedi = 5
        };
        var result = await _controller.PaketOlustur(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task PaketOlustur_StokSifir_400Doner()
    {
        var request = new PaketOlusturRequest
        {
            Paket_Adi = "Kutu",
            Normal_Fiyat = 100, Indirimli_Fiyat = 50, Stok_Adedi = 0
        };
        var result = await _controller.PaketOlustur(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task PaketOlustur_Gecerli_201Doner()
    {
        _mock.Setup(s => s.PaketOlustur(It.IsAny<PaketOlusturRequest>())).ReturnsAsync(42);
        var request = new PaketOlusturRequest
        {
            Paket_Adi = "Sürpriz Kutu",
            Normal_Fiyat = 100, Indirimli_Fiyat = 49, Stok_Adedi = 3,
            Son_Satis_Saati = DateTime.Now.AddHours(2)
        };
        var result = await _controller.PaketOlustur(request);
        var obj = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, obj.StatusCode);
    }

    [Fact]
    public async Task UrunEkle_MiktarSifir_400Doner()
    {
        var request = new PaketUrunEkleRequest { Urun_ID = 1, Miktar = 0 };
        var result = await _controller.UrunEkle(1, request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UrunEkle_Gecerli_201Doner()
    {
        _mock.Setup(s => s.UrunEkle(1, It.IsAny<PaketUrunEkleRequest>())).Returns(Task.CompletedTask);
        var request = new PaketUrunEkleRequest { Urun_ID = 2, Miktar = 1 };
        var result = await _controller.UrunEkle(1, request);
        var obj = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, obj.StatusCode);
    }
}
