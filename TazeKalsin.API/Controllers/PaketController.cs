using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/paketler")]
public class PaketController : ControllerBase
{
    private readonly IPaketService _paketService;

    public PaketController(IPaketService paketService)
    {
        _paketService = paketService;
    }

    [HttpGet]
    public async Task<IActionResult> AktifPaketleriGetir()
    {
        var liste = await _paketService.AktifPaketleriGetir();
        return Ok(liste);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> PaketGetir(int id)
    {
        var paket = await _paketService.PaketGetir(id);
        if (paket == null) return NotFound(new { message = "Paket bulunamadı." });
        return Ok(paket);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> PaketOlustur([FromBody] PaketOlusturRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Paket_Adi))
            return BadRequest(new { message = "Paket adı zorunludur." });

        if (request.Indirimli_Fiyat >= request.Normal_Fiyat)
            return BadRequest(new { message = "İndirimli fiyat normal fiyattan düşük olmalıdır." });

        if (request.Stok_Adedi < 1)
            return BadRequest(new { message = "Stok adedi en az 1 olmalıdır." });

        var paketId = await _paketService.PaketOlustur(request);
        return StatusCode(201, new { Paket_ID = paketId });
    }

    [Authorize]
    [HttpPost("{id:int}/urunler")]
    public async Task<IActionResult> UrunEkle(int id, [FromBody] PaketUrunEkleRequest request)
    {
        if (request.Miktar < 1)
            return BadRequest(new { message = "Miktar en az 1 olmalıdır." });

        await _paketService.UrunEkle(id, request);
        return StatusCode(201, new { message = "Ürün pakete eklendi." });
    }
}
