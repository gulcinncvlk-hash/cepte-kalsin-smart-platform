namespace TazeKalsin.API.Models;

public class PaketDto
{
    public int Paket_ID { get; set; }
    public int Market_ID { get; set; }
    public string Paket_Adi { get; set; } = string.Empty;
    public decimal Normal_Fiyat { get; set; }
    public decimal Indirimli_Fiyat { get; set; }
    public int Stok_Adedi { get; set; }
    public DateTime Son_Satis_Saati { get; set; }
    public DateTime? Olusturma_Tarihi { get; set; }
    public List<PaketUrunDto> Urunler { get; set; } = new();
}

public class PaketUrunDto
{
    public int Urun_ID { get; set; }
    public string Urun_Adi { get; set; } = string.Empty;
    public int Miktar { get; set; }
}
