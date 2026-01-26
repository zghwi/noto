using Microsoft.EntityFrameworkCore;

using backend.DTOs;
public static class CardsPackEndpoints
{
    public static void MapCardsPackEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/cardspacks/{fileId:Guid}", CreateCardsPackAsync);
        app.MapGet("/cardspacks/{fileId:Guid}", GetCardsPackByFileIdAsync);
        app.MapDelete("/cardspacks/{fileId:Guid}", DeleteCardsPackAsync);
        app.MapGet("/user_cardspacks", GetUserCardsPacksAsync);
    }

    private static async Task<IResult> CreateCardsPackAsync(
        Guid fileId, 
        CardsPackDto body, 
        HttpContext http, 
        AppDbContext db)
    {
        var username = http.User.Identity?.Name;
        if (username == null)
            return Results.Unauthorized();

        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return Results.Unauthorized();

        var existingCardsPack = await db.CardsPacks.FirstOrDefaultAsync(cp => cp.FileId == fileId && cp.UserId == user.Id);
        if (existingCardsPack != null)
        {
            db.CardsPacks.Remove(existingCardsPack);
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
    }

    private static async Task<IResult> GetCardsPackByFileIdAsync(
        Guid fileId, 
        HttpContext http, 
        AppDbContext db)
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

        var cardsPack = await db.CardsPacks.FirstOrDefaultAsync(c => c.FileId == file.Id && c.UserId == user.Id);
        if (cardsPack == null)
            return Results.NotFound(new { message = "Pack not found" });

        return Results.Ok(new
        {
            cardsPack.Id,
            cardsPack.Cards,
        });
    }

    private static async Task<IResult> DeleteCardsPackAsync(
        Guid fileId, 
        AppDbContext db, 
        HttpContext http)
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
    }

    private static async Task<IResult> GetUserCardsPacksAsync(
        HttpContext http, 
        AppDbContext db)
    {
        var username = http.User.Identity?.Name;
        if (username == null)
            return Results.Unauthorized();

        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return Results.Unauthorized();

        var cardsPacks = await db.CardsPacks
            .Where(c => c.UserId == user.Id)
            .ToListAsync();

        return Results.Ok(cardsPacks.Select(c => new { c.Id, c.Cards }));
    }
}