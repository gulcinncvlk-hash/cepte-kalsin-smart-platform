namespace TazeKalsin.API.Models;

public class BildirimDto
{
    public int Bildirim_ID { get; set; }
    public string Baslik { get; set; } = string.Empty;
    public string Icerik { get; set; } = string.Empty;
    public string? Etiket { get; set; }
    public DateTime? Tarih { get; set; }
    public bool Okundu_Mu { get; set; }
}
