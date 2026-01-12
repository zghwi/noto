using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL") ?? builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000", "https://noto-pi.vercel.app")
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

app.MapPost("/quizzes/{fileId:Guid}", async (Guid fileId, QuizDto body, HttpRequest request, AppDbContext db, HttpContext http) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();
    var q = await db.Quizzes.FirstOrDefaultAsync(q => q.FileId == fileId && q.UserId == user.Id);
    if (q != null)
    {
        db.Quizzes.Remove(q);
        await db.SaveChangesAsync();
    }
    var quiz = new Quiz
    {
        Questions = body.questions,
        UserId = user.Id,
        FileId = fileId
    };
    db.Quizzes.Add(quiz);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Quiz created successfully" });
});

app.MapPost("/update_quiz_score/{quizId:Guid}", async (Guid quizId, UpdateScoreDto body, HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var quiz = await db.Quizzes.FirstOrDefaultAsync(q => q.Id == quizId && q.UserId == user.Id);
    if (quiz == null)
        return Results.NotFound(new { message = "Quiz not found" });

    quiz.Score = body.score;
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Quiz score updated successfully", quizId = quiz.Id, score = quiz.Score });
}).RequireAuthorization();

app.MapPost("/update_profile", async (UpdateDto body, HttpRequest request, AppDbContext db, HttpContext http) =>
{
    var currentUsername = http.User.Identity?.Name;
    if (currentUsername == null)
        return Results.Unauthorized();

    var user = await db.Users
        .FirstOrDefaultAsync(u => u.Username == currentUsername);

    if (user == null)
        return Results.Unauthorized();

    user.Name = body.name;

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Profile updated successfully",
        user = new { user.Name }
    });
});

app.MapDelete("/delete_account", async (AppDbContext db, HttpContext http) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    db.Users.Remove(user);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Account deleted successfully" });
});

app.MapPost("/delete_data", async (HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var quizzes = db.Quizzes.Where(q => q.UserId == user.Id);
    var cardspacks = db.CardsPacks.Where(c => c.UserId == user.Id);

    db.Quizzes.RemoveRange(quizzes);
    db.CardsPacks.RemoveRange(cardspacks);

    await db.SaveChangesAsync();

    return Results.Ok(new { message = "All quizzes and cards packs deleted successfully." });
}).RequireAuthorization();


app.MapPost("/cardspacks/{fileId:Guid}", async (Guid fileId, CardsPackDto body, HttpRequest request, AppDbContext db, HttpContext http) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var c = await db.CardsPacks.FirstOrDefaultAsync(cp => cp.FileId == fileId && cp.UserId == user.Id);
    if (c != null)
    {
        db.CardsPacks.Remove(c);
        await db.SaveChangesAsync();
    }
    var cardsPack = new CardsPack
    {
        Cards = body.cards,
        UserId = user.Id,
        FileId = fileId
    };

    db.CardsPacks.Add(cardsPack);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Cards pack created successfully" });
});

app.MapDelete("/quizzes/{fileId:Guid}", async (Guid fileId, AppDbContext db, HttpContext http) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var quiz = await db.Quizzes.FirstOrDefaultAsync(q => q.FileId == fileId && q.UserId == user.Id);
    if (quiz == null)
        return Results.NotFound(new { message = "Quiz not found" });

    db.Quizzes.Remove(quiz);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Quiz deleted successfully" });
});

app.MapDelete("/cardspacks/{fileId:Guid}", async (Guid fileId, AppDbContext db, HttpContext http) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var cardsPack = await db.CardsPacks.FirstOrDefaultAsync(cp => cp.FileId == fileId && cp.UserId == user.Id);
    if (cardsPack == null)
        return Results.NotFound(new { message = "Cards pack not found" });

    db.CardsPacks.Remove(cardsPack);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Cards pack deleted successfully" });
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

app.MapGet("/quizzes/{fileId:Guid}", async (Guid fileId, HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();
    var file = await db.Files.FirstOrDefaultAsync(f => f.Id == fileId && f.UserId == user.Id);
    if (file == null)
        return Results.NotFound(new { message = "File not found" });
    var quiz = await db.Quizzes.FirstOrDefaultAsync(q => q.FileId == file.Id && q.UserId == user.Id);
    if (quiz == null)
        return Results.NotFound(new { message = "Quiz not found" });
    return Results.Ok(new
    {
        quiz.Id,
        quiz.Questions,
        quiz.Score
    });
});

app.MapGet("/quiz/{quizId:Guid}", async (Guid quizId, HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var quiz = await db.Quizzes.FirstOrDefaultAsync(q => q.Id == quizId);
    if (quiz == null)
        return Results.NotFound(new { message = "Quiz not found" });
    
    return Results.Ok(new
    {
        quiz.Id,
        quiz.UserId,
        quiz.Questions,
        quiz.Score
    });
});

app.MapGet("/user_quizzes", async (HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var quizzes = await db.Quizzes
        .Where(q => q.UserId == user.Id)
        .ToListAsync();

    return Results.Ok(
        quizzes.Select(q => new
        {
            q.Id,
            q.Questions,
            q.Score
        })
    );
});


app.MapGet("/cardspacks/{fileId:Guid}", async (Guid fileId, HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();
    var file = await db.Files.FirstOrDefaultAsync(f => f.Id == fileId && f.UserId == user.Id);
    if (file == null)
        return Results.NotFound(new { message = "File not found" });
    var cardspack = await db.CardsPacks.FirstOrDefaultAsync(c => c.FileId == file.Id && c.UserId == user.Id);
    if (cardspack == null)
        return Results.NotFound(new { message = "Pack not found" });
    return Results.Ok(new
    {
        cardspack.Id,
        cardspack.Cards,
    });
});

app.MapGet("/user_cardspacks/", async (HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();
    var cardspacks = await db.CardsPacks.Where(c => c.UserId == user.Id).ToListAsync();

    return Results.Ok(cardspacks.Select(c => new { c.Id, c.Cards }));
});

app.MapGet("/get_user/{id:Guid}", async (Guid id, HttpContext http, AppDbContext db) =>
{
    var username = http.User.Identity?.Name;
    if (username == null)
        return Results.Unauthorized();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null)
        return Results.Unauthorized();

    var uuser = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
    if (uuser == null)
        return Results.NotFound(new { message = "User not found" });
    
    return Results.Ok(new
    {
        uuser.Id,
        uuser.Name,
        uuser.Username
    });
});


app.Run();

record SignupDto(string Name, string Username, string Password);
record LoginDto(string Username, string Password);
record UpdateDto(string name);
record QuizDto(string questions);
record CardsPackDto(string cards);
record UpdateScoreDto(int score);