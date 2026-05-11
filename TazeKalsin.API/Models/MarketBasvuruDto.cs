namespace TazeKalsin.API.Models;

public class MarketBasvuruDto
{
    public int Basvuru_ID { get; set; }
    public string Zincir_Adi { get; set; } = string.Empty;
    public string Sube_Adi { get; set; } = string.Empty;
    public string Sehir { get; set; } = string.Empty;
    public string Ilce { get; set; } = string.Empty;
    public string Yetkili_Ad_Soyad { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? Basvuru_Tarihi { get; set; }
    public string? Durum { get; set; }
}
