using Microsoft.Data.SqlClient;
using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class RezervasyonService : IRezervasyonService
{
    private readonly string _connectionString;

    public RezervasyonService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<RezervasyonDto> RezervasyonYap(int tuketiciId, RezervasyonYapRequest request)
    {
        if (request.Urun_ID == null && request.Paket_ID == null)
            throw new ArgumentException("Urun_ID veya Paket_ID belirtilmelidir.");

        if (request.Urun_ID != null && request.Paket_ID != null)
            throw new ArgumentException("Aynı anda hem Urun_ID hem Paket_ID belirtilemez.");

        var pinKodu = PinUret();

        if (request.Urun_ID.HasValue)
            return await UrunRezervasyonuYap(tuketiciId, request.Urun_ID.Value, request.Miktar, pinKodu);

        return await PaketRezervasyonuYap(tuketiciId, request.Paket_ID!.Value, pinKodu);
    }

    private async Task<RezervasyonDto> UrunRezervasyonuYap(int tuketiciId, int urunId, int miktar, string pinKodu)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand("EXEC sp_Rezervasyon_Yapar @p_Tuketici_ID, @p_Urun_ID, @p_Miktar, @p_PIN_Kodu", conn);
        cmd.Parameters.AddWithValue("@p_Tuketici_ID", tuketiciId);
        cmd.Parameters.AddWithValue("@p_Urun_ID", urunId);
        cmd.Parameters.AddWithValue("@p_Miktar", miktar);
        cmd.Parameters.AddWithValue("@p_PIN_Kodu", pinKodu);
        await cmd.ExecuteNonQueryAsync();

        return await RezervasyonuGetirByPin(conn, pinKodu);
    }

    private async Task<RezervasyonDto> PaketRezervasyonuYap(int tuketiciId, int paketId, string pinKodu)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        using var tx = conn.BeginTransaction();
        try
        {
            var stokCmd = new SqlCommand(
                "SELECT Stok_Adedi, Indirimli_Fiyat, Normal_Fiyat FROM Paket WITH (UPDLOCK, ROWLOCK) WHERE Paket_ID = @pid",
                conn, tx);
            stokCmd.Parameters.AddWithValue("@pid", paketId);
            using var reader = await stokCmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
                throw new InvalidOperationException("Paket bulunamadı.");

            var stok    = reader.GetInt32(0);
            var indirimli = reader.GetDecimal(1);
            var normal  = reader.GetDecimal(2);
            await reader.CloseAsync();

            if (stok < 1) throw new InvalidOperationException("Bu paket tükenmiştir.");

            var insertCmd = new SqlCommand(@"
                INSERT INTO Rezervasyon (Tuketici_ID, Urun_ID, Paket_ID, Miktar, PIN_Kodu, Alinan_Fiyat, Edilen_Tasarruf)
                VALUES (@tid, NULL, @pid, 1, @pin, @alinan, @tasarruf);
                SELECT CAST(SCOPE_IDENTITY() AS INT);", conn, tx);
            insertCmd.Parameters.AddWithValue("@tid", tuketiciId);
            insertCmd.Parameters.AddWithValue("@pid", paketId);
            insertCmd.Parameters.AddWithValue("@pin", pinKodu);
            insertCmd.Parameters.AddWithValue("@alinan", indirimli);
            insertCmd.Parameters.AddWithValue("@tasarruf", normal - indirimli);
            var islemId = (int)(await insertCmd.ExecuteScalarAsync())!;

            var stokCmd2 = new SqlCommand(
                "UPDATE Paket SET Stok_Adedi = Stok_Adedi - 1 WHERE Paket_ID = @pid", conn, tx);
            stokCmd2.Parameters.AddWithValue("@pid", paketId);
            await stokCmd2.ExecuteNonQueryAsync();

            await tx.CommitAsync();

            return new RezervasyonDto
            {
                Islem_ID = islemId, Tuketici_ID = tuketiciId, Paket_ID = paketId,
                Miktar = 1, PIN_Kodu = pinKodu, Durum = "Bekliyor",
                Alinan_Fiyat = indirimli, Edilen_Tasarruf = normal - indirimli
            };
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<List<RezervasyonDto>> RezervasyonlariGetir(int tuketiciId)
    {
        var liste = new List<RezervasyonDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            SELECT Islem_ID, Tuketici_ID, Urun_ID, Paket_ID, Miktar,
                   Olusturma_Zamani, PIN_Kodu, Durum, Alinan_Fiyat, Edilen_Tasarruf
            FROM Rezervasyon WHERE Tuketici_ID = @tid
            ORDER BY Olusturma_Zamani DESC", conn);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(MapRezervasyonu(reader));
        return liste;
    }

    public async Task<bool> RezervasyonIptal(int tuketiciId, int islemId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand(@"
            UPDATE Rezervasyon SET Durum = 'Iptal'
            WHERE Islem_ID = @id AND Tuketici_ID = @tid AND Durum = 'Bekliyor'", conn);
        cmd.Parameters.AddWithValue("@id", islemId);
        cmd.Parameters.AddWithValue("@tid", tuketiciId);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    private async Task<RezervasyonDto> RezervasyonuGetirByPin(SqlConnection conn, string pin)
    {
        var cmd = new SqlCommand(@"
            SELECT Islem_ID, Tuketici_ID, Urun_ID, Paket_ID, Miktar,
                   Olusturma_Zamani, PIN_Kodu, Durum, Alinan_Fiyat, Edilen_Tasarruf
            FROM Rezervasyon WHERE PIN_Kodu = @pin", conn);
        cmd.Parameters.AddWithValue("@pin", pin);
        using var reader = await cmd.ExecuteReaderAsync();
        await reader.ReadAsync();
        return MapRezervasyonu(reader);
    }

    private static RezervasyonDto MapRezervasyonu(SqlDataReader r) => new()
    {
        Islem_ID         = r.GetInt32(0),
        Tuketici_ID      = r.GetInt32(1),
        Urun_ID          = r.IsDBNull(2) ? null : r.GetInt32(2),
        Paket_ID         = r.IsDBNull(3) ? null : r.GetInt32(3),
        Miktar           = r.GetInt32(4),
        Olusturma_Zamani = r.IsDBNull(5) ? null : r.GetDateTime(5),
        PIN_Kodu         = r.GetString(6),
        Durum            = r.IsDBNull(7) ? null : r.GetString(7),
        Alinan_Fiyat     = r.IsDBNull(8) ? null : r.GetDecimal(8),
        Edilen_Tasarruf  = r.IsDBNull(9) ? null : r.GetDecimal(9)
    };

    private static string PinUret() =>
        Random.Shared.Next(100000, 999999).ToString();
}
