using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IMarketService
{
    Task<List<MarketDto>> MarketleriGetir();
    Task<MarketDto?> MarketGetir(int marketId);
    Task<int> BasvuruOlustur(MarketBasvuruRequest request);
    Task BelgeEkle(int basvuruId, string belgeTuru, string dosyaYolu);
    Task<List<MarketBasvuruDto>> BasvurulariGetir();
}
