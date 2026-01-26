using Microsoft.EntityFrameworkCore;

public static class FileEndpoints
{
    public static void MapFileEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/upload", UploadFileAsync).RequireAuthorization();
        app.MapGet("/files", GetFilesAsync);
        app.MapGet("/files/{id:Guid}", GetFileByIdAsync);
        app.MapDelete("/files/{id:Guid}", DeleteFileAsync).RequireAuthorization();
    }

    private static async Task<IResult> UploadFileAsync(
        HttpRequest request, 
        AppDbContext db, 
        HttpContext http)
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
    }

    private static async Task<IResult> GetFilesAsync(
        HttpContext http, 
        AppDbContext db)
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
    }

    private static async Task<IResult> GetFileByIdAsync(
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
    }

    private static async Task<IResult> DeleteFileAsync(
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

        var file = await db.Files.FirstOrDefaultAsync(f => f.Id == id && f.UserId == user.Id);
        if (file == null)
            return Results.NotFound(new { message = "File not found" });

        db.Files.Remove(file);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = $"'{file.Name}' was deleted successfully" });
    }
}