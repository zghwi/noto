using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapPost("/signup", async (AppDbContext db, SignupDto request) =>
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
});

app.MapPost("/signin", async (AppDbContext db, LoginDto request, IConfiguration config) =>
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
});

app.MapPost("/upload", async (HttpRequest request, AppDbContext db, HttpContext http) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var form = await request.ReadFormAsync();
    var file = form.Files.GetFile("file");

    if (file == null || file.Length == 0)
        return Results.BadRequest("No file uploaded");

    using var memoryStream = new MemoryStream();
    await file.CopyToAsync(memoryStream);

    var newFile = new File
    {
        Name = file.FileName,
        Data = memoryStream.ToArray(),
        ContentType = file.ContentType,
        UserId = user.Id
    };

    db.Files.Add(newFile);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "File uploaded successfully", id = newFile.Id });
}).RequireAuthorization();


app.MapGet("/profile", async (HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    return Results.Json(new
    {
        user.Id,
        user.Name,
        user.Username
    });
}).RequireAuthorization();

app.MapGet("/files", async (HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var files = await db.Files
            .Where(f => f.UserId == user.Id)
            .ToListAsync();

    return Results.Ok(files);
});

app.MapDelete("/files/{id:Guid}", async (Guid id, HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var file = await db.Files.FirstOrDefaultAsync(f => f.Id == id && f.UserId == user.Id);
    if (file == null)
        return Results.NotFound(new { message = "File not found" });

    db.Files.Remove(file);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "'"+ file.Name + "' was deleted successfully" });
}).RequireAuthorization();

app.MapGet("/files/{id:Guid}", async (Guid id, HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var file = await db.Files.FirstOrDefaultAsync(f => f.Id == id && f.UserId == user.Id);
    if (file == null)
        return Results.NotFound(new { message = "File not found" });

    return Results.Ok(new
    {
        file.Id,
        file.Name,
        file.ContentType,
        file.Data
    });
});


app.Run();

record SignupDto(string Name, string Username, string Password);
record LoginDto(string Username, string Password);