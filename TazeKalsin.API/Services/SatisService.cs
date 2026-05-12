using Microsoft.Data.SqlClient;

namespace TazeKalsin.API.Services;

public class SatisService : ISatisService
{
    private readonly string _connectionString;

    public SatisService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<string> SatisiOnayla(string pinKodu)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand("EXEC sp_QR_Satis_Onayla @p_PIN_Kodu", conn);
        cmd.Parameters.AddWithValue("@p_PIN_Kodu", pinKodu);
        await cmd.ExecuteNonQueryAsync();
        return "Satış onaylandı. Kurtarılan gıda puanı güncellendi.";
    }

    public async Task<string> SatisiTamamla(string pinKodu)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand("EXEC sp_QR_Satis_Tamamla @p_PIN_Kodu", conn);
        cmd.Parameters.AddWithValue("@p_PIN_Kodu", pinKodu);
        await cmd.ExecuteNonQueryAsync();
        return "Satış tamamlandı. Çevre puanı artırıldı.";
    }
}
