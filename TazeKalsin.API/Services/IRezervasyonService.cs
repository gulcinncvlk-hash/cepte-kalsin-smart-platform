using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IRezervasyonService
{
    Task<RezervasyonDto> RezervasyonYap(int tuketiciId, RezervasyonYapRequest request);
    Task<List<RezervasyonDto>> RezervasyonlariGetir(int tuketiciId);
    Task<bool> RezervasyonIptal(int tuketiciId, int islemId);
}
