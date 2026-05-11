namespace TazeKalsin.API.Models;

public class RezervasyonDto
{
    public int Islem_ID { get; set; }
    public int Tuketici_ID { get; set; }
    public int? Urun_ID { get; set; }
    public int? Paket_ID { get; set; }
    public int Miktar { get; set; }
    public DateTime? Olusturma_Zamani { get; set; }
    public string PIN_Kodu { get; set; } = string.Empty;
    public string? Durum { get; set; }
    public decimal? Alinan_Fiyat { get; set; }
    public decimal? Edilen_Tasarruf { get; set; }
}

public class RezervasyonYapRequest
{
    public int? Urun_ID { get; set; }
    public int? Paket_ID { get; set; }
    public int Miktar { get; set; } = 1;
}
