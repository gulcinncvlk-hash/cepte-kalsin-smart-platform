using Microsoft.Data.SqlClient;
using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class FavoriService : IFavoriService
{
    private readonly string _connectionString;

    public FavoriService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<List<UrunDto>> FavorileriGetir(int tuketiciId)
    {
        var liste = new List<UrunDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            SELECT u.Urun_ID, u.Market_ID, u.Urun_Adi, u.Normal_Fiyat, u.Indirimli_Fiyat,
                   u.Son_Tuketim_Tarihi, u.Stok_Miktari, u.Barkod, u.Kategori_ID, k.Kategori_Adi, u.SKT
            FROM Favori f
            JOIN Urun u ON f.Urun_ID = u.Urun_ID
            LEFT JOIN Kategori k ON u.Kategori_ID = k.Kategori_ID
            WHERE f.Tuketici_ID = @tid
            ORDER BY f.Eklenme_Tarihi DESC", conn);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(new UrunDto
            {
                Urun_ID = reader.GetInt32(0), Market_ID = reader.GetInt32(1),
                Urun_Adi = reader.GetString(2), Normal_Fiyat = reader.GetDecimal(3),
                Indirimli_Fiyat = reader.GetDecimal(4), Son_Tuketim_Tarihi = reader.GetDateTime(5),
                Stok_Miktari = reader.GetInt32(6), Barkod = reader.IsDBNull(7) ? null : reader.GetString(7),
                Kategori_ID = reader.IsDBNull(8) ? null : reader.GetInt32(8),
                Kategori_Adi = reader.IsDBNull(9) ? null : reader.GetString(9),
                SKT = reader.IsDBNull(10) ? null : reader.GetDateTime(10)
            });
        return liste;
    }

    public async Task FavoriEkle(int tuketiciId, int urunId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            IF NOT EXISTS (SELECT 1 FROM Favori WHERE Tuketici_ID = @tid AND Urun_ID = @uid)
                INSERT INTO Favori (Tuketici_ID, Urun_ID) VALUES (@tid, @uid)", conn);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        cmd.Parameters.AddWithValue("@uid", urunId);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<bool> FavoriKaldir(int tuketiciId, int urunId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(
            "DELETE FROM Favori WHERE Tuketici_ID = @tid AND Urun_ID = @uid", conn);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        cmd.Parameters.AddWithValue("@uid", urunId);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }
}
