namespace backend.DTOs;

public record SignupDto(string Name, string Username, string Password);
public record LoginDto(string Username, string Password);
public record UpdateDto(string name);
public record QuizDto(string questions);
public record CardsPackDto(string cards);
public record UpdateScoreDto(int score);