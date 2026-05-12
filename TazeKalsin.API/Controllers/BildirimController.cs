using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/bildirimler")]
[Authorize]
public class BildirimController : ControllerBase
{
    private readonly IBildirimService _bildirimService;

    public BildirimController(IBildirimService bildirimService)
    {
        _bildirimService = bildirimService;
    }

    [HttpGet]
    public async Task<IActionResult> BildirimleriGetir()
    {
        var tid = TuketiciIdAl();
        if (tid == null) return Unauthorized();
        return Ok(await _bildirimService.BildirimleriGetir(tid.Value));
    }

    [HttpGet("sayac")]
    public async Task<IActionResult> OkunmamisSayisi()
    {
        var tid = TuketiciIdAl();
        if (tid == null) return Unauthorized();
        var sayi = await _bildirimService.OkunmamisSayisi(tid.Value);
        return Ok(new { okunmamis = sayi });
    }

    [HttpPatch("{id:int}/oku")]
    public async Task<IActionResult> OkunduIsaretle(int id)
    {
        var tid = TuketiciIdAl();
        if (tid == null) return Unauthorized();
        var guncellendi = await _bildirimService.OkunduIsaretle(tid.Value, id);
        if (!guncellendi) return NotFound(new { message = "Bildirim bulunamadı." });
        return Ok(new { message = "Bildirim okundu olarak işaretlendi." });
    }

    private int? TuketiciIdAl()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }
}
