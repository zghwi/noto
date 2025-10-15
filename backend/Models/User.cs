public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
}