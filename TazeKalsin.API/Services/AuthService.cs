using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

    public async Task<bool> EmailMevcutMu(string email)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();
        var cmd = new SqlCommand("SELECT COUNT(1) FROM Tuketici WHERE Email = @email", conn);
        cmd.Parameters.AddWithValue("@email", email);
        var count = (int)(await cmd.ExecuteScalarAsync())!;
        return count > 0;
    }

    public async Task<AuthResponse> KayitOl(RegisterRequest request)
    {
        var sifreHash = BCrypt.Net.BCrypt.HashPassword(request.Sifre);

        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        var cmd = new SqlCommand(@"
            INSERT INTO Tuketici (Ad_Soyad, Email, Sifre_Hash)
            VALUES (@ad_soyad, @email, @sifre_hash);
            SELECT CAST(SCOPE_IDENTITY() AS INT);", conn);

        cmd.Parameters.AddWithValue("@ad_soyad", request.Ad_Soyad);
        cmd.Parameters.AddWithValue("@email", request.Email);
        cmd.Parameters.AddWithValue("@sifre_hash", sifreHash);

        var newId = (int)(await cmd.ExecuteScalarAsync())!;
        var token = TokenUret(newId, request.Email, request.Ad_Soyad);

        return new AuthResponse { Token = token, Ad_Soyad = request.Ad_Soyad, Email = request.Email };
    }

    public async Task<AuthResponse?> GirisYap(LoginRequest request)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        var cmd = new SqlCommand(
            "SELECT Tuketici_ID, Ad_Soyad, Sifre_Hash FROM Tuketici WHERE Email = @email", conn);
        cmd.Parameters.AddWithValue("@email", request.Email);

        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;

        var tuketiciId = reader.GetInt32(0);
        var adSoyad = reader.GetString(1);
        var hash = reader.GetString(2);

        if (!BCrypt.Net.BCrypt.Verify(request.Sifre, hash)) return null;

        var token = TokenUret(tuketiciId, request.Email, adSoyad);
        return new AuthResponse { Token = token, Ad_Soyad = adSoyad, Email = request.Email };
    }

    public async Task<TuketiciDto?> KullaniciBul(int tuketiciId)
    {
        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        var cmd = new SqlCommand(
            "SELECT Tuketici_ID, Ad_Soyad, Email, Kurtarilan_Gida_Kg FROM Tuketici WHERE Tuketici_ID = @id",
            conn);
        cmd.Parameters.AddWithValue("@id", tuketiciId);

        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;

        return new TuketiciDto
        {
            Tuketici_ID = reader.GetInt32(0),
            Ad_Soyad = reader.GetString(1),
            Email = reader.GetString(2),
            Kurtarilan_Gida_Kg = reader.IsDBNull(3) ? 0 : reader.GetDouble(3)
        };
    }

    private string TokenUret(int tuketiciId, string email, string adSoyad)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiry = int.Parse(_config["JWT:ExpiryDays"]!);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, tuketiciId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim("name", adSoyad)
        };

        var token = new JwtSecurityToken(
            issuer: _config["JWT:Issuer"],
            audience: _config["JWT:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiry),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
