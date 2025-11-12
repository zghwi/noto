public class CardsPack
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid FileId { get; set; }
    public required string Cards { get; set; }
}