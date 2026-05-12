namespace TazeKalsin.API.Services;

public interface ISatisService
{
    Task<string> SatisiOnayla(string pinKodu);
    Task<string> SatisiTamamla(string pinKodu);
}
