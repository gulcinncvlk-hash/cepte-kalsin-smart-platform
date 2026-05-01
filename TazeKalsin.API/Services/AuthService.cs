using TazeKalsin.API.Models;

namespace TazeKalsin.API.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;
    private readonly string _connectionString;

    public AuthService(IConfiguration config)
    {
        _config = config;
        _connectionString = config.GetConnectionString("TazeKalsinDB")!;
    }

    public Task<bool> EmailMevcutMu(string email) => throw new NotImplementedException();
    public Task<AuthResponse> KayitOl(RegisterRequest request) => throw new NotImplementedException();
    public Task<AuthResponse?> GirisYap(LoginRequest request) => throw new NotImplementedException();
    public Task<TuketiciDto?> KullaniciBul(int tuketiciId) => throw new NotImplementedException();
}
