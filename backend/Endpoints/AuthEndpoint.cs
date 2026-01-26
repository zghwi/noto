using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using backend.DTOs;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/signup", SignupAsync);
        app.MapPost("/signin", SigninAsync);
    }

    private static async Task<IResult> SignupAsync(
        AppDbContext db, 
        SignupDto request)
    {
        if (await db.Users.AnyAsync(u => u.Username == request.Username))
            return Results.BadRequest("Username already exists");

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Name = request.Name,
            Username = request.Username,
            Password = hashedPassword
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Results.Json(new
        {
            message = "Success",
            user = new { user.Id, user.Name, user.Username }
        });
    }

    private static async Task<IResult> SigninAsync(
        AppDbContext db, 
        LoginDto request, 
        IConfiguration config)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null)
            return Results.BadRequest("Invalid username or password");

        bool valid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!valid)
            return Results.BadRequest("Invalid username or password");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("fullname", user.Name)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(24),
            signingCredentials: creds
        );

        return Results.Json(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            username = user.Username,
            name = user.Name
        });
    }
}