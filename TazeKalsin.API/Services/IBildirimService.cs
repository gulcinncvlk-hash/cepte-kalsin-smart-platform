using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IBildirimService
{
    Task<List<BildirimDto>> BildirimleriGetir(int tuketiciId);
    Task<bool> OkunduIsaretle(int tuketiciId, int bildirimId);
    Task<int> OkunmamisSayisi(int tuketiciId);
}
