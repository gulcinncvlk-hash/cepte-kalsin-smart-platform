using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IKategoriService
{
    Task<List<KategoriDto>> KategorileriGetir();
}
