using Microsoft.Data.SqlClient;
using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class PaketService : IPaketService
{
    private readonly string _connectionString;

    public PaketService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<List<PaketDto>> AktifPaketleriGetir()
    {
        var liste = new List<PaketDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            SELECT Paket_ID, Market_ID, Paket_Adi, Normal_Fiyat, Indirimli_Fiyat,
                   Stok_Adedi, Son_Satis_Saati, Olusturma_Tarihi
            FROM Paket
            WHERE Stok_Adedi > 0 AND Son_Satis_Saati >= GETDATE()
            ORDER BY Son_Satis_Saati", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(MapPaket(reader));
        return liste;
    }

    public async Task<PaketDto?> PaketGetir(int paketId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        var cmd = new SqlCommand(@"
            SELECT Paket_ID, Market_ID, Paket_Adi, Normal_Fiyat, Indirimli_Fiyat,
                   Stok_Adedi, Son_Satis_Saati, Olusturma_Tarihi
            FROM Paket WHERE Paket_ID = @id", conn);
        cmd.Parameters.AddWithValue("@id", paketId);
        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        var paket = MapPaket(reader);
        await reader.CloseAsync();

        var urunCmd = new SqlCommand(@"
            SELECT pud.Urun_ID, u.Urun_Adi, pud.Miktar
            FROM Paket_Urun_Detay pud
            JOIN Urun u ON pud.Urun_ID = u.Urun_ID
            WHERE pud.Paket_ID = @pid", conn);
        urunCmd.Parameters.AddWithValue("@pid", paketId);
        using var urunReader = await urunCmd.ExecuteReaderAsync();
        while (await urunReader.ReadAsync())
            paket.Urunler.Add(new PaketUrunDto
            {
                Urun_ID  = urunReader.GetInt32(0),
                Urun_Adi = urunReader.GetString(1),
                Miktar   = urunReader.IsDBNull(2) ? 1 : urunReader.GetInt32(2)
            });
        return paket;
    }

    public async Task<int> PaketOlustur(PaketOlusturRequest request)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            INSERT INTO Paket (Market_ID, Paket_Adi, Normal_Fiyat, Indirimli_Fiyat, Stok_Adedi, Son_Satis_Saati)
            VALUES (@mid, @ad, @nf, @inf, @stok, @sss);
            SELECT CAST(SCOPE_IDENTITY() AS INT);", conn);
        cmd.Parameters.AddWithValue("@mid", request.Market_ID);
        cmd.Parameters.AddWithValue("@ad", request.Paket_Adi);
        cmd.Parameters.AddWithValue("@nf", request.Normal_Fiyat);
        cmd.Parameters.AddWithValue("@inf", request.Indirimli_Fiyat);
        cmd.Parameters.AddWithValue("@stok", request.Stok_Adedi);
        cmd.Parameters.AddWithValue("@sss", request.Son_Satis_Saati);
        return (int)(await cmd.ExecuteScalarAsync())!;
    }

    public async Task UrunEkle(int paketId, PaketUrunEkleRequest request)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            IF EXISTS (SELECT 1 FROM Paket_Urun_Detay WHERE Paket_ID = @pid AND Urun_ID = @uid)
                UPDATE Paket_Urun_Detay SET Miktar = @miktar WHERE Paket_ID = @pid AND Urun_ID = @uid
            ELSE
                INSERT INTO Paket_Urun_Detay (Paket_ID, Urun_ID, Miktar) VALUES (@pid, @uid, @miktar)", conn);
        cmd.Parameters.AddWithValue("@pid", paketId);
        cmd.Parameters.AddWithValue("@uid", request.Urun_ID);
        cmd.Parameters.AddWithValue("@miktar", request.Miktar);
        await cmd.ExecuteNonQueryAsync();
    }

    private static PaketDto MapPaket(SqlDataReader r) => new()
    {
        Paket_ID         = r.GetInt32(0),
        Market_ID        = r.GetInt32(1),
        Paket_Adi        = r.GetString(2),
        Normal_Fiyat     = r.GetDecimal(3),
        Indirimli_Fiyat  = r.GetDecimal(4),
        Stok_Adedi       = r.GetInt32(5),
        Son_Satis_Saati  = r.GetDateTime(6),
        Olusturma_Tarihi = r.IsDBNull(7) ? null : r.GetDateTime(7)
    };
}
