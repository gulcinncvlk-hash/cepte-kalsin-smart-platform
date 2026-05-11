using Microsoft.Data.SqlClient;
using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class UrunService : IUrunService
{
    private readonly string _connectionString;

    public UrunService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<List<UrunDto>> MarketUrunleriGetir(int marketId)
    {
        var liste = new List<UrunDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            SELECT u.Urun_ID, u.Market_ID, u.Urun_Adi, u.Normal_Fiyat, u.Indirimli_Fiyat,
                   u.Son_Tuketim_Tarihi, u.Stok_Miktari, u.Barkod, u.Kategori_ID, k.Kategori_Adi, u.SKT
            FROM Urun u
            LEFT JOIN Kategori k ON u.Kategori_ID = k.Kategori_ID
            WHERE u.Market_ID = @marketId AND u.Stok_Miktari > 0
            ORDER BY u.Son_Tuketim_Tarihi", conn);
        cmd.Parameters.AddWithValue("@marketId", marketId);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(MapUrun(reader));
        return liste;
    }

    public async Task<UrunDto?> UrunGetir(int urunId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            SELECT u.Urun_ID, u.Market_ID, u.Urun_Adi, u.Normal_Fiyat, u.Indirimli_Fiyat,
                   u.Son_Tuketim_Tarihi, u.Stok_Miktari, u.Barkod, u.Kategori_ID, k.Kategori_Adi, u.SKT
            FROM Urun u
            LEFT JOIN Kategori k ON u.Kategori_ID = k.Kategori_ID
            WHERE u.Urun_ID = @id", conn);
        cmd.Parameters.AddWithValue("@id", urunId);
        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return MapUrun(reader);
    }

    public async Task<List<UrunDto>> SKTYakinUrunleriGetir(int gunSayisi)
    {
        var liste = new List<UrunDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            SELECT u.Urun_ID, u.Market_ID, u.Urun_Adi, u.Normal_Fiyat, u.Indirimli_Fiyat,
                   u.Son_Tuketim_Tarihi, u.Stok_Miktari, u.Barkod, u.Kategori_ID, k.Kategori_Adi, u.SKT
            FROM Urun u
            LEFT JOIN Kategori k ON u.Kategori_ID = k.Kategori_ID
            WHERE u.Stok_Miktari > 0
              AND u.Son_Tuketim_Tarihi <= DATEADD(DAY, @gun, GETDATE())
              AND u.Son_Tuketim_Tarihi >= GETDATE()
            ORDER BY u.Son_Tuketim_Tarihi", conn);
        cmd.Parameters.AddWithValue("@gun", gunSayisi);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(MapUrun(reader));
        return liste;
    }

    public async Task<int> UrunEkle(UrunEkleRequest request)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            INSERT INTO Urun (Market_ID, Urun_Adi, Normal_Fiyat, Indirimli_Fiyat,
                              Son_Tuketim_Tarihi, Stok_Miktari, Barkod, Kategori_ID, SKT)
            VALUES (@mid, @ad, @nf, @inf, @stt, @stok, @barkod, @kid, @skt);
            SELECT CAST(SCOPE_IDENTITY() AS INT);", conn);
        cmd.Parameters.AddWithValue("@mid", request.Market_ID);
        cmd.Parameters.AddWithValue("@ad", request.Urun_Adi);
        cmd.Parameters.AddWithValue("@nf", request.Normal_Fiyat);
        cmd.Parameters.AddWithValue("@inf", request.Indirimli_Fiyat);
        cmd.Parameters.AddWithValue("@stt", request.Son_Tuketim_Tarihi);
        cmd.Parameters.AddWithValue("@stok", request.Stok_Miktari);
        cmd.Parameters.AddWithValue("@barkod", (object?)request.Barkod ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@kid", (object?)request.Kategori_ID ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@skt", (object?)request.SKT ?? DBNull.Value);
        return (int)(await cmd.ExecuteScalarAsync())!;
    }

    public async Task<bool> UrunGuncelle(int urunId, UrunGuncelleRequest request)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            UPDATE Urun SET
                Urun_Adi           = COALESCE(@ad, Urun_Adi),
                Normal_Fiyat       = COALESCE(@nf, Normal_Fiyat),
                Indirimli_Fiyat    = COALESCE(@inf, Indirimli_Fiyat),
                Son_Tuketim_Tarihi = COALESCE(@stt, Son_Tuketim_Tarihi),
                Stok_Miktari       = COALESCE(@stok, Stok_Miktari),
                Barkod             = COALESCE(@barkod, Barkod),
                Kategori_ID        = COALESCE(@kid, Kategori_ID),
                SKT                = COALESCE(@skt, SKT)
            WHERE Urun_ID = @id", conn);
        cmd.Parameters.AddWithValue("@id", urunId);
        cmd.Parameters.AddWithValue("@ad", (object?)request.Urun_Adi ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@nf", (object?)request.Normal_Fiyat ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@inf", (object?)request.Indirimli_Fiyat ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@stt", (object?)request.Son_Tuketim_Tarihi ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@stok", (object?)request.Stok_Miktari ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@barkod", (object?)request.Barkod ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@kid", (object?)request.Kategori_ID ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@skt", (object?)request.SKT ?? DBNull.Value);
        var rows = await cmd.ExecuteNonQueryAsync();
        return rows > 0;
    }

    private static UrunDto MapUrun(SqlDataReader r) => new()
    {
        Urun_ID            = r.GetInt32(0),
        Market_ID          = r.GetInt32(1),
        Urun_Adi           = r.GetString(2),
        Normal_Fiyat       = r.GetDecimal(3),
        Indirimli_Fiyat    = r.GetDecimal(4),
        Son_Tuketim_Tarihi = r.GetDateTime(5),
        Stok_Miktari       = r.GetInt32(6),
        Barkod             = r.IsDBNull(7) ? null : r.GetString(7),
        Kategori_ID        = r.IsDBNull(8) ? null : r.GetInt32(8),
        Kategori_Adi       = r.IsDBNull(9) ? null : r.GetString(9),
        SKT                = r.IsDBNull(10) ? null : r.GetDateTime(10)
    };
}
