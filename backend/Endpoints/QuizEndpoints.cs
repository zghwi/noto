using Microsoft.EntityFrameworkCore;

using backend.DTOs;

public static class QuizEndpoints
{
    public static void MapQuizEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/quizzes/{fileId:Guid}", CreateQuizAsync);
        app.MapGet("/quizzes/{fileId:Guid}", GetQuizByFileIdAsync);
        app.MapDelete("/quizzes/{fileId:Guid}", DeleteQuizAsync);
        app.MapGet("/quiz/{quizId:Guid}", GetQuizByIdAsync);
        app.MapGet("/user_quizzes", GetUserQuizzesAsync);
        app.MapPost("/update_quiz_score/{quizId:Guid}", UpdateQuizScoreAsync).RequireAuthorization();
    }

    private static async Task<IResult> CreateQuizAsync(
        Guid fileId, 
        QuizDto body, 
        HttpContext http, 
        AppDbContext db)
    {
        var username = http.User.Identity?.Name;
        if (username == null)
            return Results.Unauthorized();

        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return Results.Unauthorized();

        var existingQuiz = await db.Quizzes.FirstOrDefaultAsync(q => q.FileId == fileId && q.UserId == user.Id);
        if (existingQuiz != null)
        {
            db.Quizzes.Remove(existingQuiz);
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
    }

    private static async Task<IResult> GetQuizByFileIdAsync(
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

        var quiz = await db.Quizzes.FirstOrDefaultAsync(q => q.FileId == file.Id && q.UserId == user.Id);
        if (quiz == null)
            return Results.NotFound(new { message = "Quiz not found" });

        return Results.Ok(new
        {
            quiz.Id,
            quiz.Questions,
            quiz.Score
        });
    }

    private static async Task<IResult> DeleteQuizAsync(
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

        var quiz = await db.Quizzes.FirstOrDefaultAsync(q => q.FileId == fileId && q.UserId == user.Id);
        if (quiz == null)
            return Results.NotFound(new { message = "Quiz not found" });

        db.Quizzes.Remove(quiz);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "Quiz deleted successfully" });
    }

    private static async Task<IResult> GetQuizByIdAsync(
        Guid quizId, 
        HttpContext http, 
        AppDbContext db)
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
    }

    private static async Task<IResult> GetUserQuizzesAsync(
        HttpContext http, 
        AppDbContext db)
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

        return Results.Ok(quizzes.Select(q => new
        {
            q.Id,
            q.Questions,
            q.Score
        }));
    }

    private static async Task<IResult> UpdateQuizScoreAsync(
        Guid quizId, 
        UpdateScoreDto body, 
        HttpContext http, 
        AppDbContext db)
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
    }
}