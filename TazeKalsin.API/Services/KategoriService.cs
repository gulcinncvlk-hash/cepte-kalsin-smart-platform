using Microsoft.Data.SqlClient;
using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class KategoriService : IKategoriService
{
    private readonly string _connectionString;

    public KategoriService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public async Task<List<KategoriDto>> KategorileriGetir()
    {
        var liste = new List<KategoriDto>();
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand("SELECT Kategori_ID, Kategori_Adi FROM Kategori ORDER BY Kategori_Adi", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            liste.Add(new KategoriDto { Kategori_ID = reader.GetInt32(0), Kategori_Adi = reader.GetString(1) });
        return liste;
    }
}
