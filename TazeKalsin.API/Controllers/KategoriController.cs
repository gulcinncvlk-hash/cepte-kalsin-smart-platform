using Microsoft.AspNetCore.Mvc;
using TazeKalsin.API.Services;

namespace TazeKalsin.API.Controllers;

[ApiController]
[Route("api/kategoriler")]
public class KategoriController : ControllerBase
{
    private readonly IKategoriService _kategoriService;

    public KategoriController(IKategoriService kategoriService)
    {
        _kategoriService = kategoriService;
    }

    [HttpGet]
    public async Task<IActionResult> KategorileriGetir()
    {
        var liste = await _kategoriService.KategorileriGetir();
        return Ok(liste);
    }
}
