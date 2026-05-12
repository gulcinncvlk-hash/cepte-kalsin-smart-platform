using Microsoft.AspNetCore.Mvc;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/satis")]
public class SatisController : ControllerBase
{
    private readonly ISatisService _satisService;

    public SatisController(ISatisService satisService)
    {
        _satisService = satisService;
    }

    [HttpPost("onayla")]
    public async Task<IActionResult> SatisiOnayla([FromBody] PinRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PIN_Kodu))
            return BadRequest(new { message = "PIN kodu zorunludur." });
        try
        {
            var mesaj = await _satisService.SatisiOnayla(request.PIN_Kodu);
            return Ok(new { message = mesaj });
        }
        catch (Exception ex) when (ex.Message.Contains("Geçersiz") || ex.Message.Contains("Kritik"))
        {
            return BadRequest(new { message = "Geçersiz PIN kodu veya süresi dolmuş rezervasyon." });
        }
    }

    [HttpPost("tamamla")]
    public async Task<IActionResult> SatisiTamamla([FromBody] PinRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PIN_Kodu))
            return BadRequest(new { message = "PIN kodu zorunludur." });
        try
        {
            var mesaj = await _satisService.SatisiTamamla(request.PIN_Kodu);
            return Ok(new { message = mesaj });
        }
        catch (Exception ex) when (ex.Message.Contains("geçersiz") || ex.Message.Contains("Hata"))
        {
            return BadRequest(new { message = "Geçersiz PIN kodu veya süresi dolmuş rezervasyon." });
        }
    }
}

public record PinRequest(string PIN_Kodu);
