namespace TazeKalsin.API.Models;

public class TuketiciDto
{
    public int Tuketici_ID { get; set; }
    public string Ad_Soyad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public double Kurtarilan_Gida_Kg { get; set; }
}
