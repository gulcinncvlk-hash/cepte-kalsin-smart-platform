using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/favoriler")]
[Authorize]
public class FavoriController : ControllerBase
{
    private readonly IFavoriService _favoriService;

    public FavoriController(IFavoriService favoriService)
    {
        _favoriService = favoriService;
    }

    [HttpGet]
    public async Task<IActionResult> FavorileriGetir()
    {
        var tid = TuketiciIdAl();
        if (tid == null) return Unauthorized();
        return Ok(await _favoriService.FavorileriGetir(tid.Value));
    }

    [HttpPost("{urunId:int}")]
    public async Task<IActionResult> FavoriEkle(int urunId)
    {
        var tid = TuketiciIdAl();
        if (tid == null) return Unauthorized();
        await _favoriService.FavoriEkle(tid.Value, urunId);
        return StatusCode(201, new { message = "Favorilere eklendi." });
    }

    [HttpDelete("{urunId:int}")]
    public async Task<IActionResult> FavoriKaldir(int urunId)
    {
        var tid = TuketiciIdAl();
        if (tid == null) return Unauthorized();
        var kaldirildi = await _favoriService.FavoriKaldir(tid.Value, urunId);
        if (!kaldirildi) return NotFound(new { message = "Favori bulunamadı." });
        return Ok(new { message = "Favorilerden kaldırıldı." });
    }

    private int? TuketiciIdAl()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }
}
