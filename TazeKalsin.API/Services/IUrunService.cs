using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IUrunService
{
    Task<List<UrunDto>> MarketUrunleriGetir(int marketId);
    Task<UrunDto?> UrunGetir(int urunId);
    Task<List<UrunDto>> SKTYakinUrunleriGetir(int gunSayisi);
    Task<int> UrunEkle(UrunEkleRequest request);
    Task<bool> UrunGuncelle(int urunId, UrunGuncelleRequest request);
}
