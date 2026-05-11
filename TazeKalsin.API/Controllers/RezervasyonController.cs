using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/rezervasyonlar")]
[Authorize]
public class RezervasyonController : ControllerBase
{
    private readonly IRezervasyonService _rezervasyonService;

    public RezervasyonController(IRezervasyonService rezervasyonService)
    {
        _rezervasyonService = rezervasyonService;
    }

    [HttpPost]
    public async Task<IActionResult> RezervasyonYap([FromBody] RezervasyonYapRequest request)
    {
        var tuketiciId = TuketiciIdAl();
        if (tuketiciId == null) return Unauthorized();

        if (request.Miktar < 1)
            return BadRequest(new { message = "Miktar en az 1 olmalıdır." });

        try
        {
            var rezervasyon = await _rezervasyonService.RezervasyonYap(tuketiciId.Value, request);
            return StatusCode(201, rezervasyon);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> RezervasyonlariGetir()
    {
        var tuketiciId = TuketiciIdAl();
        if (tuketiciId == null) return Unauthorized();

        var liste = await _rezervasyonService.RezervasyonlariGetir(tuketiciId.Value);
        return Ok(liste);
    }

    [HttpPatch("{id:int}/iptal")]
    public async Task<IActionResult> RezervasyonIptal(int id)
    {
        var tuketiciId = TuketiciIdAl();
        if (tuketiciId == null) return Unauthorized();

        var iptalEdildi = await _rezervasyonService.RezervasyonIptal(tuketiciId.Value, id);
        if (!iptalEdildi)
            return NotFound(new { message = "Rezervasyon bulunamadı veya zaten tamamlanmış/iptal edilmiş." });

        return Ok(new { message = "Rezervasyon iptal edildi." });
    }

    private int? TuketiciIdAl()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }
}
