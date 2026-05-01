using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public interface IAuthService
{
    Task<bool> EmailMevcutMu(string email);
    Task<AuthResponse> KayitOl(RegisterRequest request);
    Task<AuthResponse?> GirisYap(LoginRequest request);
    Task<TuketiciDto?> KullaniciBul(int tuketiciId);
}
