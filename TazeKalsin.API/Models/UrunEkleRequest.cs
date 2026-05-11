namespace TazeKalsin.API.Models;

public class UrunEkleRequest
{
    public int Market_ID { get; set; }
    public string Urun_Adi { get; set; } = string.Empty;
    public decimal Normal_Fiyat { get; set; }
    public decimal Indirimli_Fiyat { get; set; }
    public DateTime Son_Tuketim_Tarihi { get; set; }
    public int Stok_Miktari { get; set; }
    public string? Barkod { get; set; }
    public int? Kategori_ID { get; set; }
    public DateTime? SKT { get; set; }
}
