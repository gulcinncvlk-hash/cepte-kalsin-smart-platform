namespace TazeKalsin.API.Models;

public class PaketOlusturRequest
{
    public int Market_ID { get; set; }
    public string Paket_Adi { get; set; } = string.Empty;
    public decimal Normal_Fiyat { get; set; }
    public decimal Indirimli_Fiyat { get; set; }
    public int Stok_Adedi { get; set; }
    public DateTime Son_Satis_Saati { get; set; }
}

public class PaketUrunEkleRequest
{
    public int Urun_ID { get; set; }
    public int Miktar { get; set; } = 1;
}
