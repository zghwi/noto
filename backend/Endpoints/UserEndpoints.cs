using Microsoft.EntityFrameworkCore;

using backend.DTOs;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/profile", GetProfileAsync).RequireAuthorization();
        app.MapPost("/update_profile", UpdateProfileAsync);
        app.MapDelete("/delete_account", DeleteAccountAsync);
        app.MapDelete("/delete_data", DeleteDataAsync).RequireAuthorization();
        app.MapGet("/get_user/{id:Guid}", GetUserByIdAsync);
    }

    private static async Task<IResult> GetProfileAsync(
        HttpContext http, 
        AppDbContext db)
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
    }

    private static async Task<IResult> UpdateProfileAsync(
        UpdateDto body, 
        HttpContext http, 
        AppDbContext db)
    {
        var currentUsername = http.User.Identity?.Name;
        if (currentUsername == null)
            return Results.Unauthorized();

        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == currentUsername);
        if (user == null)
            return Results.Unauthorized();

        user.Name = body.name;
        await db.SaveChangesAsync();

        return Results.Ok(new
        {
            message = "Profile updated successfully",
            user = new { user.Name }
        });
    }

    private static async Task<IResult> DeleteAccountAsync(
        AppDbContext db, 
        HttpContext http)
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
    }

    private static async Task<IResult> DeleteDataAsync(
        HttpContext http, 
        AppDbContext db)
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
    }

    private static async Task<IResult> GetUserByIdAsync(
        Guid id, 
        HttpContext http, 
        AppDbContext db)
    {
        var username = http.User.Identity?.Name;
        if (username == null)
            return Results.Unauthorized();

        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return Results.Unauthorized();

        var targetUser = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (targetUser == null)
            return Results.NotFound(new { message = "User not found" });

        return Results.Ok(new
        {
            targetUser.Id,
            targetUser.Name,
            targetUser.Username
        });
    }
}