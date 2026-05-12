using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IFavoriService
{
    Task<List<UrunDto>> FavorileriGetir(int tuketiciId);
    Task FavoriEkle(int tuketiciId, int urunId);
    Task<bool> FavoriKaldir(int tuketiciId, int urunId);
}
