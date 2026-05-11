using Microsoft.AspNetCore.Mvc;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/markets")]
public class MarketController : ControllerBase
{
    private readonly IMarketService _marketService;
    private readonly IWebHostEnvironment _env;

    public MarketController(IMarketService marketService, IWebHostEnvironment env)
    {
        _marketService = marketService;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> MarketleriGetir()
    {
        var liste = await _marketService.MarketleriGetir();
        return Ok(liste);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> MarketGetir(int id)
    {
        var market = await _marketService.MarketGetir(id);
        if (market == null) return NotFound(new { message = "Market bulunamadı." });
        return Ok(market);
    }

    [HttpPost("basvuru")]
    public async Task<IActionResult> BasvuruOlustur([FromBody] MarketBasvuruRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Zincir_Adi) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Telefon))
            return BadRequest(new { message = "Zincir adı, email ve telefon zorunludur." });

        var basvuruId = await _marketService.BasvuruOlustur(request);
        return StatusCode(201, new { Basvuru_ID = basvuruId, message = "Başvurunuz alındı, inceleme sürecindedir." });
    }

    [HttpPost("basvuru/{basvuruId:int}/belge")]
    public async Task<IActionResult> BelgeYukle(int basvuruId, IFormFile dosya, [FromQuery] string belgeTuru)
    {
        if (dosya == null || dosya.Length == 0)
            return BadRequest(new { message = "Geçerli bir dosya seçiniz." });

        if (string.IsNullOrWhiteSpace(belgeTuru))
            return BadRequest(new { message = "Belge türü zorunludur." });

        var klasor = Path.Combine(_env.WebRootPath ?? "wwwroot", "belgeler", basvuruId.ToString());
        Directory.CreateDirectory(klasor);

        var dosyaAdi = $"{Guid.NewGuid()}_{Path.GetFileName(dosya.FileName)}";
        var dosyaYolu = Path.Combine(klasor, dosyaAdi);

        using (var stream = new FileStream(dosyaYolu, FileMode.Create))
            await dosya.CopyToAsync(stream);

        var goruntulenenYol = $"/belgeler/{basvuruId}/{dosyaAdi}";
        await _marketService.BelgeEkle(basvuruId, belgeTuru, goruntulenenYol);

        return StatusCode(201, new { Dosya_Yolu = goruntulenenYol, message = "Belge yüklendi." });
    }

    [HttpGet("basvurular")]
    public async Task<IActionResult> BasvurulariGetir()
    {
        var liste = await _marketService.BasvurulariGetir();
        return Ok(liste);
    }
}
