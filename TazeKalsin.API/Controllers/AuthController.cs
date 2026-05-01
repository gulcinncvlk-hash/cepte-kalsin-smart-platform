using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TazeKalsin.API.Models;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (request.Sifre.Length < 8)
            return BadRequest(new { message = "Şifre en az 8 karakter olmalıdır." });

        if (await _authService.EmailMevcutMu(request.Email))
            return Conflict(new { message = "Bu email adresi zaten kayıtlı." });

        var response = await _authService.KayitOl(request);
        return StatusCode(201, response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.GirisYap(request);
        if (response == null)
            return Unauthorized(new { message = "Email veya şifre hatalı." });

        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (idClaim == null || !int.TryParse(idClaim, out var tuketiciId))
            return Unauthorized();

        var user = await _authService.KullaniciBul(tuketiciId);
        if (user == null) return NotFound();

        return Ok(user);
    }
}
