using Microsoft.AspNetCore.Mvc;
using Moq;
using TazeKalsin.API.Controllers;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.Tests;

public class UrunControllerTests
{
    private readonly Mock<IUrunService> _mock;
    private readonly UrunController _controller;

    public UrunControllerTests()
    {
        _mock = new Mock<IUrunService>();
        _controller = new UrunController(_mock.Object);
    }

    [Fact]
    public async Task SKTYakinUrunler_GunSifir_400Doner()
    {
        var result = await _controller.SKTYakinUrunler(0);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task SKTYakinUrunler_Gun31_400Doner()
    {
        var result = await _controller.SKTYakinUrunler(31);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task SKTYakinUrunler_GecerliGun_200Doner()
    {
        _mock.Setup(s => s.SKTYakinUrunleriGetir(3)).ReturnsAsync(new List<UrunDto>());
        var result = await _controller.SKTYakinUrunler(3);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task UrunGetir_Bulunamadi_404Doner()
    {
        _mock.Setup(s => s.UrunGetir(99)).ReturnsAsync((UrunDto?)null);
        var result = await _controller.UrunGetir(99);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UrunGetir_Basarili_200Doner()
    {
        _mock.Setup(s => s.UrunGetir(1)).ReturnsAsync(new UrunDto { Urun_ID = 1 });
        var result = await _controller.UrunGetir(1);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task UrunEkle_AdiBos_400Doner()
    {
        var request = new UrunEkleRequest
        {
            Urun_Adi = "", Normal_Fiyat = 100, Indirimli_Fiyat = 50
        };
        var result = await _controller.UrunEkle(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UrunEkle_IndirimliYuksek_400Doner()
    {
        var request = new UrunEkleRequest
        {
            Urun_Adi = "Ekmek", Normal_Fiyat = 30, Indirimli_Fiyat = 35
        };
        var result = await _controller.UrunEkle(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UrunEkle_StokNegatif_400Doner()
    {
        var request = new UrunEkleRequest
        {
            Urun_Adi = "Ekmek", Normal_Fiyat = 100, Indirimli_Fiyat = 50, Stok_Miktari = -1
        };
        var result = await _controller.UrunEkle(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UrunEkle_Gecerli_201Doner()
    {
        _mock.Setup(s => s.UrunEkle(It.IsAny<UrunEkleRequest>())).ReturnsAsync(10);
        var request = new UrunEkleRequest
        {
            Urun_Adi = "Ekmek", Normal_Fiyat = 100, Indirimli_Fiyat = 49,
            Stok_Miktari = 5, Son_Tuketim_Tarihi = DateTime.Now.AddDays(2)
        };
        var result = await _controller.UrunEkle(request);
        var obj = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, obj.StatusCode);
    }

    [Fact]
    public async Task UrunGuncelle_IndirimliYuksek_400Doner()
    {
        var request = new UrunGuncelleRequest { Normal_Fiyat = 50, Indirimli_Fiyat = 60 };
        var result = await _controller.UrunGuncelle(1, request);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UrunGuncelle_Bulunamadi_404Doner()
    {
        _mock.Setup(s => s.UrunGuncelle(99, It.IsAny<UrunGuncelleRequest>())).ReturnsAsync(false);
        var result = await _controller.UrunGuncelle(99, new UrunGuncelleRequest());
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
