using Microsoft.Data.SqlClient;
using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class MarketService : IMarketService
{
    private readonly string _connectionString;

    public MarketService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<List<MarketDto>> MarketleriGetir()
    {
        var liste = new List<MarketDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(
            "SELECT Market_ID, Market_Adi, Adres, Konum_Enlem, Konum_Boylam, Acilis_Saati, Kapanis_Saati FROM Market WHERE Onay_Durumu = 1",
            conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(MapMarket(reader));
        return liste;
    }

    public async Task<MarketDto?> MarketGetir(int marketId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(
            "SELECT Market_ID, Market_Adi, Adres, Konum_Enlem, Konum_Boylam, Acilis_Saati, Kapanis_Saati FROM Market WHERE Market_ID = @id AND Onay_Durumu = 1",
            conn);
        cmd.Parameters.AddWithValue("@id", marketId);
        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return MapMarket(reader);
    }

    public async Task<int> BasvuruOlustur(MarketBasvuruRequest request)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            INSERT INTO Market_Basvuru (Zincir_Adi, Sube_Adi, Sehir, Ilce, Yetkili_Ad_Soyad, Telefon, Email)
            VALUES (@zincir, @sube, @sehir, @ilce, @yetkili, @telefon, @email);
            SELECT CAST(SCOPE_IDENTITY() AS INT);", conn);
        cmd.Parameters.AddWithValue("@zincir", request.Zincir_Adi);
        cmd.Parameters.AddWithValue("@sube", request.Sube_Adi);
        cmd.Parameters.AddWithValue("@sehir", request.Sehir);
        cmd.Parameters.AddWithValue("@ilce", request.Ilce);
        cmd.Parameters.AddWithValue("@yetkili", request.Yetkili_Ad_Soyad);
        cmd.Parameters.AddWithValue("@telefon", request.Telefon);
        cmd.Parameters.AddWithValue("@email", request.Email);
        return (int)(await cmd.ExecuteScalarAsync())!;
    }

    public async Task BelgeEkle(int basvuruId, string belgeTuru, string dosyaYolu)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(
            "INSERT INTO Basvuru_Belge (Basvuru_ID, Belge_Turu, Dosya_Yolu) VALUES (@bid, @tur, @yol)",
            conn);
        cmd.Parameters.AddWithValue("@bid", basvuruId);
        cmd.Parameters.AddWithValue("@tur", belgeTuru);
        cmd.Parameters.AddWithValue("@yol", dosyaYolu);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<List<MarketBasvuruDto>> BasvurulariGetir()
    {
        var liste = new List<MarketBasvuruDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(
            "SELECT Basvuru_ID, Zincir_Adi, Sube_Adi, Sehir, Ilce, Yetkili_Ad_Soyad, Telefon, Email, Basvuru_Tarihi, Durum FROM Market_Basvuru ORDER BY Basvuru_Tarihi DESC",
            conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            liste.Add(new MarketBasvuruDto
            {
                Basvuru_ID    = reader.GetInt32(0),
                Zincir_Adi    = reader.GetString(1),
                Sube_Adi      = reader.GetString(2),
                Sehir         = reader.GetString(3),
                Ilce          = reader.GetString(4),
                Yetkili_Ad_Soyad = reader.GetString(5),
                Telefon       = reader.GetString(6),
                Email         = reader.GetString(7),
                Basvuru_Tarihi = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                Durum         = reader.IsDBNull(9) ? null : reader.GetString(9)
            });
        }
        return liste;
    }

    private static MarketDto MapMarket(SqlDataReader r) => new()
    {
        Market_ID    = r.GetInt32(0),
        Market_Adi   = r.GetString(1),
        Adres        = r.IsDBNull(2) ? null : r.GetString(2),
        Konum_Enlem  = r.IsDBNull(3) ? null : r.GetDouble(3),
        Konum_Boylam = r.IsDBNull(4) ? null : r.GetDouble(4),
        Acilis_Saati  = r.IsDBNull(5) ? null : r.GetTimeSpan(5).ToString(@"hh\:mm"),
        Kapanis_Saati = r.IsDBNull(6) ? null : r.GetTimeSpan(6).ToString(@"hh\:mm")
    };
}
