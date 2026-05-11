using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/urunler")]
public class UrunController : ControllerBase
{
    private readonly IUrunService _urunService;

    public UrunController(IUrunService urunService)
    {
        _urunService = urunService;
    }

    [HttpGet("market/{marketId:int}")]
    public async Task<IActionResult> MarketUrunleriGetir(int marketId)
    {
        var liste = await _urunService.MarketUrunleriGetir(marketId);
        return Ok(liste);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> UrunGetir(int id)
    {
        var urun = await _urunService.UrunGetir(id);
        if (urun == null) return NotFound(new { message = "Ürün bulunamadı." });
        return Ok(urun);
    }

    [HttpGet("skt-yakin")]
    public async Task<IActionResult> SKTYakinUrunler([FromQuery] int gun = 3)
    {
        if (gun < 1 || gun > 30)
            return BadRequest(new { message = "Gün sayısı 1-30 arasında olmalıdır." });
        var liste = await _urunService.SKTYakinUrunleriGetir(gun);
        return Ok(liste);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> UrunEkle([FromBody] UrunEkleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Urun_Adi))
            return BadRequest(new { message = "Ürün adı zorunludur." });

        if (request.Indirimli_Fiyat >= request.Normal_Fiyat)
            return BadRequest(new { message = "İndirimli fiyat normal fiyattan düşük olmalıdır." });

        if (request.Stok_Miktari < 0)
            return BadRequest(new { message = "Stok miktarı negatif olamaz." });

        var urunId = await _urunService.UrunEkle(request);
        return StatusCode(201, new { Urun_ID = urunId });
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UrunGuncelle(int id, [FromBody] UrunGuncelleRequest request)
    {
        if (request.Indirimli_Fiyat.HasValue && request.Normal_Fiyat.HasValue &&
            request.Indirimli_Fiyat >= request.Normal_Fiyat)
            return BadRequest(new { message = "İndirimli fiyat normal fiyattan düşük olmalıdır." });

        var guncellendi = await _urunService.UrunGuncelle(id, request);
        if (!guncellendi) return NotFound(new { message = "Ürün bulunamadı." });
        return Ok(new { message = "Ürün güncellendi." });
    }
}
