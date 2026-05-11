namespace TazeKalsin.API.Models;

public class MarketDto
{
    public int Market_ID { get; set; }
    public string Market_Adi { get; set; } = string.Empty;
    public string? Adres { get; set; }
    public double? Konum_Enlem { get; set; }
    public double? Konum_Boylam { get; set; }
    public string? Acilis_Saati { get; set; }
    public string? Kapanis_Saati { get; set; }
}
