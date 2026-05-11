using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IPaketService
{
    Task<List<PaketDto>> AktifPaketleriGetir();
    Task<PaketDto?> PaketGetir(int paketId);
    Task<int> PaketOlustur(PaketOlusturRequest request);
    Task UrunEkle(int paketId, PaketUrunEkleRequest request);
}
