public class File
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required Guid UserId { get; set; } // relation
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public required string Name { get; set; }
    public required string ContentType { get; set; }
    public required byte[] Data { get; set; }
}