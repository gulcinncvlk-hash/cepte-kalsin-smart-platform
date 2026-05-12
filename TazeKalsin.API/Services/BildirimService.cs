using Microsoft.Data.SqlClient;
using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class BildirimService : IBildirimService
{
    private readonly string _connectionString;

    public BildirimService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<List<BildirimDto>> BildirimleriGetir(int tuketiciId)
    {
        var liste = new List<BildirimDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            SELECT Bildirim_ID, Baslik, Icerik, Etiket, Tarih, Okundu_Mu
            FROM Bildirim WHERE Tuketici_ID = @tid
            ORDER BY Tarih DESC", conn);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(new BildirimDto
            {
                Bildirim_ID = reader.GetInt32(0),
                Baslik      = reader.GetString(1),
                Icerik      = reader.GetString(2),
                Etiket      = reader.IsDBNull(3) ? null : reader.GetString(3),
                Tarih       = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                Okundu_Mu   = !reader.IsDBNull(5) && reader.GetBoolean(5)
            });
        return liste;
    }

    public async Task<bool> OkunduIsaretle(int tuketiciId, int bildirimId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            UPDATE Bildirim SET Okundu_Mu = 1
            WHERE Bildirim_ID = @bid AND Tuketici_ID = @tid", conn);
        cmd.Parameters.AddWithValue("@bid", bildirimId);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<int> OkunmamisSayisi(int tuketiciId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(
            "SELECT COUNT(1) FROM Bildirim WHERE Tuketici_ID = @tid AND (Okundu_Mu = 0 OR Okundu_Mu IS NULL)",
            conn);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        return (int)(await cmd.ExecuteScalarAsync())!;
    }
}
